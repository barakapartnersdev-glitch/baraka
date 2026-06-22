// المراسلة الداخلية — منطق الخادم: القوالب المدمجة، حلّها من القاعدة، التسليم (إشعار + بريد)،
// عدّ غير المقروء، وإشعار الإدارة بالردود. server-only.
import "server-only";
import { prisma } from "@/lib/prisma";
import { emailConfigured, sendEmail, notificationEmailHtml } from "@/lib/email";
import { inboxBasePath } from "@/lib/internal-msg";
import type { Locale } from "@/lib/i18n";

export type Tpl = { subject: string; body: string };

// القوالب المدمجة (4 لغات) — تُستبدَل بقالب القاعدة إن وُجد بنفس المفتاح واللغة.
export const INTERNAL_TEMPLATES: Record<string, Record<Locale, Tpl>> = {
  welcome: {
    ar: { subject: "أهلاً بك في عهد البركة", body: "مرحباً {{fullName}}،\nيسعدنا انضمامك. نحن هنا لدعمك في كل خطوة، ويمكنك مراسلتنا في أي وقت عبر هذا الصندوق." },
    en: { subject: "Welcome to Ahd Al-Baraka", body: "Hello {{fullName}},\nWe are glad to have you with us. We are here to support you at every step, and you can message us anytime through this inbox." },
    tr: { subject: "Ahd Al-Baraka'ya hoş geldiniz", body: "Merhaba {{fullName}},\nAramıza katıldığınız için mutluyuz. Her adımda yanınızdayız; bu kutudan istediğiniz zaman bize yazabilirsiniz." },
    zh: { subject: "欢迎加入 Ahd Al-Baraka", body: "您好 {{fullName}}，\n很高兴您的加入。我们将在每一步为您提供支持，您可以随时通过此收件箱与我们联系。" },
  },
  document_request: {
    ar: { subject: "طلب مستندات", body: "مرحباً {{fullName}}،\nنحتاج منك تزويدنا ببعض المستندات لاستكمال ملفك. يرجى الرد على هذه الرسالة بالمستندات المطلوبة في أقرب وقت." },
    en: { subject: "Document request", body: "Hello {{fullName}},\nWe need a few documents from you to complete your file. Please reply to this message with the requested documents at your earliest convenience." },
    tr: { subject: "Belge talebi", body: "Merhaba {{fullName}},\nDosyanızı tamamlamak için sizden birkaç belgeye ihtiyacımız var. Lütfen istenen belgelerle bu mesajı en kısa sürede yanıtlayın." },
    zh: { subject: "文件请求", body: "您好 {{fullName}}，\n为完善您的档案，我们需要您提供一些文件。请尽快回复本消息并附上所需文件。" },
  },
  contract_followup: {
    ar: { subject: "متابعة بخصوص العقد", body: "مرحباً {{fullName}}،\nنود متابعة موضوع العقد معك. يرجى إعلامنا بأي استفسار أو ملاحظة لديك لنكمل الخطوات اللازمة." },
    en: { subject: "Contract follow-up", body: "Hello {{fullName}},\nWe would like to follow up regarding your contract. Please let us know of any questions or notes so we can proceed with the next steps." },
    tr: { subject: "Sözleşme takibi", body: "Merhaba {{fullName}},\nSözleşmenizle ilgili takip etmek istiyoruz. Sonraki adımlara geçebilmemiz için soru veya notlarınızı bize bildirin." },
    zh: { subject: "合同跟进", body: "您好 {{fullName}}，\n我们希望跟进您的合同事宜。如有任何疑问或意见，请告知我们，以便继续后续步骤。" },
  },
  meeting_invite: {
    ar: { subject: "دعوة لاجتماع", body: "مرحباً {{fullName}}،\nنرغب بترتيب اجتماع معك لمناقشة التفاصيل. يرجى اقتراح وقت مناسب لك وسنؤكّد الموعد." },
    en: { subject: "Meeting invitation", body: "Hello {{fullName}},\nWe would like to arrange a meeting to discuss the details. Please suggest a convenient time and we will confirm." },
    tr: { subject: "Toplantı daveti", body: "Merhaba {{fullName}},\nDetayları görüşmek için sizinle bir toplantı ayarlamak istiyoruz. Lütfen uygun bir zaman önerin, onaylayalım." },
    zh: { subject: "会议邀请", body: "您好 {{fullName}}，\n我们希望安排一次会议讨论细节。请提出方便的时间，我们将予以确认。" },
  },
  general_notice: {
    ar: { subject: "إشعار من الإدارة", body: "مرحباً {{fullName}}،\nنود إعلامك بالتالي:\n" },
    en: { subject: "Notice from management", body: "Hello {{fullName}},\nWe would like to inform you of the following:\n" },
    tr: { subject: "Yönetimden bildirim", body: "Merhaba {{fullName}},\nAşağıdaki konuda sizi bilgilendirmek isteriz:\n" },
    zh: { subject: "管理层通知", body: "您好 {{fullName}}，\n谨此通知您以下事项：\n" },
  },
};

export const INTERNAL_TEMPLATE_KEYS = Object.keys(INTERNAL_TEMPLATES);

export function renderVars(s: string, vars: Record<string, string>): string {
  return s.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

function baseUrl(): string {
  return (process.env.APP_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

// قالب بريد نسخة الرسالة الكاملة (RTL/LTR حسب اللغة) — على نمط بريد السفراء.
export function messageEmailHtml(locale: Locale, subject: string, bodyText: string, link?: string): string {
  const rtl = locale === "ar";
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safe = esc(bodyText).replace(/\n/g, "<br/>");
  const url = link ? `${baseUrl()}${link}` : null;
  const button = url
    ? `<p style="margin:24px 0 0"><a href="${url}" style="background:#0F6E56;color:#fff;text-decoration:none;padding:10px 22px;border-radius:8px;display:inline-block">${rtl ? "فتح في المنصّة والرد" : "Open & reply in the platform"}</a></p>`
    : "";
  return `<!DOCTYPE html><html lang="${locale}" dir="${rtl ? "rtl" : "ltr"}"><body style="font-family:Tajawal,Arial,sans-serif;background:#F8FAF9;padding:24px;color:#1a1a1a;margin:0">
  <div style="max-width:560px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px;text-align:${rtl ? "right" : "left"}">
    <div style="color:#0F6E56;font-weight:700;font-size:18px;margin-bottom:14px">BARAKA PARTNERS</div>
    <h2 style="font-size:16px;margin:0 0 12px;color:#111">${esc(subject)}</h2>
    <p style="margin:0;line-height:1.9">${safe}</p>
    ${button}
    <p style="color:#888;font-size:12px;margin-top:24px">${rtl ? "هذه نسخة من رسالة في نظام المراسلات بعهد البركة." : "This is a copy of a message in the Ahd Al-Baraka messaging system."}</p>
  </div></body></html>`;
}

// حلّ خريطة القوالب الكاملة (مدمج + قاعدة) — للاستخدام في نموذج الإنشاء.
export async function resolveTemplatesMap(): Promise<Record<string, Record<Locale, Tpl>>> {
  const map: Record<string, Record<Locale, Tpl>> = JSON.parse(JSON.stringify(INTERNAL_TEMPLATES));
  try {
    const rows = await prisma.internalMessageTemplate.findMany({ where: { isActive: true } });
    for (const r of rows) {
      if (!map[r.templateKey]) map[r.templateKey] = {} as Record<Locale, Tpl>;
      map[r.templateKey][r.languageCode as Locale] = { subject: r.subject, body: r.body };
    }
  } catch (e) {
    console.error("[internal-msg] تعذّر جلب القوالب:", e);
  }
  return map;
}

// تسليم رسالة من الإدارة للمستلم: إشعار داخلي دائماً + نسخة بريد (كاملة أو إشعار) إن أمكن.
export async function deliverToRecipient(opts: {
  recipientUserId: string;
  recipientRole: string;
  threadId: string;
  locale: Locale;
  subject: string;
  body: string;
  emailCopy: boolean;
}): Promise<{ emailed: boolean }> {
  const link = `${inboxBasePath(opts.recipientRole)}/${opts.threadId}`;

  // إشعار داخلي (جرس) — دائماً
  try {
    await prisma.notification.create({
      data: { userId: opts.recipientUserId, type: "INTERNAL_NEW_MESSAGE", message: opts.subject, link },
    });
  } catch (e) {
    console.error("[internal-msg] تعذّر إنشاء الإشعار:", e);
  }

  if (!emailConfigured()) return { emailed: false };

  const u = await prisma.user.findUnique({
    where: { id: opts.recipientUserId },
    select: { email: true, fullName: true },
  });
  if (!u) return { emailed: false };

  try {
    if (opts.emailCopy) {
      await sendEmail({ to: u.email, subject: opts.subject, html: messageEmailHtml(opts.locale, opts.subject, opts.body, link) });
    } else {
      // الحد الأدنى: إشعار بريدي بوصول رسالة إلى الصندوق داخل المنصّة
      await sendEmail({
        to: u.email,
        subject: opts.subject,
        html: notificationEmailHtml({ fullName: u.fullName, message: "لديك رسالة جديدة في صندوقك بنظام المراسلات. سجّل الدخول لقراءتها.", link }),
      });
    }
    return { emailed: true };
  } catch (e) {
    console.error("[internal-msg] فشل إرسال البريد:", e);
    return { emailed: false };
  }
}

// إشعار الإدارة برد المستلم (المنشئ إن وُجد، وإلا كل الإداريين).
export async function notifyAdminOfReply(opts: {
  threadId: string;
  createdById: string | null;
  recipientName: string;
}): Promise<void> {
  const link = `/admin/messages/${opts.threadId}`;
  const message = `رد جديد من ${opts.recipientName} على مراسلة الإدارة.`;
  try {
    if (opts.createdById) {
      await prisma.notification.create({
        data: { userId: opts.createdById, type: "INTERNAL_NEW_MESSAGE", message, link },
      });
      if (emailConfigured()) {
        const a = await prisma.user.findUnique({ where: { id: opts.createdById }, select: { email: true, fullName: true } });
        if (a) await sendEmail({ to: a.email, subject: "رد جديد على مراسلة", html: notificationEmailHtml({ fullName: a.fullName, message, link }) });
      }
    } else {
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((a) => ({ userId: a.id, type: "INTERNAL_NEW_MESSAGE" as const, message, link })),
        });
      }
    }
  } catch (e) {
    console.error("[internal-msg] تعذّر إشعار الإدارة:", e);
  }
}

// عدد محادثات المستلم غير المقروءة (لشارة البوّابة). أفضل جهد.
export async function countRecipientUnread(userId: string): Promise<number> {
  try {
    return await prisma.internalThread.count({ where: { recipientUserId: userId, recipientUnread: true } });
  } catch {
    return 0;
  }
}
