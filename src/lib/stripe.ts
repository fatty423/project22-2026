import { supabase } from './supabase';
import { STRIPE_PRODUCTS, StripeProduct } from '../stripe-config';

async function getFreshAccessToken(): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error('You are not signed in. Please log in to donate.');
  }

  const { data, error } = await supabase.auth.refreshSession();
  if (error || !data.session) {
    if (sessionData.session.access_token) {
      return sessionData.session.access_token;
    }
    throw new Error('Your session has expired. Please log in again.');
  }
  return data.session.access_token;
}

async function parseErrorResponse(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    if (body?.error) return typeof body.error === 'string' ? body.error : JSON.stringify(body.error);
    if (body?.message) return typeof body.message === 'string' ? body.message : JSON.stringify(body.message);
    if (body?.msg) return typeof body.msg === 'string' ? body.msg : JSON.stringify(body.msg);
    return fallback;
  } catch {
    try {
      const text = await response.text();
      if (text) return text;
    } catch {
      // ignore
    }
    return fallback;
  }
}

export async function createCheckoutSession(
  product: StripeProduct,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
  const accessToken = await getFreshAccessToken();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        price_id: product.priceId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode: product.mode,
      }),
    }
  );

  if (!response.ok) {
    const message = await parseErrorResponse(response, `Checkout failed (${response.status})`);
    throw new Error(message);
  }

  return response.json();
}

export async function createDonationCheckout(
  amountDollars: number,
  isRecurring: boolean,
  successUrl: string,
  cancelUrl: string,
  veteranId?: string,
  fund?: string
): Promise<{ sessionId: string; url: string }> {
  const accessToken = await getFreshAccessToken();
  const amountCents = Math.round(amountDollars * 100);

  const body: Record<string, unknown> = {
    amount: amountCents,
    currency: 'usd',
    recurring_interval: isRecurring ? 'month' : undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  if (veteranId) {
    body.veteran_id = veteranId;
  }

  if (fund) {
    body.fund = fund;
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const message = await parseErrorResponse(response, `Checkout failed (${response.status})`);
    throw new Error(message);
  }

  return response.json();
}

export async function openStripePortal(returnUrl: string): Promise<string> {
  const accessToken = await getFreshAccessToken();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ return_url: returnUrl }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to open billing portal');
  }

  const data = await response.json();
  return data.url;
}

export async function getUserSubscription() {
  const { data, error } = await supabase
    .from('stripe_user_subscriptions')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return Object.values(STRIPE_PRODUCTS).find((product) => product.priceId === priceId);
}