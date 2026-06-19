// مخطط نموذج تسجيل «وكيل صاحب الأصل» — 5 أقسام (المرجع: تعليمات القسم §16).
// يقرؤه محرّك الـ wizard (AgentApplicationWizard) لعرض الأقسام والتحقّق.
// متعدّد اللغات: agentFormPages(locale) يعيد الأقسام بنصوص اللغة المطلوبة.
// التصنيفات من agent.ts والتسميات المشتركة من agent-i18n.ts.
import type { Locale } from "@/lib/i18n";
import {
  pick,
  type Taxon,
  PROFESSIONAL_TYPES,
  RELATIONSHIP_TYPES,
  ASSET_TYPES,
  REGIONS,
  CONTACT_LANGUAGES,
  YES_NO,
} from "@/lib/agent";
import { agentUi } from "@/lib/agent-i18n";

export type Ans = Record<string, string | string[]>;

export type FieldKind =
  | "text"
  | "textarea"
  | "tel"
  | "email"
  | "url"
  | "country"
  | "radio"
  | "checkbox" // اختيار متعدّد
  | "consent" // مربّع موافقة مفرد
  | "info";

export interface Opt {
  v: string;
  l: string;
}

export interface Field {
  id: string;
  kind: FieldKind;
  label?: string;
  help?: string;
  placeholder?: string;
  required?: boolean;
  options?: Opt[];
  showIf?: (a: Ans) => boolean;
  note?: string;
  noteTone?: "info" | "warn";
}

export interface FormPage {
  id: string;
  title: string;
  subtitle?: string;
  fields: Field[];
  filesStep?: boolean; // يعرض رافع الملفات ضمن هذا القسم
}

// مساعدات الشروط
export const is = (a: Ans, id: string, v: string) => a[id] === v;
export const has = (a: Ans, id: string, v: string) =>
  Array.isArray(a[id]) && (a[id] as string[]).includes(v);

function opts(list: Taxon[], locale: Locale): Opt[] {
  return list.map((x) => ({ v: x.code, l: pick(x.label, locale) }));
}

// نصوص خاصة بالنموذج فقط (غير موجودة في agent-i18n)
interface FormText {
  step1: string;
  step1Sub: string;
  step2: string;
  step2Sub: string;
  step3: string;
  step3Sub: string;
  step4: string;
  step4Sub: string;
  step5: string;
  step5Sub: string;
  fullName: string;
  specify: string;
  capabilitiesNote: string;
  consentNote: string;
  langLabel: string;
  whatsappHelp: string;
  phoneHelp: string;
}

const FT: Record<Locale, FormText> = {
  ar: {
    step1: "البيانات الشخصية",
    step1Sub: "بياناتك الشخصية ووسائل التواصل معك.",
    step2: "الصفة المهنية والخبرة",
    step2Sub: "صفتك المهنية وسنوات خبرتك في هذا المجال.",
    step3: "العلاقة والتغطية",
    step3Sub: "علاقتك بأصحاب الأصول والأنواع والمناطق التي تغطّيها.",
    step4: "الملفات والروابط المهنية",
    step4Sub: "روابطك المهنية وأي ملفات داعمة (اختياري).",
    step5: "الإقرار والموافقة",
    step5Sub: "اقرأ الإقرارات التالية ووافق عليها قبل الإرسال.",
    fullName: "الاسم الكامل",
    specify: "يرجى التوضيح",
    capabilitiesNote: "أجب بصدق — تساعدنا هذه الإجابات على تقييم جدّية الفرص التي قد تقدّمها.",
    consentNote: "بتقديمك الطلب فإنك تقرّ بما يلي. تقديم الطلب لا يعني القبول؛ تخضع جميع البيانات لمراجعة الإدارة.",
    langLabel: "اللغة المفضّلة للتواصل",
    whatsappHelp: "إن كان مختلفاً عن رقم الهاتف.",
    phoneHelp: "أدخل الرقم مع رمز الدولة (مثال: ‎+90...).",
  },
  en: {
    step1: "Personal details",
    step1Sub: "Your personal details and how to reach you.",
    step2: "Professional capacity & experience",
    step2Sub: "Your professional capacity and years of experience in this field.",
    step3: "Relationship & coverage",
    step3Sub: "Your relationship with asset owners and the types and regions you cover.",
    step4: "Files & professional links",
    step4Sub: "Your professional links and any supporting files (optional).",
    step5: "Acknowledgements & consent",
    step5Sub: "Read and accept the following acknowledgements before submitting.",
    fullName: "Full name",
    specify: "Please specify",
    capabilitiesNote: "Answer honestly — these help us assess the seriousness of the opportunities you may submit.",
    consentNote: "By submitting, you acknowledge the following. Applying does not mean acceptance; all data is subject to management review.",
    langLabel: "Preferred contact language",
    whatsappHelp: "If different from your phone number.",
    phoneHelp: "Enter the number with country code (e.g. +90...).",
  },
  tr: {
    step1: "Kişisel bilgiler",
    step1Sub: "Kişisel bilgileriniz ve size ulaşma yolları.",
    step2: "Mesleki sıfat ve deneyim",
    step2Sub: "Mesleki sıfatınız ve bu alandaki deneyim yıllarınız.",
    step3: "İlişki ve kapsam",
    step3Sub: "Varlık sahipleriyle ilişkiniz ile kapsadığınız türler ve bölgeler.",
    step4: "Dosyalar ve mesleki bağlantılar",
    step4Sub: "Mesleki bağlantılarınız ve varsa destekleyici dosyalar (isteğe bağlı).",
    step5: "Onaylar ve muvafakat",
    step5Sub: "Göndermeden önce aşağıdaki onayları okuyup kabul edin.",
    fullName: "Tam ad",
    specify: "Lütfen belirtin",
    capabilitiesNote: "Lütfen dürüstçe yanıtlayın — bu yanıtlar sunabileceğiniz fırsatların ciddiyetini değerlendirmemize yardımcı olur.",
    consentNote: "Göndererek aşağıdakileri kabul edersiniz. Başvuru kabul anlamına gelmez; tüm bilgiler yönetim incelemesine tabidir.",
    langLabel: "Tercih edilen iletişim dili",
    whatsappHelp: "Telefon numaranızdan farklıysa.",
    phoneHelp: "Numarayı ülke koduyla girin (örn. +90...).",
  },
  zh: {
    step1: "Personal details",
    step1Sub: "Your personal details and how to reach you.",
    step2: "Professional capacity & experience",
    step2Sub: "Your professional capacity and years of experience in this field.",
    step3: "Relationship & coverage",
    step3Sub: "Your relationship with asset owners and the types and regions you cover.",
    step4: "Files & professional links",
    step4Sub: "Your professional links and any supporting files (optional).",
    step5: "Acknowledgements & consent",
    step5Sub: "Read and accept the following acknowledgements before submitting.",
    fullName: "Full name",
    specify: "Please specify",
    capabilitiesNote: "Answer honestly — these help us assess the seriousness of the opportunities you may submit.",
    consentNote: "By submitting, you acknowledge the following. Applying does not mean acceptance; all data is subject to management review.",
    langLabel: "Preferred contact language",
    whatsappHelp: "If different from your phone number.",
    phoneHelp: "Enter the number with country code (e.g. +90...).",
  },
};

export function agentFormPages(locale: Locale): FormPage[] {
  const ui = agentUi(locale);
  const ft = FT[locale] ?? FT.en;
  const yesNo = opts(YES_NO, locale);

  return [
    // ===== 1) البيانات الشخصية وبيانات التواصل =====
    {
      id: "personal",
      title: ft.step1,
      subtitle: ft.step1Sub,
      fields: [
        { id: "fullName", kind: "text", label: ft.fullName, required: true },
        { id: "country", kind: "country", label: ui.fResidence, required: true },
        { id: "nationality", kind: "country", label: ui.fNationality },
        { id: "city", kind: "text", label: ui.fCity, required: true },
        { id: "phone", kind: "tel", label: ui.fPhone, required: true, help: ft.phoneHelp },
        { id: "whatsapp", kind: "tel", label: ui.fWhatsapp, help: ft.whatsappHelp },
        { id: "email", kind: "email", label: ui.fEmail, required: true },
        { id: "preferredLanguage", kind: "radio", label: ft.langLabel, required: true, options: opts(CONTACT_LANGUAGES, locale) },
      ],
    },

    // ===== 2) الصفة المهنية والخبرة =====
    {
      id: "professional",
      title: ft.step2,
      subtitle: ft.step2Sub,
      fields: [
        { id: "professionalType", kind: "radio", label: ui.fProfType, required: true, options: opts(PROFESSIONAL_TYPES, locale) },
        { id: "professionalTypeOther", kind: "text", label: ft.specify, showIf: (a) => is(a, "professionalType", "other") },
        { id: "experienceYears", kind: "text", label: ui.fExpYears },
        { id: "experienceDescription", kind: "textarea", label: ui.fExpDesc },
        { id: "hasPreviousDeals", kind: "radio", label: ui.fPrevDeals, options: yesNo },
        { id: "previousDeals", kind: "textarea", label: ui.fPrevDealsDesc, showIf: (a) => is(a, "hasPreviousDeals", "yes") },
      ],
    },

    // ===== 3) العلاقة والتغطية والقدرات =====
    {
      id: "coverage",
      title: ft.step3,
      subtitle: ft.step3Sub,
      fields: [
        { id: "relationshipType", kind: "radio", label: ui.fRelationship, required: true, options: opts(RELATIONSHIP_TYPES, locale) },
        { id: "relationshipTypeOther", kind: "text", label: ft.specify, showIf: (a) => is(a, "relationshipType", "other") },
        { id: "coveredAssetTypes", kind: "checkbox", label: ui.fAssetTypes, required: true, options: opts(ASSET_TYPES, locale) },
        { id: "coveredAssetTypesOther", kind: "text", label: ft.specify, showIf: (a) => has(a, "coveredAssetTypes", "other") },
        { id: "coveredRegions", kind: "checkbox", label: ui.fRegions, required: true, options: opts(REGIONS, locale) },
        { id: "coveredRegionsOther", kind: "text", label: ft.specify, showIf: (a) => has(a, "coveredRegions", "other") },
        { id: "cap-note", kind: "info", note: ft.capabilitiesNote, noteTone: "info" },
        { id: "canProvideInfo", kind: "radio", label: ui.capProvideInfo, options: yesNo },
        { id: "canContactOwner", kind: "radio", label: ui.capContactOwner, options: yesNo },
        { id: "canArrangeMeeting", kind: "radio", label: ui.capArrangeMeeting, options: yesNo },
        { id: "canProvideDocuments", kind: "radio", label: ui.capProvideDocs, options: yesNo },
        { id: "ownerWantsDeal", kind: "radio", label: ui.capOwnerWants, options: yesNo },
        { id: "hasOwnerPermission", kind: "radio", label: ui.capOwnerPermission, options: yesNo },
      ],
    },

    // ===== 4) الملفات والروابط المهنية =====
    {
      id: "links",
      title: ft.step4,
      subtitle: ft.step4Sub,
      filesStep: true,
      fields: [
        { id: "linkedinUrl", kind: "url", label: ui.linkLinkedin, placeholder: "https://linkedin.com/in/..." },
        { id: "websiteUrl", kind: "url", label: ui.linkWebsite, placeholder: "https://..." },
        { id: "companyUrl", kind: "url", label: ui.linkCompany, placeholder: "https://..." },
      ],
    },

    // ===== 5) الإقرار والموافقة =====
    {
      id: "consent",
      title: ft.step5,
      subtitle: ft.step5Sub,
      fields: [
        { id: "consent-note", kind: "info", note: ft.consentNote, noteTone: "info" },
        { id: "ackAccuracy", kind: "consent", label: ui.ackAccuracy, required: true },
        { id: "ackNoRepresentation", kind: "consent", label: ui.ackNoRepresentation, required: true },
        { id: "ackPrivacy", kind: "consent", label: ui.ackPrivacy, required: true },
        { id: "ackContact", kind: "consent", label: ui.ackContact, required: true },
        { id: "ackOwnerConsent", kind: "consent", label: ui.ackOwnerConsent, required: true },
      ],
    },
  ];
}

// قائمة معرّفات الإقرارات الإلزامية (يستخدمها الإجراء والـ wizard)
export const CONSENT_IDS = [
  "ackAccuracy",
  "ackNoRepresentation",
  "ackPrivacy",
  "ackContact",
  "ackOwnerConsent",
] as const;
