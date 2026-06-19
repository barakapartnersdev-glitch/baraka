// قوالب بريد سفراء الاستثمار (4 لغات) + مُرسِل. تُفحَص قوالب CrmEmailTemplate أولاً
// (قابلة للتحرير من الإدارة عبر نفس النموذج)، ثم القوالب المدمجة كاحتياط.
import "server-only";
import { prisma } from "@/lib/prisma";
import { emailConfigured, sendEmail } from "@/lib/email";
import type { Locale } from "@/lib/i18n";

type Tpl = { subject: string; body: string };

// القوالب المدمجة — تُستبدَل بقالب القاعدة إن وُجد بنفس المفتاح واللغة.
export const AMBASSADOR_TEMPLATES: Record<string, Record<Locale, Tpl>> = {
  amb_needs_info: {
    ar: { subject: "نحتاج معلومات إضافية لطلبك", body: "مرحباً {{fullName}}،\nنشكر تقديمك للانضمام كسفير استثمار. نحتاج بعض المعلومات الإضافية لاستكمال مراجعة طلبك. سيتواصل معك فريقنا قريباً." },
    en: { subject: "We need additional information", body: "Hello {{fullName}},\nThank you for applying as an Investment Ambassador. We need some additional information to continue reviewing your application. Our team will contact you shortly." },
    tr: { subject: "Ek bilgiye ihtiyacımız var", body: "Merhaba {{fullName}},\nYatırım Elçisi başvurunuz için teşekkürler. Başvurunuzu incelemeye devam etmek için ek bilgilere ihtiyacımız var. Ekibimiz kısa süre içinde sizinle iletişime geçecek." },
    zh: { subject: "我们需要补充信息", body: "您好 {{fullName}}，\n感谢您申请成为投资大使。我们需要一些补充信息以继续审核您的申请。我们的团队将很快与您联系。" },
  },
  amb_interview: {
    ar: { subject: "دعوة لمقابلة", body: "مرحباً {{fullName}}،\nيسعدنا دعوتك لمقابلة ضمن مراجعة طلب الانضمام كسفير استثمار. سيتواصل معك فريقنا لتحديد الموعد المناسب." },
    en: { subject: "Interview invitation", body: "Hello {{fullName}},\nWe are pleased to invite you to an interview as part of reviewing your Investment Ambassador application. Our team will contact you to schedule a suitable time." },
    tr: { subject: "Mülakat daveti", body: "Merhaba {{fullName}},\nYatırım Elçisi başvurunuzun değerlendirilmesi kapsamında sizi bir mülakata davet etmekten memnuniyet duyarız. Ekibimiz uygun bir zaman belirlemek için sizinle iletişime geçecek." },
    zh: { subject: "面谈邀请", body: "您好 {{fullName}}，\n作为投资大使申请审核的一部分，我们很高兴邀请您参加面谈。我们的团队将与您联系以安排合适的时间。" },
  },
  amb_pre_accepted: {
    ar: { subject: "قبول مبدئي لطلبك", body: "مرحباً {{fullName}}،\nيسعدنا إبلاغك بقبول طلبك مبدئياً للانضمام كسفير استثمار لدى عهد البركة. سنتواصل معك لاستكمال خطوات التعاقد." },
    en: { subject: "Your application is pre-accepted", body: "Hello {{fullName}},\nWe are glad to inform you that your application to join Ahd Al-Baraka as an Investment Ambassador has been pre-accepted. We will contact you to proceed with the contract." },
    tr: { subject: "Başvurunuz ön kabul aldı", body: "Merhaba {{fullName}},\nAhd Al-Baraka Yatırım Elçisi başvurunuzun ön kabul aldığını bildirmekten memnuniyet duyarız. Sözleşme adımları için sizinle iletişime geçeceğiz." },
    zh: { subject: "您的申请已初步通过", body: "您好 {{fullName}}，\n我们很高兴地通知您，您加入 Ahd Al-Baraka 担任投资大使的申请已初步通过。我们将与您联系以办理合同事宜。" },
  },
  amb_rejected: {
    ar: { subject: "تحديث بخصوص طلبك", body: "مرحباً {{fullName}}،\nنشكر اهتمامك بالانضمام كسفير استثمار. بعد المراجعة، لم نتمكّن من قبول طلبك في الوقت الحالي. نقدّر لك وقتك ونتمنى لك التوفيق." },
    en: { subject: "Update regarding your application", body: "Hello {{fullName}},\nThank you for your interest in joining as an Investment Ambassador. After review, we were unable to accept your application at this time. We appreciate your time and wish you success." },
    tr: { subject: "Başvurunuzla ilgili güncelleme", body: "Merhaba {{fullName}},\nYatırım Elçisi olma ilginiz için teşekkür ederiz. İnceleme sonrasında başvurunuzu şu an için kabul edemedik. Zamanınız için teşekkür eder, başarılar dileriz." },
    zh: { subject: "关于您申请的更新", body: "您好 {{fullName}}，\n感谢您有意成为投资大使。经审核，我们暂时无法接受您的申请。感谢您的时间，祝您一切顺利。" },
  },
  amb_contract_sent: {
    ar: { subject: "عقد التعاون جاهز", body: "مرحباً {{fullName}}،\nأصبح عقد التعاون الخاص بك جاهزاً. سيرسل لك فريقنا تفاصيل التوقيع. بعد التوقيع سيتم فتح حسابك كسفير استثمار." },
    en: { subject: "Your cooperation contract is ready", body: "Hello {{fullName}},\nYour cooperation contract is ready. Our team will send you the signing details. Once signed, your Investment Ambassador account will be opened." },
    tr: { subject: "İş birliği sözleşmeniz hazır", body: "Merhaba {{fullName}},\nİş birliği sözleşmeniz hazır. Ekibimiz imza ayrıntılarını gönderecek. İmzalandıktan sonra Yatırım Elçisi hesabınız açılacak." },
    zh: { subject: "您的合作合同已就绪", body: "您好 {{fullName}}，\n您的合作合同已就绪。我们的团队将向您发送签署详情。签署后，您的投资大使账户将开通。" },
  },
  amb_account_opened: {
    ar: { subject: "تم فتح حساب سفير الاستثمار", body: "مرحباً {{fullName}}،\nتم فتح حسابك كسفير استثمار لدى عهد البركة. يمكنك تسجيل الدخول عبر: {{loginUrl}}\nبيانات الدخول المؤقتة ستصلك من فريق الإدارة." },
    en: { subject: "Your Investment Ambassador account is open", body: "Hello {{fullName}},\nYour Investment Ambassador account at Ahd Al-Baraka has been opened. You can log in at: {{loginUrl}}\nYour temporary credentials will be shared by the management team." },
    tr: { subject: "Yatırım Elçisi hesabınız açıldı", body: "Merhaba {{fullName}},\nAhd Al-Baraka Yatırım Elçisi hesabınız açıldı. Giriş: {{loginUrl}}\nGeçici giriş bilgileriniz yönetim ekibi tarafından paylaşılacaktır." },
    zh: { subject: "您的投资大使账户已开通", body: "您好 {{fullName}}，\n您在 Ahd Al-Baraka 的投资大使账户已开通。您可登录：{{loginUrl}}\n您的临时登录凭据将由管理团队提供。" },
  },
};

function render(s: string, vars: Record<string, string>): string {
  return s.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

function htmlWrap(locale: Locale, bodyText: string): string {
  const rtl = locale === "ar";
  const safe = bodyText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
  return `<!DOCTYPE html><html lang="${locale}" dir="${rtl ? "rtl" : "ltr"}"><body style="font-family:Tajawal,Arial,sans-serif;background:#F8FAF9;padding:24px;color:#1a1a1a;margin:0">
  <div style="max-width:520px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px;text-align:${rtl ? "right" : "left"}">
    <div style="color:#0F6E56;font-weight:700;font-size:18px;margin-bottom:12px">BARAKA PARTNERS</div>
    <p style="margin:0;line-height:1.9">${safe}</p>
  </div></body></html>`;
}

// أفضل جهد: لا يفشل الإجراء الأساسي بسبب البريد.
export async function sendAmbassadorTemplateEmail(opts: {
  templateKey: string;
  locale: Locale;
  to: string;
  vars?: Record<string, string>;
}): Promise<void> {
  if (!emailConfigured()) return;
  const vars = opts.vars ?? {};
  let tpl: Tpl | undefined;

  // 1) قالب القاعدة (تحرير الإدارة) إن وُجد ومُفعّل
  try {
    const row = await prisma.crmEmailTemplate.findUnique({
      where: { templateKey_languageCode: { templateKey: opts.templateKey, languageCode: opts.locale } },
    });
    if (row && row.isActive) tpl = { subject: row.subject, body: row.body };
  } catch {
    // تجاهل — نستخدم المدمج
  }

  // 2) القالب المدمج (باللغة، ثم العربية)
  if (!tpl) {
    const byKey = AMBASSADOR_TEMPLATES[opts.templateKey];
    tpl = byKey?.[opts.locale] ?? byKey?.ar;
  }
  if (!tpl) return;

  try {
    await sendEmail({
      to: opts.to,
      subject: render(tpl.subject, vars),
      html: htmlWrap(opts.locale, render(tpl.body, vars)),
    });
  } catch (e) {
    console.error("[ambassador-email] فشل الإرسال:", e);
  }
}
