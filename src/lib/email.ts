import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@movecompare.co.uk';
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'MoveCompare';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://movecompare.co.uk';

// ─── Lead confirmation email (sent to the mover) ─────────────────────────────

export async function sendLeadConfirmation(to: string, leadId: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f9fafb;">
      <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <div style="background:#1e3a5f;padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">${APP_NAME}</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">Your Quote Request Has Been Received</h2>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4b5563;">
            Thank you for submitting your removal quote request. We have matched you with up to 5 vetted removal companies in your area.
          </p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4b5563;">
            You should start receiving quotes shortly. Companies will contact you directly using the details you provided.
          </p>
          <div style="background:#f3f4f6;border-radius:6px;padding:16px;margin:24px 0;">
            <p style="margin:0;font-size:13px;color:#6b7280;">Reference: <strong style="color:#111827;">${leadId}</strong></p>
          </div>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
            If you have any questions, please don't hesitate to <a href="${APP_URL}/contact" style="color:#1e3a5f;">contact us</a>.
          </p>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #e5e7eb;background:#f9fafb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const { data, error } = await resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `Your removal quote request has been received - ${APP_NAME}`,
    html,
  });

  if (error) {
    console.error('[email] Failed to send lead confirmation:', error);
    throw new Error(`Failed to send lead confirmation email: ${error.message}`);
  }

  return data;
}

// ─── New lead notification (sent to matched company) ──────────────────────────

interface LeadSummary {
  from_postcode: string;
  to_postcode: string;
  property_size: string;
  move_date: string | null;
  packing_required: boolean;
  storage_required: boolean;
}

export async function sendNewLeadNotification(
  to: string,
  companyName: string,
  leadSummary: LeadSummary
) {
  const moveDate = leadSummary.move_date
    ? new Date(leadSummary.move_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Flexible';

  const extras: string[] = [];
  if (leadSummary.packing_required) extras.push('Packing');
  if (leadSummary.storage_required) extras.push('Storage');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f9fafb;">
      <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <div style="background:#1e3a5f;padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">${APP_NAME}</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">New Lead Available</h2>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4b5563;">
            Hi ${companyName}, a new removal lead has been matched to your company.
          </p>
          <div style="background:#f3f4f6;border-radius:6px;padding:20px;margin:24px 0;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;">From:</td>
                <td style="padding:6px 0;color:#111827;font-weight:500;">${leadSummary.from_postcode}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">To:</td>
                <td style="padding:6px 0;color:#111827;font-weight:500;">${leadSummary.to_postcode}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Property:</td>
                <td style="padding:6px 0;color:#111827;font-weight:500;">${leadSummary.property_size.replace(/_/g, ' ')}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Move date:</td>
                <td style="padding:6px 0;color:#111827;font-weight:500;">${moveDate}</td>
              </tr>
              ${extras.length > 0 ? `
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Extras:</td>
                <td style="padding:6px 0;color:#111827;font-weight:500;">${extras.join(', ')}</td>
              </tr>` : ''}
            </table>
          </div>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#4b5563;">
            Log in to your portal to reveal the contact details and get in touch with this customer.
          </p>
          <a href="${APP_URL}/portal" style="display:inline-block;background:#1e3a5f;color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;padding:12px 24px;border-radius:6px;">
            View Lead
          </a>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #e5e7eb;background:#f9fafb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const { data, error } = await resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `New removal lead available - ${APP_NAME}`,
    html,
  });

  if (error) {
    console.error('[email] Failed to send lead notification:', error);
    throw new Error(`Failed to send lead notification email: ${error.message}`);
  }

  return data;
}

// ─── Low credit warning (sent to company) ─────────────────────────────────────

export async function sendLowCreditWarning(
  to: string,
  companyName: string,
  balance: number
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f9fafb;">
      <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <div style="background:#1e3a5f;padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">${APP_NAME}</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">Low Credit Balance</h2>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4b5563;">
            Hi ${companyName}, your credit balance is running low.
          </p>
          <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:16px;margin:24px 0;">
            <p style="margin:0;font-size:14px;color:#92400e;">
              Current balance: <strong>${balance} credits</strong>
            </p>
          </div>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#4b5563;">
            Without enough credits, you won't be able to reveal new lead contact details. Top up now to avoid missing out on potential customers.
          </p>
          <a href="${APP_URL}/portal/billing" style="display:inline-block;background:#1e3a5f;color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;padding:12px 24px;border-radius:6px;">
            Buy Credits
          </a>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #e5e7eb;background:#f9fafb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const { data, error } = await resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `Low credit balance - ${APP_NAME}`,
    html,
  });

  if (error) {
    console.error('[email] Failed to send low credit warning:', error);
    throw new Error(`Failed to send low credit warning email: ${error.message}`);
  }

  return data;
}
