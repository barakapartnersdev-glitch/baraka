// رموز إعادة تعيين كلمة المرور — رابط آمن قصير العمر بدل كلمة المرور المؤقتة.
// خادم فقط. يوقّع الرمز بـ jose بنفس SESSION_SECRET مع مطالبة purpose مميّزة،
// ويُربط ببصمة كلمة المرور الحالية (pv) فيصبح صالحاً لمرّة واحدة: أي تغيير
// لكلمة المرور (أو استخدام الرمز) يُبطل الروابط السابقة تلقائياً.
import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

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
