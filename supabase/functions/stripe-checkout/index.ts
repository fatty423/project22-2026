import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

let stripe: Stripe | null = null;
let stripeInitError: string | null = null;

try {
  if (!stripeSecret) {
    stripeInitError = 'STRIPE_SECRET_KEY is not configured';
  } else {
    stripe = new Stripe(stripeSecret, {
      appInfo: {
        name: 'Bolt Integration',
        version: '1.0.0',
      },
    });
  }
} catch (err) {
  stripeInitError = err instanceof Error ? err.message : 'Failed to initialize Stripe';
}

function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
  };

  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse({}, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    if (!stripe) {
      console.error('Stripe not initialized:', stripeInitError);
      return corsResponse(
        { error: `Payment system unavailable: ${stripeInitError ?? 'unknown error'}` },
        500
      );
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return corsResponse({ error: 'Supabase is not configured on the server' }, 500);
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return corsResponse({ error: 'Invalid JSON body' }, 400);
    }

    const { price_id, success_url, cancel_url, mode, amount, currency, recurring_interval, veteran_id, fund } = body as {
      price_id?: string;
      success_url?: string;
      cancel_url?: string;
      mode?: string;
      amount?: number;
      currency?: string;
      recurring_interval?: string;
      veteran_id?: string;
      fund?: string;
    };

    if (!success_url || typeof success_url !== 'string') {
      return corsResponse({ error: 'Missing required parameter success_url' }, 400);
    }
    if (!cancel_url || typeof cancel_url !== 'string') {
      return corsResponse({ error: 'Missing required parameter cancel_url' }, 400);
    }

    const useCustomAmount = typeof amount === 'number';

    if (!useCustomAmount && !price_id) {
      return corsResponse({ error: 'Either price_id or amount is required' }, 400);
    }

    if (useCustomAmount) {
      if ((amount as number) < 500) {
        return corsResponse({ error: 'Minimum donation is $5.00' }, 400);
      }
      if (recurring_interval && !['month', 'year'].includes(recurring_interval)) {
        return corsResponse({ error: 'Invalid recurring_interval. Must be month or year' }, 400);
      }
    }

    if (!useCustomAmount) {
      if (!mode || !['payment', 'subscription'].includes(mode)) {
        return corsResponse({ error: 'Expected parameter mode to be one of payment, subscription' }, 400);
      }
    }

    const resolvedMode = useCustomAmount
      ? (recurring_interval ? 'subscription' : 'payment')
      : mode;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return corsResponse({ error: 'Missing Authorization header' }, 401);
    }
    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError) {
      console.error('getUser error:', getUserError);
      return corsResponse({ error: `Failed to authenticate user: ${getUserError.message}` }, 401);
    }

    if (!user) {
      return corsResponse({ error: 'User not found' }, 404);
    }

    const { data: customer, error: getCustomerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (getCustomerError) {
      console.error('Failed to fetch customer information from the database', getCustomerError);
      return corsResponse({ error: `Failed to fetch customer information: ${getCustomerError.message}` }, 500);
    }

    let customerId: string;

    if (!customer || !customer.customer_id) {
      let newCustomer: Stripe.Customer;
      try {
        newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user.id },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create Stripe customer';
        console.error('stripe.customers.create failed:', message);
        return corsResponse({ error: `Stripe error: ${message}` }, 500);
      }

      console.log(`Created new Stripe customer ${newCustomer.id} for user ${user.id}`);

      const { error: createCustomerError } = await supabase.from('stripe_customers').insert({
        user_id: user.id,
        customer_id: newCustomer.id,
      });

      if (createCustomerError) {
        console.error('Failed to save customer information in the database', createCustomerError);
        try {
          await stripe.customers.del(newCustomer.id);
          await supabase.from('stripe_subscriptions').delete().eq('customer_id', newCustomer.id);
        } catch (deleteError) {
          console.error('Failed to clean up after customer mapping error:', deleteError);
        }
        return corsResponse({ error: `Failed to create customer mapping: ${createCustomerError.message}` }, 500);
      }

      if (resolvedMode === 'subscription') {
        const { error: createSubscriptionError } = await supabase.from('stripe_subscriptions').insert({
          customer_id: newCustomer.id,
          status: 'not_started',
        });

        if (createSubscriptionError) {
          console.error('Failed to save subscription in the database', createSubscriptionError);
          try {
            await stripe.customers.del(newCustomer.id);
          } catch (deleteError) {
            console.error('Failed to delete Stripe customer after subscription creation error:', deleteError);
          }
          return corsResponse({ error: `Unable to save the subscription in the database: ${createSubscriptionError.message}` }, 500);
        }
      }

      customerId = newCustomer.id;
      console.log(`Successfully set up new customer ${customerId} with subscription record`);
    } else {
      customerId = customer.customer_id;

      if (resolvedMode === 'subscription') {
        const { data: subscription, error: getSubscriptionError } = await supabase
          .from('stripe_subscriptions')
          .select('status')
          .eq('customer_id', customerId)
          .is('deleted_at', null)
          .maybeSingle();

        if (getSubscriptionError) {
          console.error('Failed to fetch subscription information from the database', getSubscriptionError);
          return corsResponse({ error: `Failed to fetch subscription information: ${getSubscriptionError.message}` }, 500);
        }

        if (!subscription) {
          const { error: createSubscriptionError } = await supabase.from('stripe_subscriptions').insert({
            customer_id: customerId,
            status: 'not_started',
          });

          if (createSubscriptionError) {
            console.error('Failed to create subscription record for existing customer', createSubscriptionError);
            return corsResponse({ error: `Failed to create subscription record for existing customer: ${createSubscriptionError.message}` }, 500);
          }
        }
      }
    }

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];

    const isSponsorship = !!veteran_id;

    if (useCustomAmount) {
      let productName = recurring_interval ? 'Monthly Donation to Project 22' : 'Donation to Project 22';
      let productDesc = recurring_interval
        ? 'Recurring monthly donation supporting career training for veterans and first responders'
        : 'One-time donation supporting career training for veterans and first responders';

      if (isSponsorship) {
        productName = 'Sponsorship - Project 22';
        productDesc = 'Sponsorship contribution for career training and certification';
      }

      if (fund === 'doc-sclater') {
        productName = 'Doc Sclater Scholarship Fund - Project 22';
        productDesc = 'Donation to the Doc Sclater Scholarship funding AIO Executive Protection training for veterans';
      }

      const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
        currency: currency || 'usd',
        product_data: {
          name: productName,
          description: productDesc,
        },
        unit_amount: amount,
      };

      if (recurring_interval) {
        priceData.recurring = { interval: recurring_interval as 'month' | 'year' };
      }

      lineItems = [{ price_data: priceData, quantity: 1 }];
    } else {
      lineItems = [{ price: price_id, quantity: 1 }];
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: resolvedMode as 'payment' | 'subscription',
      success_url,
      cancel_url,
      metadata: {
        user_id: user.id,
        donation_type: resolvedMode === 'subscription' ? 'recurring' : 'one-time',
        ...(veteran_id ? { veteran_id } : {}),
        ...(fund ? { fund } : {}),
      },
    };

    if (resolvedMode === 'subscription') {
      sessionParams.subscription_data = {
        metadata: { user_id: user.id, ...(veteran_id ? { veteran_id } : {}), ...(fund ? { fund } : {}) },
      };
    } else {
      sessionParams.payment_intent_data = {
        metadata: { user_id: user.id, ...(veteran_id ? { veteran_id } : {}), ...(fund ? { fund } : {}) },
      };
    }

    try {
      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log(`Created checkout session ${session.id} for customer ${customerId}`);
      return corsResponse({ sessionId: session.id, url: session.url });
    } catch (err) {
      const stripeErr = err as Stripe.errors.StripeError;
      const message = stripeErr?.message ?? (err instanceof Error ? err.message : 'Stripe checkout session failed');
      console.error('stripe.checkout.sessions.create failed:', {
        message,
        type: stripeErr?.type,
        code: stripeErr?.code,
        param: stripeErr?.param,
      });
      return corsResponse({ error: `Stripe error: ${message}` }, 500);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Checkout error: ${message}`);
    return corsResponse({ error: message }, 500);
  }
});
