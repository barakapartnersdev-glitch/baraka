// رموز إعادة تعيين كلمة المرور — رابط آمن قصير العمر بدل كلمة المرور المؤقتة.
// خادم فقط. يوقّع الرمز بـ jose بنفس SESSION_SECRET مع مطالبة purpose مميّزة،
// ويُربط ببصمة كلمة المرور الحالية (pv) فيصبح صالحاً لمرّة واحدة: أي تغيير
// لكلمة المرور (أو استخدام الرمز) يُبطل الروابط السابقة تلقائياً.
import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { dir, type Locale } from "@/lib/i18n";

const PURPOSE = "pwreset";
const TTL_SECONDS = 60 * 60; // ساعة واحدة

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET مفقود أو قصير — أضِف قيمة لا تقل عن 32 حرفاً في .env");
  }
  return new TextEncoder().encode(secret);
}

// بصمة من تجزئة كلمة المرور الحالية — تجعل الرمز صالحاً لمرّة واحدة.
function fingerprint(passwordHash: string): string {
  return createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}

// إنشاء رمز إعادة تعيين لمستخدم محدّد (مربوط ببصمة كلمة مروره الحالية).
export async function createPasswordResetToken(
  userId: string,
  passwordHash: string
): Promise<string> {
  return new SignJWT({ purpose: PURPOSE, pv: fingerprint(passwordHash) })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(getSecret());
}

export interface ResetTokenPayload {
  userId: string;
  pv: string;
}

// تحقّق توقيع/صلاحية الرمز ونوع الغرض. لا يتحقّق من البصمة (يفعل ذلك المستدعي
// بمقارنتها بكلمة مرور المستخدم الحالية وقت الاستبدال).
export async function verifyPasswordResetToken(
  token: string
): Promise<ResetTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.purpose !== PURPOSE || !payload.sub || typeof payload.pv !== "string") {
      return null;
    }
    return { userId: payload.sub, pv: payload.pv };
  } catch {
    return null;
  }
}

// هل تطابق بصمة الرمز كلمة المرور الحالية؟ (يمنع إعادة الاستخدام بعد التغيير)
export function tokenMatchesPassword(pv: string, currentHash: string): boolean {
  return pv === fingerprint(currentHash);
}

// بناء رابط مطلق لصفحة إعادة التعيين. يفضّل مضيف الطلب الفعلي (أدقّ في بيئة
// لم تُضبط فيها APP_BASE_URL)، ثم APP_BASE_URL، ثم localhost.
export async function passwordResetUrl(token: string): Promise<string> {
  let base = (process.env.APP_BASE_URL || "").replace(/\/$/, "");
  if (!base) {
    try {
      const h = await headers();
      const host = h.get("x-forwarded-host") || h.get("host");
      if (host) {
        const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
        base = `${proto}://${host}`;
      }
    } catch {
      // خارج سياق الطلب — نتجاهل
    }
  }
  if (!base) base = "http://localhost:3000";
  return `${base}/reset-password?token=${encodeURIComponent(token)}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// قالب بريد إعادة التعيين — زرّ مع الرابط، يحترم اتجاه اللغة. مشترك بين النموذج
// العام (نسيت كلمة المرور) وإجراء الإدارة (إرسال رابط للوكيل).
export function resetEmailHtml(
  locale: Locale,
  fullName: string,
  body: string,
  url: string,
  cta: string
): string {
  const d = dir(locale);
  const align = d === "rtl" ? "right" : "left";
  return `<!doctype html><html dir="${d}"><body style="margin:0;background:#f5f6f8;font-family:Tahoma,Arial,sans-serif;color:#1f2733">
  <div style="max-width:520px;margin:0 auto;padding:24px">
    <div style="background:#fff;border:1px solid #e6e8ec;border-radius:14px;padding:28px;text-align:${align}">
      <p style="font-weight:700;margin:0 0 12px">${escapeHtml(fullName)}</p>
      <p style="line-height:1.7;margin:0 0 20px">${escapeHtml(body)}</p>
      <a href="${url}" style="display:inline-block;background:#1f6b54;color:#fff;text-decoration:none;padding:11px 22px;border-radius:10px;font-weight:700">${escapeHtml(cta)}</a>
      <p style="font-size:12px;color:#8a93a3;margin:20px 0 0;word-break:break-all">${url}</p>
    </div>
  </div></body></html>`;
}
