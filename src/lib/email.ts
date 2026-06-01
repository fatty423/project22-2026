const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface ContactEmail {
  type: 'contact';
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface ApplicationEmail {
  type: 'application';
  fullName: string;
  email: string;
  phone: string;
  serviceBackground: string;
  programs: string[];
  timeline: string;
}

type EmailPayload = ContactEmail | ApplicationEmail;

export async function sendNotificationEmail(payload: EmailPayload): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }));
    console.error('Email notification failed:', body);
    throw new Error(body.error || 'Email notification failed');
  }
}
