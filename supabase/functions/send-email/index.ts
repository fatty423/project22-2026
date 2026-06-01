import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "info@project22.org";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "onboarding@resend.dev";
const SITE_URL = Deno.env.get("SITE_URL") || "https://www.project22.us";
const INSTAGRAM_URL =
  Deno.env.get("INSTAGRAM_URL") || "https://www.instagram.com/project22us";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function logEmail(entry: {
  email_type: string;
  recipient: string;
  subject: string;
  status: "sent" | "failed";
  error_message?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await supabaseAdmin.from("email_logs").insert({
      email_type: entry.email_type,
      recipient: entry.recipient,
      subject: entry.subject,
      status: entry.status,
      error_message: entry.error_message ?? null,
      metadata: entry.metadata ?? {},
    });
  } catch (err) {
    console.error("Failed to write email_logs entry:", err);
  }
}

async function sendAndLog(
  emailType: string,
  to: string,
  subject: string,
  html: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    await sendEmail(to, subject, html);
    await logEmail({
      email_type: emailType,
      recipient: to,
      subject,
      status: "sent",
      metadata,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logEmail({
      email_type: emailType,
      recipient: to,
      subject,
      status: "failed",
      error_message: message,
      metadata,
    });
    throw err;
  }
}

interface ContactPayload {
  type: "contact";
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface ApplicationPayload {
  type: "application";
  fullName: string;
  email: string;
  phone: string;
  serviceBackground: string;
  programs: string[];
  timeline: string;
}

interface DonationPayload {
  type: "donation";
  donorName: string;
  donorEmail: string;
  amount: number;
  isRecurring: boolean;
  veteranName?: string;
  veteranId?: string;
  stripePaymentId: string;
  donationDate?: string;
  receiptNumber?: string;
}

type EmailPayload = ContactPayload | ApplicationPayload | DonationPayload;

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error (${res.status}): ${body}`);
  }
}

function buildContactAdminEmail(data: ContactPayload): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e40af; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">New Contact Message</h1>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 120px;">Name</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${data.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #1e40af;">${data.email}</a></td></tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; color: #64748b;">Phone</td><td style="padding: 8px 0; color: #0f172a;">${data.phone}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #64748b;">Subject</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${data.subject}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0 0 8px; font-size: 13px;">Message</p>
          <p style="color: #0f172a; margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
    </div>`;
}

function buildApplicationAdminEmail(data: ApplicationPayload): string {
  const programList = data.programs
    .map((p) => `<li style="padding: 4px 0; color: #0f172a;">${p}</li>`)
    .join("");

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e40af; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">New Program Application</h1>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 140px;">Name</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${data.fullName}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #1e40af;">${data.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Phone</td><td style="padding: 8px 0; color: #0f172a;">${data.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Service Background</td><td style="padding: 8px 0; color: #0f172a;">${data.serviceBackground}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Timeline</td><td style="padding: 8px 0; color: #0f172a;">${data.timeline}</td></tr>
        </table>
        <div style="margin-top: 16px;">
          <p style="color: #64748b; margin: 0 0 8px; font-size: 13px;">Programs Interested</p>
          <ul style="margin: 0; padding-left: 20px;">${programList}</ul>
        </div>
      </div>
    </div>`;
}

function buildDonationAdminEmail(data: DonationPayload): string {
  const donationType = data.isRecurring ? "Monthly Recurring" : "One-Time";
  const veteranRow = data.veteranName
    ? `<tr><td style="padding: 8px 0; color: #64748b;">Sponsored Hero</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${data.veteranName}</td></tr>`
    : "";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #15803d; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">New Donation Received</h1>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 16px; text-align: center;">
          <p style="color: #15803d; font-size: 32px; font-weight: 700; margin: 0;">$${data.amount.toFixed(2)}</p>
          <p style="color: #166534; font-size: 14px; margin: 4px 0 0;">${donationType} Donation</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 140px;">Donor Name</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${data.donorName}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Donor Email</td><td style="padding: 8px 0;"><a href="mailto:${data.donorEmail}" style="color: #1e40af;">${data.donorEmail}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Type</td><td style="padding: 8px 0; color: #0f172a;">${donationType}</td></tr>
          ${veteranRow}
          <tr><td style="padding: 8px 0; color: #64748b;">Payment ID</td><td style="padding: 8px 0; color: #64748b; font-size: 12px; font-family: monospace;">${data.stripePaymentId}</td></tr>
        </table>
      </div>
    </div>`;
}

function buildApplicantConfirmationEmail(data: ApplicationPayload): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e40af; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">Project 22 -- Application Received</h1>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #0f172a; font-size: 16px; margin: 0 0 16px;">Hi ${data.fullName},</p>
        <p style="color: #334155; line-height: 1.6; margin: 0 0 16px;">
          Thank you for applying to Project 22. We have received your scholarship application and our team is reviewing it now.
        </p>
        <p style="color: #334155; line-height: 1.6; margin: 0 0 16px;">
          You can expect to hear from us within <strong>48 hours</strong>. We will reach out to discuss your scholarship, program options, and next steps.
        </p>
        <p style="color: #334155; line-height: 1.6; margin: 0 0 24px;">
          If you have any questions in the meantime, reply to this email or reach us at <a href="mailto:info@project22.org" style="color: #1e40af;">info@project22.org</a>.
        </p>
        <p style="color: #334155; margin: 0;">
          Thank you for your service,<br />
          <strong>The Project 22 Team</strong>
        </p>
      </div>
    </div>`;
}

function buildDonorReceiptEmail(data: DonationPayload): string {
  const donationType = data.isRecurring ? "Monthly Recurring Gift" : "One-Time Gift";
  const dateStr = data.donationDate
    ? new Date(data.donationDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  const receiptNumber =
    data.receiptNumber || data.stripePaymentId.slice(-12).toUpperCase();

  const heroLine = data.veteranName
    ? `<p style="color: #0f172a; line-height: 1.7; margin: 0 0 16px; font-size: 15px;">Your sponsorship directly supports <strong>${data.veteranName}</strong>, a first responder or veteran stepping into a life-changing chapter of recovery, purpose, and healing through Project 22.</p>`
    : `<p style="color: #0f172a; line-height: 1.7; margin: 0 0 16px; font-size: 15px;">Your gift powers scholarships, housing, and training for the men and women who have carried our country and our communities. Because of you, a Hero gets to reclaim their mission.</p>`;

  const shareUrl = encodeURIComponent(SITE_URL);
  const shareText = encodeURIComponent(
    `I just supported a first responder / veteran through Project 22. Join me in standing with our Heroes:`
  );

  const veteranLink =
    data.veteranId && data.veteranName
      ? `<p style="margin: 0 0 12px;"><a href="${SITE_URL}/heroes/${data.veteranId}" style="color: #1e40af; font-weight: 600; text-decoration: none;">&rarr; Follow ${data.veteranName}'s journey</a></p>`
      : "";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e40af 100%); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <p style="color: #93c5fd; margin: 0 0 6px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Project 22</p>
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Thank You, ${data.donorName}</h1>
        <p style="color: #cbd5e1; margin: 8px 0 0; font-size: 15px;">On behalf of our Heroes, your gift matters.</p>
      </div>

      <div style="padding: 32px 28px; border: 1px solid #e2e8f0; border-top: none; background: #ffffff;">
        <p style="color: #0f172a; line-height: 1.7; margin: 0 0 16px; font-size: 15px;">
          Every 22 minutes, a veteran or first responder is lost to suicide. You just answered that call.
        </p>
        ${heroLine}
        <p style="color: #0f172a; line-height: 1.7; margin: 0 0 24px; font-size: 15px;">
          From the entire Project 22 team and the Heroes you are standing with &mdash; <strong>thank you</strong>.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 0 0 24px; text-align: center;">
          <p style="color: #166534; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 6px;">Amount Received</p>
          <p style="color: #15803d; font-size: 40px; font-weight: 700; margin: 0; letter-spacing: -1px;">$${data.amount.toFixed(2)}</p>
          <p style="color: #166534; font-size: 13px; margin: 4px 0 0;">${donationType}</p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin: 0 0 24px;">
          <p style="color: #0f172a; font-size: 14px; font-weight: 700; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">Donation Receipt</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Receipt No.</td><td style="padding: 6px 0; color: #0f172a; font-family: monospace;">${receiptNumber}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Date</td><td style="padding: 6px 0; color: #0f172a;">${dateStr}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Donor</td><td style="padding: 6px 0; color: #0f172a;">${data.donorName}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Email</td><td style="padding: 6px 0; color: #0f172a;">${data.donorEmail}</td></tr>
            ${data.veteranName ? `<tr><td style="padding: 6px 0; color: #64748b;">Designated Hero</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${data.veteranName}</td></tr>` : ""}
            <tr><td style="padding: 6px 0; color: #64748b;">Payment Ref.</td><td style="padding: 6px 0; color: #64748b; font-family: monospace; font-size: 12px; word-break: break-all;">${data.stripePaymentId}</td></tr>
          </table>
          <p style="color: #475569; font-size: 12px; line-height: 1.6; margin: 16px 0 0; padding-top: 14px; border-top: 1px solid #e2e8f0;">
            Project 22 is a qualified 501(c)(3) tax-exempt organization. No goods or services were provided in exchange for this contribution. Please retain this receipt for your tax records.
          </p>
        </div>

        <div style="text-align: center; margin: 0 0 28px;">
          <a href="${SITE_URL}/portal" style="display: inline-block; background: #1e40af; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">View in Donor Portal</a>
        </div>

        <div style="background: #0f172a; border-radius: 12px; padding: 24px; margin: 0 0 24px; text-align: center;">
          <p style="color: #fbbf24; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 10px;">Multiply your impact</p>
          <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 14px;">Share the mission</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 18px;">Every share is another chance for a Hero to be seen. Spread the word:</p>
          <div>
            <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}" style="display: inline-block; background: #ffffff; color: #0f172a; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 4px;">Share on X</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" style="display: inline-block; background: #ffffff; color: #0f172a; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 4px;">Share on Facebook</a>
            <a href="${INSTAGRAM_URL}" style="display: inline-block; background: #ffffff; color: #0f172a; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 4px;">Follow on Instagram</a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" style="display: inline-block; background: #ffffff; color: #0f172a; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 4px;">Share on LinkedIn</a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">Or share this direct link: <a href="${SITE_URL}" style="color: #93c5fd;">${SITE_URL}</a></p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="color: #0f172a; font-size: 14px; font-weight: 700; margin: 0 0 12px;">Stay connected with the mission</p>
          ${veteranLink}
          <p style="margin: 0 0 8px;"><a href="${SITE_URL}/heroes" style="color: #1e40af; font-weight: 600; text-decoration: none;">&rarr; Meet the Heroes you're supporting</a></p>
          <p style="margin: 0 0 8px;"><a href="${SITE_URL}/impact" style="color: #1e40af; font-weight: 600; text-decoration: none;">&rarr; See the impact of your giving</a></p>
          <p style="margin: 0 0 8px;"><a href="${SITE_URL}/sponsor" style="color: #1e40af; font-weight: 600; text-decoration: none;">&rarr; Sponsor another Hero</a></p>
        </div>
      </div>

      <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0;">
          Project 22 &middot; <a href="mailto:info@project22.org" style="color: #1e40af;">info@project22.org</a> &middot; <a href="${SITE_URL}" style="color: #1e40af;">www.project22.us</a> &middot; <a href="${INSTAGRAM_URL}" style="color: #1e40af;">Instagram</a>
        </p>
        <p style="color: #94a3b8; font-size: 11px; margin: 8px 0 0;">You are receiving this receipt because a donation was made using this email address.</p>
      </div>
    </div>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const payload: EmailPayload = await req.json();

    if (payload.type === "contact") {
      await sendAndLog(
        "contact",
        ADMIN_EMAIL,
        `[Project 22 Contact] ${payload.subject}`,
        buildContactAdminEmail(payload),
        { name: payload.name, email: payload.email, subject: payload.subject }
      );
    } else if (payload.type === "application") {
      await Promise.all([
        sendAndLog(
          "application_admin",
          ADMIN_EMAIL,
          `[Project 22] New Application: ${payload.fullName}`,
          buildApplicationAdminEmail(payload),
          { fullName: payload.fullName, email: payload.email }
        ),
        sendAndLog(
          "application_confirmation",
          payload.email,
          "Your Project 22 Application Has Been Received",
          buildApplicantConfirmationEmail(payload),
          { fullName: payload.fullName }
        ),
      ]);
    } else if (payload.type === "donation") {
      const primaryRecipient =
        Deno.env.get("DONATION_NOTIFY_EMAIL") || ADMIN_EMAIL;
      const extraRecipients = (
        Deno.env.get("DONATION_NOTIFY_CC") || "info@project22.us"
      )
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0);

      const adminRecipients = Array.from(
        new Set([primaryRecipient.toLowerCase(), ...extraRecipients])
      );

      const tasks: Promise<void>[] = adminRecipients.map((recipientEmail) =>
        sendAndLog(
          "donation_admin",
          recipientEmail,
          `[Project 22] New Donation: $${payload.amount.toFixed(2)} from ${payload.donorName}`,
          buildDonationAdminEmail(payload),
          {
            donorName: payload.donorName,
            donorEmail: payload.donorEmail,
            amount: payload.amount,
            isRecurring: payload.isRecurring,
            veteranName: payload.veteranName ?? null,
            stripePaymentId: payload.stripePaymentId,
          }
        )
      );

      if (payload.donorEmail) {
        tasks.push(
          sendAndLog(
            "donation_receipt",
            payload.donorEmail,
            `Your Project 22 Receipt & Thank You — $${payload.amount.toFixed(2)}`,
            buildDonorReceiptEmail(payload),
            {
              donorName: payload.donorName,
              amount: payload.amount,
              isRecurring: payload.isRecurring,
              veteranName: payload.veteranName ?? null,
              stripePaymentId: payload.stripePaymentId,
            }
          )
        );
      }

      await Promise.all(tasks);
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid email type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
