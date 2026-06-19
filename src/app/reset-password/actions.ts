"use server";
// إجراءات إعادة تعيين كلمة المرور: طلب رابط + تعيين كلمة مرور جديدة عبر رمز.
// لا يكشف وجود البريد من عدمه (ردّ عام دائماً عند الطلب) لمنع تعداد الحسابات.
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { resetUi } from "@/lib/reset-i18n";
import { emailConfigured, sendEmail } from "@/lib/email";
import { logActivity } from "@/lib/audit";
import {
  createPasswordResetToken,
  verifyPasswordResetToken,
  tokenMatchesPassword,
  passwordResetUrl,
  resetEmailHtml,
} from "@/lib/password-reset";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RequestState { ok?: boolean; error?: string }
export interface SetState { error?: string }

// طلب رابط إعادة تعيين. ردّ عام دائماً (لا يكشف إن كان البريد مسجّلاً).
export async function requestPasswordReset(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const locale = await getLocale();
  const ui = resetUi(locale);

  // مصيدة سبام
  if (String(formData.get("website") ?? "").trim().length > 0) return { ok: true };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: ui.errEmail };

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true, fullName: true },
    });
    if (user) {
      const token = await createPasswordResetToken(user.id, user.passwordHash);
      const url = await passwordResetUrl(token);
      if (emailConfigured()) {
        await sendEmail({
          to: email,
          subject: ui.emailSubject,
          html: resetEmailHtml(locale, user.fullName, ui.emailBody, url, ui.emailCta),
        });
      } else {
        // بيئة بلا بريد: نسجّل الرابط ليتمكّن المشغّل من تسليمه يدوياً
        console.log(`[reset:link] ${email} -> ${url}`);
      }
    }
  } catch (e) {
    console.error("[reset] تعذّر إرسال رابط الإعادة:", e);
  }

  return { ok: true };
}

// تعيين كلمة مرور جديدة عبر رمز صالح. عند النجاح يعيد التوجيه لصفحة الدخول.
export async function setNewPassword(_prev: SetState, formData: FormData): Promise<SetState> {
  const locale = await getLocale();
  const ui = resetUi(locale);
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return { error: ui.errTooShort };
  if (password !== confirm) return { error: ui.errMismatch };

  const payload = await verifyPasswordResetToken(token);
  if (!payload) return { error: ui.errInvalidToken };

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, passwordHash: true },
  });
  // ربط ببصمة كلمة المرور الحالية ⇒ الرمز صالح لمرّة واحدة
  if (!user || !tokenMatchesPassword(payload.pv, user.passwordHash)) {
    return { error: ui.errInvalidToken };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  try {
    await logActivity({ actorId: user.id, action: "PASSWORD_RESET", entityType: "User", entityId: user.id });
  } catch {
    // التدقيق ثانوي — لا يكسر العملية
  }

  redirect("/login?reset=1");
}
