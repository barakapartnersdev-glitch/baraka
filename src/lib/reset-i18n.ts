// نصوص صفحة إعادة تعيين كلمة المرور (عربي/تركي/إنجليزي؛ الصينية ترجع للإنجليزية).
// وحدة خالصة تُستورد في الخادم والعميل — لا next/headers. مرآة لأسلوب agent-i18n.
import type { Locale } from "@/lib/i18n";

interface Tri { ar: string; en: string; tr: string }
const p = (t: Tri, l: Locale) => (l === "ar" ? t.ar : l === "tr" ? t.tr : t.en);

const S = {
  metaTitle: { ar: "إعادة تعيين كلمة المرور | شركاء البركة", en: "Reset password | Baraka Partners", tr: "Şifre sıfırlama | Baraka Partners" },

  // طلب الرابط
  requestTitle: { ar: "إعادة تعيين كلمة المرور", en: "Reset your password", tr: "Şifrenizi sıfırlayın" },
  requestSub: { ar: "أدخل بريدك الإلكتروني وسنرسل إليك رابطاً لتعيين كلمة مرور جديدة.", en: "Enter your email and we'll send you a link to set a new password.", tr: "E-postanızı girin, size yeni bir şifre belirlemeniz için bir bağlantı gönderelim." },
  emailLabel: { ar: "البريد الإلكتروني", en: "Email", tr: "E-posta" },
  sendBtn: { ar: "إرسال رابط الإعادة", en: "Send reset link", tr: "Sıfırlama bağlantısı gönder" },
  sending: { ar: "جارٍ الإرسال...", en: "Sending...", tr: "Gönderiliyor..." },
  requestDone: { ar: "إن كان بريدك مسجّلاً لدينا فستصلك رسالة تحتوي رابطاً لإعادة التعيين خلال دقائق. تحقّق من بريدك (ومجلد الرسائل غير المرغوبة).", en: "If your email is registered, you'll receive a message with a reset link within minutes. Check your inbox (and spam folder).", tr: "E-postanız kayıtlıysa, birkaç dakika içinde sıfırlama bağlantısı içeren bir mesaj alırsınız. Gelen kutunuzu (ve spam klasörünü) kontrol edin." },

  // تعيين كلمة مرور جديدة
  setTitle: { ar: "تعيين كلمة مرور جديدة", en: "Set a new password", tr: "Yeni şifre belirleyin" },
  setSub: { ar: "اختر كلمة مرور جديدة لحسابك.", en: "Choose a new password for your account.", tr: "Hesabınız için yeni bir şifre seçin." },
  newPassword: { ar: "كلمة المرور الجديدة", en: "New password", tr: "Yeni şifre" },
  confirmPassword: { ar: "تأكيد كلمة المرور", en: "Confirm password", tr: "Şifreyi onayla" },
  passwordHint: { ar: "(8 أحرف على الأقل)", en: "(at least 8 characters)", tr: "(en az 8 karakter)" },
  saveBtn: { ar: "حفظ كلمة المرور", en: "Save password", tr: "Şifreyi kaydet" },
  saving: { ar: "جارٍ الحفظ...", en: "Saving...", tr: "Kaydediliyor..." },

  // روابط/تنقّل
  backToLogin: { ar: "العودة إلى تسجيل الدخول", en: "Back to login", tr: "Girişe dön" },
  forgotPassword: { ar: "نسيت كلمة المرور؟", en: "Forgot your password?", tr: "Şifrenizi mi unuttunuz?" },

  // أخطاء/تنبيهات
  linkExpired: { ar: "انتهت صلاحية الرابط أو أنه غير صالح. اطلب رابطاً جديداً أدناه.", en: "This link is invalid or has expired. Request a new one below.", tr: "Bu bağlantı geçersiz veya süresi dolmuş. Aşağıdan yenisini isteyin." },
  errEmail: { ar: "البريد الإلكتروني غير صالح.", en: "Invalid email address.", tr: "Geçersiz e-posta adresi." },
  errTooShort: { ar: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.", en: "Password must be at least 8 characters.", tr: "Şifre en az 8 karakter olmalıdır." },
  errMismatch: { ar: "كلمتا المرور غير متطابقتين.", en: "Passwords do not match.", tr: "Şifreler eşleşmiyor." },
  errInvalidToken: { ar: "هذا الرابط غير صالح أو انتهت صلاحيته. اطلب رابطاً جديداً.", en: "This link is invalid or expired. Request a new one.", tr: "Bu bağlantı geçersiz veya süresi dolmuş. Yenisini isteyin." },
  errGeneric: { ar: "تعذّر إتمام العملية. حاول مجدداً.", en: "Could not complete the request. Try again.", tr: "İşlem tamamlanamadı. Tekrar deneyin." },

  // بريد الإعادة
  emailSubject: { ar: "إعادة تعيين كلمة مرور حسابك — شركاء البركة", en: "Reset your account password — Baraka Partners", tr: "Hesap şifrenizi sıfırlayın — Baraka Partners" },
  emailBody: { ar: "لقد طلبت إعادة تعيين كلمة مرور حسابك. اضغط الزر أدناه لتعيين كلمة مرور جديدة. الرابط صالح لمدة ساعة واحدة. إن لم تطلب ذلك فتجاهل هذه الرسالة.", en: "You requested to reset your account password. Use the button below to set a new password. The link is valid for one hour. If you didn't request this, ignore this email.", tr: "Hesap şifrenizi sıfırlamayı istediniz. Yeni bir şifre belirlemek için aşağıdaki bağlantıyı kullanın. Bağlantı bir saat geçerlidir. Bu işlemi siz yapmadıysanız bu e-postayı yok sayın." },
  emailCta: { ar: "تعيين كلمة المرور", en: "Set password", tr: "Şifre belirle" },

  // نجاح الدخول
  loginResetOk: { ar: "تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بها.", en: "Password updated successfully. You can now log in with it.", tr: "Şifre başarıyla güncellendi. Artık onunla giriş yapabilirsiniz." },
} satisfies Record<string, Tri>;

export type ResetUi = Record<keyof typeof S, string>;

export function resetUi(locale: Locale): ResetUi {
  const out = {} as ResetUi;
  for (const k in S) out[k as keyof typeof S] = p(S[k as keyof typeof S], locale);
  return out;
}
