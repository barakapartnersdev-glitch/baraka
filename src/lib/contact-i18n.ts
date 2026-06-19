// ترجمة + منطق نموذج التواصل العام (معزول — لا يلمس crm-i18n المُتنازَع عليه).
// يعيد استخدام مفاتيح الحقول المشتركة من crm-i18n عبر tc()؛ هنا فقط ما يخصّ التواصل.
import type { Locale } from "@/lib/i18n";

type Quad = { ar: string; en: string; tr: string; zh: string };

const M: Record<string, Quad> = {
  "contact.formTitle": {
    ar: "أرسل لنا رسالة",
    en: "Send us a message",
    tr: "Bize bir mesaj gönderin",
    zh: "给我们留言",
  },
  "contact.formSub": {
    ar: "املأ النموذج وسيتواصل معك فريقنا في أقرب وقت ممكن.",
    en: "Fill in the form and our team will get back to you as soon as possible.",
    tr: "Formu doldurun; ekibimiz en kısa sürede size dönecektir.",
    zh: "填写表单，我们的团队将尽快与您联系。",
  },
  "field.requestType": {
    ar: "نوع الطلب",
    en: "Request type",
    tr: "Talep türü",
    zh: "请求类型",
  },
  "requestTypeLabel": { ar: "نوع الطلب", en: "Request type", tr: "Talep türü", zh: "请求类型" },

  // أنواع الطلب (قيم موحّدة تُحفظ كأكواد)
  "rt.general": { ar: "استفسار عام", en: "General inquiry", tr: "Genel soru", zh: "一般咨询" },
  "rt.investor": { ar: "مستثمر", en: "Investor", tr: "Yatırımcı", zh: "投资者" },
  "rt.opportunity_owner": { ar: "صاحب فرصة", en: "Opportunity owner", tr: "Fırsat sahibi", zh: "机会持有者" },
  "rt.partnership": { ar: "شراكة", en: "Partnership", tr: "Ortaklık", zh: "合作" },
  "rt.consulting": { ar: "خدمة استشارية", en: "Consulting service", tr: "Danışmanlık hizmeti", zh: "咨询服务" },
  "rt.media": { ar: "إعلام وصحافة", en: "Media & press", tr: "Medya ve basın", zh: "媒体与新闻" },
  "rt.other": { ar: "أخرى", en: "Other", tr: "Diğer", zh: "其他" },
};

export function tcc(locale: Locale, key: string): string {
  const e = M[key];
  return e ? (e[locale] ?? e.ar) : key;
}

// أكواد أنواع الطلب بالترتيب
export const REQUEST_TYPES = [
  "general",
  "investor",
  "opportunity_owner",
  "partnership",
  "consulting",
  "media",
  "other",
] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

// ربط نوع الطلب بصفة المرسل (senderRole) حيث يوجد تطابق نظيف — للتصنيف داخل الـ CRM
export const REQUEST_TYPE_TO_SENDER_ROLE: Partial<Record<RequestType, string>> = {
  investor: "investor",
  opportunity_owner: "project_owner",
  consulting: "consultant",
  partnership: "partner",
};
