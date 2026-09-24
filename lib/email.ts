// Lightweight email via Resend REST API
// Set RESEND_API_KEY in env vars. If missing → silently skipped.

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.EMAIL_FROM || 'PAKLIPPIN <noreply@paklippin.com>';

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log('[email] RESEND_API_KEY not set — email skipped');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        reply_to: replyTo,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.warn('[email] send failed:', err.slice(0, 200));
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[email] send error:', (e as Error).message);
    return false;
  }
}

// --- Templates ---

export function orderPlacedHtml(order: any): string {
  const itemsRows = (order.items || [])
    .map((i: any) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name} × ${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold">
          Rs ${(i.price * i.quantity).toLocaleString()}
        </td>
      </tr>`).join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A">
      <div style="background:#FF6B35;padding:24px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px">Order Confirmed! 🎉</h1>
      </div>
      <div style="padding:24px;background:#fff;border:1px solid #eee;border-radius:0 0 12px 12px">
        <p style="margin-top:0">Hi ${order.customer?.name || 'Customer'},</p>
        <p>Thank you for shopping with PAKLIPPIN. Your order has been received.</p>

        <div style="background:#F8F9FA;padding:16px;border-radius:8px;margin:20px 0">
          <div style="font-size:11px;color:#888;text-transform:uppercase;font-weight:bold">Order ID</div>
          <div style="font-size:20px;font-weight:bold;color:#FF6B35;margin-top:4px">${order.id}</div>
        </div>

        <h3 style="margin-top:24px">Order Summary</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${itemsRows}
          <tr>
            <td style="padding:12px 0 0;font-weight:bold">Total</td>
            <td style="padding:12px 0 0;text-align:right;font-weight:bold;color:#FF6B35">
              Rs ${order.total.toLocaleString()}
            </td>
          </tr>
        </table>

        <h3 style="margin-top:24px">Delivery Address</h3>
        <p style="color:#5A5A5A;line-height:1.5">
          ${order.customer?.name || ''}<br>
          ${order.customer?.phone || ''}<br>
          ${order.customer?.address || ''}, ${order.customer?.city || ''}
        </p>

        <div style="background:#FFF5F0;padding:16px;border-radius:8px;margin-top:24px;font-size:13px;color:#5A5A5A">
          <strong>What happens next?</strong>
          <ol style="margin:8px 0 0 20px;padding:0;line-height:1.8">
            <li>We verify your payment (within 1 hour)</li>
            <li>Your order is packed and shipped</li>
            <li>You receive tracking updates on WhatsApp</li>
            <li>Same-day delivery in Faisalabad (before 2 PM)</li>
          </ol>
        </div>

        <p style="text-align:center;margin-top:24px">
          <a href="https://paklippinshop.pages.dev/account/track"
             style="background:#FF6B35;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;display:inline-block;font-weight:bold">
            Track Your Order
          </a>
        </p>

        <p style="color:#888;font-size:12px;margin-top:32px;text-align:center">
          Questions? WhatsApp us at
          <a href="https://wa.me/923397579547" style="color:#FF6B35">+92 339 7579547</a>
        </p>
        <p style="color:#888;font-size:11px;text-align:center;margin-top:8px">
          PAKLIPPIN (SMC-PRIVATE) LIMITED<br>
          SECP 0352216 · NTN J756870 · PSW UN-00-J756870
        </p>
      </div>
    </div>
  `;
}

export function orderStatusHtml(order: any, newStatus: string, note?: string): string {
  const statusMessages: Record<string, { emoji: string; title: string; body: string }> = {
    placed:           { emoji: '📦', title: 'Order Placed',           body: 'Your order has been received and is being reviewed.' },
    processing:       { emoji: '⏳', title: 'Order Processing',       body: 'We are preparing your order for shipping.' },
    confirmed:        { emoji: '✅', title: 'Order Confirmed',        body: 'Your payment has been verified and order is confirmed.' },
    shipped:          { emoji: '🚚', title: 'Order Shipped',          body: 'Your order is on the way to you.' },
    out_for_delivery: { emoji: '📍', title: 'Out for Delivery',       body: 'Your order is out for delivery today.' },
    delivered:        { emoji: '🎉', title: 'Order Delivered',        body: 'Your order has been delivered. Enjoy!' },
    cancelled:        { emoji: '❌', title: 'Order Cancelled',        body: 'Your order has been cancelled.' },
    refused:          { emoji: '❌', title: 'Order Refused',          body: 'Your order was refused at delivery.' },
    returned:         { emoji: '↩️', title: 'Order Returned',         body: 'Your order has been marked as returned.' },
    refunded:         { emoji: '💰', title: 'Refund Processed',       body: 'Your refund is being processed. It will reach you in 3-5 business days.' },
  };

  const meta = statusMessages[newStatus] || { emoji: '📦', title: `Status: ${newStatus}`, body: 'Your order status has been updated.' };

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A">
      <div style="background:#FF6B35;padding:24px;text-align:center;border-radius:12px 12px 0 0">
        <div style="font-size:40px">${meta.emoji}</div>
        <h1 style="color:#fff;margin:8px 0 0;font-size:22px">${meta.title}</h1>
      </div>
      <div style="padding:24px;background:#fff;border:1px solid #eee;border-radius:0 0 12px 12px">
        <p style="margin-top:0">Hi ${order.customer?.name || 'Customer'},</p>
        <p>${meta.body}</p>

        <div style="background:#F8F9FA;padding:16px;border-radius:8px;margin:20px 0">
          <div style="font-size:11px;color:#888;text-transform:uppercase;font-weight:bold">Order ID</div>
          <div style="font-size:18px;font-weight:bold;color:#FF6B35;margin-top:4px">${order.id}</div>
          <div style="font-size:11px;color:#888;text-transform:uppercase;font-weight:bold;margin-top:12px">New Status</div>
          <div style="font-size:14px;font-weight:bold;text-transform:uppercase;margin-top:4px">${newStatus.replace(/_/g, ' ')}</div>
        </div>

        ${note ? `
          <div style="background:#FFF5F0;border-left:4px solid #FF6B35;padding:12px 16px;margin:16px 0;font-size:13px">
            <strong>Note from PAKLIPPIN:</strong><br>
            ${note}
          </div>
        ` : ''}

        <p style="text-align:center;margin-top:24px">
          <a href="https://paklippinshop.pages.dev/account/track"
             style="background:#FF6B35;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;display:inline-block;font-weight:bold">
            Track Your Order
          </a>
        </p>

        <p style="color:#888;font-size:12px;margin-top:32px;text-align:center">
          Questions? WhatsApp
          <a href="https://wa.me/923397579547" style="color:#FF6B35">+92 339 7579547</a>
        </p>
        <p style="color:#888;font-size:11px;text-align:center;margin-top:8px">
          PAKLIPPIN (SMC-PRIVATE) LIMITED · SECP 0352216
        </p>
      </div>
    </div>
  `;
}

export function passwordResetHtml(resetLink: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A">
      <div style="background:#FF6B35;padding:24px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px">Reset Your Password 🔐</h1>
      </div>
      <div style="padding:24px;background:#fff;border:1px solid #eee;border-radius:0 0 12px 12px">
        <p>Hi,</p>
        <p>Someone requested a password reset for your PAKLIPPIN account.</p>
        <p>If this was you, click the button below to set a new password. This link expires in <strong>30 minutes</strong>.</p>

        <p style="text-align:center;margin:28px 0">
          <a href="${resetLink}"
             style="background:#FF6B35;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;display:inline-block;font-weight:bold">
            Reset My Password
          </a>
        </p>

        <p style="color:#888;font-size:12px">Or copy this link into your browser:</p>
        <p style="color:#FF6B35;font-size:12px;word-break:break-all">${resetLink}</p>

        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#888;font-size:12px">
          If you did NOT request this, you can safely ignore this email. Your password won't change until you click the link above.
        </p>
        <p style="color:#888;font-size:11px;text-align:center;margin-top:24px">
          PAKLIPPIN (SMC-PRIVATE) LIMITED · SECP 0352216
        </p>
      </div>
    </div>
  `;
}
