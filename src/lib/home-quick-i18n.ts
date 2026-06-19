// ترجمة + منطق نموذج الصفحة الرئيسية السريع (معزول — لا يلمس crm-i18n).
// يعيد استخدام مفاتيح الحقول المشتركة من crm-i18n عبر tc()؛ هنا ما يخصّ النموذج السريع.
import type { Locale } from "@/lib/i18n";

type Quad = { ar: string; en: string; tr: string; zh: string };

const M: Record<string, Quad> = {
  "quickTitle": { ar: "تواصل سريع", en: "Quick contact", tr: "Hızlı iletişim", zh: "快速联系" },
  "quickSub": {
    ar: "اترك بياناتك ونوع اهتمامك، وسيعاود فريق شركاء البركة التواصل معك.",
    en: "Leave your details and interest, and the Baraka Partners team will get back to you.",
    tr: "Bilgilerinizi ve ilginizi bırakın; Baraka Partners ekibi sizinle iletişime geçecek.",
    zh: "留下您的信息和意向，Baraka Partners 团队将与您联系。",
  },
  "interestType": { ar: "نوع الاهتمام", en: "Your interest", tr: "İlginiz", zh: "您的意向" },
  "interestLabel": { ar: "نوع الاهتمام", en: "Interest", tr: "İlgi", zh: "意向" },
  "phoneWa": { ar: "الهاتف / واتساب", en: "Phone / WhatsApp", tr: "Telefon / WhatsApp", zh: "电话 / WhatsApp" },

  // أنواع الاهتمام (أكواد موحّدة)
  "it.looking": {
    ar: "أبحث عن فرصة استثمارية",
    en: "Looking for an investment opportunity",
    tr: "Yatırım fırsatı arıyorum",
    zh: "寻找投资机会",
  },
  "it.have": {
    ar: "أملك فرصة استثمارية",
    en: "I have an investment opportunity",
    tr: "Bir yatırım fırsatım var",
    zh: "我有投资机会",
  },
  "it.contact": {
    ar: "أريد التواصل مع الإدارة",
    en: "I want to contact the team",
    tr: "Ekiple iletişime geçmek istiyorum",
    zh: "我想联系管理团队",
  },
};

export function thq(locale: Locale, key: string): string {
  const e = M[key];
  return e ? (e[locale] ?? e.ar) : key;
}

export const HOME_INTERESTS = ["looking", "have", "contact"] as const;
export type HomeInterest = (typeof HOME_INTERESTS)[number];

// ربط نوع الاهتمام بصفة المرسل للتصنيف داخل الـ CRM
export const HOME_INTEREST_TO_SENDER_ROLE: Partial<Record<HomeInterest, string>> = {
  looking: "investor",
  have: "project_owner",
};
