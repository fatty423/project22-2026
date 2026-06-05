import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    const body = await req.text();

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  if (event.type === 'invoice.payment_succeeded') {
    await handleInvoicePaymentSucceeded(stripeData as Stripe.Invoice);
    return;
  }

  if (!('customer' in stripeData)) {
    return;
  }

  if (event.type === 'payment_intent.succeeded' && event.data.object.invoice === null) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
  } else {
    let isSubscription = true;

    if (event.type === 'checkout.session.completed') {
      const { mode } = stripeData as Stripe.Checkout.Session;
      isSubscription = mode === 'subscription';
      console.info(`Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout session`);
    }

    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;

    if (isSubscription) {
      console.info(`Starting subscription sync for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    }

    if (event.type === 'checkout.session.completed') {
      await recordDonation(stripeData as Stripe.Checkout.Session, customerId, isSubscription);
    }

    if (!isSubscription && mode === 'payment' && payment_status === 'paid') {
      try {
        const {
          id: checkout_session_id,
          payment_intent,
          amount_subtotal,
          amount_total,
          currency,
        } = stripeData as Stripe.Checkout.Session;

        const { error: orderError } = await supabase.from('stripe_orders').insert({
          checkout_session_id,
          payment_intent_id: payment_intent,
          customer_id: customerId,
          amount_subtotal,
          amount_total,
          currency,
          payment_status,
          status: 'completed',
        });

        if (orderError) {
          console.error('Error inserting order:', orderError);
          return;
        }
        console.info(`Successfully processed one-time payment for session: ${checkout_session_id}`);
      } catch (error) {
        console.error('Error processing one-time payment:', error);
      }
    }
  }
}

async function applySponsorshipProgress(params: {
  donorId: string;
  veteranId: string;
  amount: number;
  isRecurring: boolean;
}) {
  const { donorId, veteranId, amount, isRecurring } = params;

  const { data: existing } = await supabase
    .from('sponsorships')
    .select('id, amount_committed')
    .eq('donor_id', donorId)
    .eq('veteran_id', veteranId)
    .maybeSingle();

  if (existing) {
    const newTotal = Number(existing.amount_committed || 0) + amount;
    const { error: updateErr } = await supabase
      .from('sponsorships')
      .update({
        amount_committed: newTotal,
        is_recurring: isRecurring || undefined,
      })
      .eq('id', existing.id);
    if (updateErr) console.error('Error updating sponsorship:', updateErr);
  } else {
    const { error: insertErr } = await supabase.from('sponsorships').insert({
      donor_id: donorId,
      veteran_id: veteranId,
      amount_committed: amount,
      is_recurring: isRecurring,
      status: 'active',
      started_at: new Date().toISOString(),
    });
    if (insertErr) console.error('Error inserting sponsorship:', insertErr);
  }

  const { error: rpcError } = await supabase.rpc('increment_veteran_raised', {
    p_veteran_id: veteranId,
    p_amount: amount,
  });
  if (rpcError) console.error('Error incrementing veteran raised:', rpcError);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (!invoice.subscription || typeof invoice.subscription !== 'string') {
      return;
    }
    if (invoice.billing_reason && invoice.billing_reason === 'subscription_create') {
      return;
    }

    const subscriptionId = invoice.subscription;
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : null;
    if (!customerId) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const veteranId = (subscription.metadata?.veteran_id as string | undefined) || null;
    const amountPaid = (invoice.amount_paid ?? 0) / 100;
    if (amountPaid <= 0) return;

    const { data: customerRecord } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('customer_id', customerId)
      .maybeSingle();
    if (!customerRecord) {
      console.error(`No user found for stripe customer ${customerId} on invoice`);
      return;
    }
    const donorId = customerRecord.user_id;

    const paymentId =
      typeof invoice.payment_intent === 'string'
        ? invoice.payment_intent
        : invoice.id;

    const { data: alreadyRecorded } = await supabase
      .from('donations')
      .select('id')
      .eq('stripe_payment_id', paymentId)
      .maybeSingle();
    if (alreadyRecorded) {
      console.info(`Invoice payment ${paymentId} already recorded, skipping`);
      return;
    }

    const { error: donationError } = await supabase.from('donations').insert({
      donor_id: donorId,
      veteran_id: veteranId,
      amount: amountPaid,
      is_recurring: true,
      stripe_payment_id: paymentId,
      stripe_subscription_id: subscriptionId,
      status: 'succeeded',
    });
    if (donationError) {
      console.error('Error recording recurring donation:', donationError);
      return;
    }

    const { data: donor } = await supabase
      .from('donors')
      .select('total_contributed')
      .eq('id', donorId)
      .maybeSingle();

    const newTotal = Number(donor?.total_contributed || 0) + amountPaid;
    const { error: updateError } = await supabase
      .from('donors')
      .update({ is_monthly_donor: true, total_contributed: newTotal })
      .eq('id', donorId);

    if (updateError) {
      console.error('Error updating donor total:', updateError);
    } else {
      console.info(`Updated donor ${donorId}: total_contributed now $${newTotal}`);
    }

    if (veteranId) {
      await applySponsorshipProgress({
        donorId,
        veteranId,
        amount: amountPaid,
        isRecurring: true,
      });
    }
    console.info(`Recorded recurring invoice payment of $${amountPaid} for user ${donorId}`);
  } catch (error) {
    console.error('Error in handleInvoicePaymentSucceeded:', error);
  }
}

async function recordDonation(session: Stripe.Checkout.Session, customerId: string, isSubscription: boolean) {
  try {
    const { data: customerRecord } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('customer_id', customerId)
      .maybeSingle();

    if (!customerRecord) {
      console.error(`No user found for stripe customer ${customerId}`);
      return;
    }

    const userId = customerRecord.user_id;
    const amountTotal = session.amount_total ?? 0;
    const donationAmount = amountTotal / 100;
    const veteranId = (session.metadata?.veteran_id as string | undefined) || null;

    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    const donorEmail = authUser?.user?.email || '';

    const { data: existingDonor } = await supabase
      .from('donors')
      .select('id, full_name, total_contributed')
      .eq('id', userId)
      .maybeSingle();

    let donorName = donorEmail.split('@')[0];

    // Try to get the real name from Stripe customer
    try {
      const stripeCustomer = await stripe.customers.retrieve(customerId);
      if (stripeCustomer && !stripeCustomer.deleted && stripeCustomer.name) {
        donorName = stripeCustomer.name;
      }
    } catch (err) {
      console.error('Failed to retrieve Stripe customer name:', err);
    }

    if (!existingDonor) {
      const { error: donorError } = await supabase.from('donors').insert({
        id: userId,
        full_name: donorName,
        email: donorEmail,
        is_monthly_donor: isSubscription,
        total_contributed: donationAmount,
        monthly_amount: isSubscription ? donationAmount : 0,
      });

      if (donorError) {
        console.error('Error creating donor record:', donorError);
      }
    } else {
      donorName = existingDonor.full_name || donorName;
      const newTotal = Number(existingDonor.total_contributed || 0) + donationAmount;
      const updates: Record<string, unknown> = { total_contributed: newTotal };
      if (isSubscription) {
        updates.is_monthly_donor = true;
        updates.monthly_amount = donationAmount;
      }
      const { error: updateError } = await supabase
        .from('donors')
        .update(updates)
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating donor record:', updateError);
      } else {
        console.info(`Updated donor ${donorName}: total_contributed now $${newTotal}`);
      }
    }

    const paymentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.id;

    const subscriptionId = typeof session.subscription === 'string'
      ? session.subscription
      : null;

    const { error: donationError } = await supabase.from('donations').insert({
      donor_id: userId,
      veteran_id: veteranId,
      amount: donationAmount,
      is_recurring: isSubscription,
      stripe_payment_id: paymentId,
      stripe_subscription_id: subscriptionId,
      status: 'succeeded',
    });

    if (donationError) {
      console.error('Error recording donation:', donationError);
    } else {
      console.info(`Recorded ${isSubscription ? 'recurring' : 'one-time'} donation of $${donationAmount} for user ${userId}`);

      if (veteranId) {
        await applySponsorshipProgress({
          donorId: userId,
          veteranId,
          amount: donationAmount,
          isRecurring: isSubscription,
        });
      }

      await sendDonationNotification({
        donorName,
        donorEmail,
        amount: donationAmount,
        isRecurring: isSubscription,
        veteranId,
        stripePaymentId: paymentId,
      });
    }
  } catch (error) {
    console.error('Error in recordDonation:', error);
  }
}

async function sendDonationNotification(params: {
  donorName: string;
  donorEmail: string;
  amount: number;
  isRecurring: boolean;
  veteranId: string | null;
  stripePaymentId: string;
}) {
  try {
    let veteranName: string | undefined;

    if (params.veteranId) {
      const { data: veteran } = await supabase
        .from('veterans')
        .select('first_name, last_initial')
        .eq('id', params.veteranId)
        .maybeSingle();

      if (veteran) {
        veteranName = `${veteran.first_name} ${veteran.last_initial}.`;
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        type: 'donation',
        donorName: params.donorName,
        donorEmail: params.donorEmail,
        amount: params.amount,
        isRecurring: params.isRecurring,
        veteranName,
        veteranId: params.veteranId ?? undefined,
        stripePaymentId: params.stripePaymentId,
        donationDate: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Failed to send donation notification email: ${body}`);
    } else {
      console.info('Donation notification email sent successfully');
    }
  } catch (error) {
    console.error('Error sending donation notification email:', error);
  }
}

async function syncCustomerFromStripe(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          subscription_status: 'not_started',
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }
    }

    const subscription = subscriptions.data[0];

    const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
      },
      {
        onConflict: 'customer_id',
      },
    );

    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}
