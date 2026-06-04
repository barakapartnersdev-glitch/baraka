// طبقة البريد — إرسال عبر Resend HTTP API بلا اعتمادية إضافية.
// إن لم تُضبط المفاتيح يسجّل فقط (وضع تطوير)، ولا يفشل الإجراء أبداً بسبب البريد.
// لتبديل المزوّد (SendGrid/SMTP-عبر-بوابة...): عدّل دالة sendEmail فقط.
import "server-only";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

function baseUrl(): string {
  return process.env.APP_BASE_URL || "http://localhost:3000";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!emailConfigured()) {
    // وضع التطوير: لا إرسال فعلي
    console.log(`[email:skipped] إلى ${params.to} — ${params.subject}`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });
    if (!res.ok) {
      console.error(`[email:failed] ${res.status} ${await res.text()}`);
    }
  } catch (e) {
    // فشل البريد لا يكسر الإجراء
    console.error("[email:error]", e);
  }
}

// قالب بريد بسيط (RTL) للإشعارات
export function notificationEmailHtml(params: {
  fullName: string;
  message: string;
  link?: string | null;
}): string {
  const url = params.link ? `${baseUrl()}${params.link}` : null;
  const button = url
    ? `<p style="margin:24px 0"><a href="${url}" style="background:#0F6E56;color:#fff;text-decoration:none;padding:10px 22px;border-radius:8px;display:inline-block">فتح المنصة</a></p>`
    : "";
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><body style="font-family:Tajawal,Arial,sans-serif;background:#F8FAF9;padding:24px;color:#1a1a1a;margin:0">
  <div style="max-width:520px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px">
    <div style="color:#0F6E56;font-weight:700;font-size:18px;margin-bottom:12px">شركاء البركة</div>
    <p style="margin:0 0 8px">مرحباً ${escapeHtml(params.fullName)}،</p>
    <p style="margin:0;line-height:1.9">${escapeHtml(params.message)}</p>
    ${button}
    <p style="color:#888;font-size:12px;margin-top:24px">هذا بريد آلي من منصة شركاء البركة.</p>
  </div></body></html>`;
}
