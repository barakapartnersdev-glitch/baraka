// منطق قسم «وكلاء أصحاب الأصول» (Asset Owner Agents) — التصنيفات الموحّدة وحالات
// الطلب وألوان الشارات. وحدة خالصة (تُستورد في الخادم والعميل) — لا next/headers.
//
// مرآة لنظام «سفراء الاستثمار» (Ambassadors): نفس البنية والأسلوب، لكن للوكلاء الذين
// يمثّلون أصحاب الأصول/المشاريع بدل ترشيح المستثمرين.
//
// التسميات تُحفظ كأكواد ثابتة (code) وتُعرض حسب اللغة عبر pick().
import type { Locale } from "@/lib/i18n";

// نص ثلاثي اللغة (العربية/الإنجليزية/التركية). الصينية ترجع للإنجليزية.
export interface Tri {
  ar: string;
  en: string;
  tr: string;
}

export function pick(tri: Tri, locale: Locale): string {
  if (locale === "ar") return tri.ar;
  if (locale === "tr") return tri.tr;
  return tri.en; // en + zh (احتياطي)
}

export interface Taxon {
  code: string;
  label: Tri;
}

// عرض تسمية كود مفرد محفوظ
export function labelFor(list: Taxon[], code: string | null | undefined, locale: Locale): string {
  if (!code) return "—";
  const found = list.find((x) => x.code === code);
  return found ? pick(found.label, locale) : code;
}

// عرض تسميات قائمة أكواد (اختيار متعدّد)
export function labelsFor(list: Taxon[], codes: unknown, locale: Locale): string[] {
  if (!Array.isArray(codes)) return [];
  return codes.map((c) => labelFor(list, String(c), locale));
}

// ===== الصفة المهنية =====
export const PROFESSIONAL_TYPES: Taxon[] = [
  { code: "independent", label: { ar: "فرد مستقل", en: "Independent individual", tr: "Bağımsız birey" } },
  { code: "real_estate_broker", label: { ar: "وسيط عقاري", en: "Real estate broker", tr: "Emlak komisyoncusu" } },
  { code: "investment_advisor", label: { ar: "مستشار استثماري", en: "Investment advisor", tr: "Yatırım danışmanı" } },
  { code: "real_estate_office", label: { ar: "مكتب عقاري", en: "Real estate office", tr: "Emlak ofisi" } },
  { code: "consulting_firm", label: { ar: "شركة استشارات", en: "Consulting firm", tr: "Danışmanlık şirketi" } },
  { code: "legal_advisor", label: { ar: "محامٍ / مستشار قانوني", en: "Lawyer / legal advisor", tr: "Avukat / hukuk danışmanı" } },
  { code: "relationship_manager", label: { ar: "مدير علاقات", en: "Relationship manager", tr: "İlişki yöneticisi" } },
  { code: "other", label: { ar: "أخرى", en: "Other", tr: "Diğer" } },
];

// ===== نوع العلاقة مع أصحاب الأصول =====
export const RELATIONSHIP_TYPES: Taxon[] = [
  { code: "direct_owner", label: { ar: "علاقة مباشرة مع مالك الأصل", en: "Direct relationship with the asset owner", tr: "Varlık sahibiyle doğrudan ilişki" } },
  { code: "legal_rep", label: { ar: "علاقة مع ممثل قانوني للمالك", en: "Relationship with the owner's legal representative", tr: "Sahibin hukuki temsilcisiyle ilişki" } },
  { code: "owning_company", label: { ar: "علاقة مع شركة مالكة", en: "Relationship with an owning company", tr: "Malik şirketle ilişki" } },
  { code: "other_broker", label: { ar: "علاقة مع وسيط آخر", en: "Relationship with another broker", tr: "Başka bir aracıyla ilişki" } },
  { code: "social_business", label: { ar: "علاقة اجتماعية أو تجارية", en: "Social or business relationship", tr: "Sosyal veya ticari ilişki" } },
  { code: "other", label: { ar: "غير ذلك", en: "Other", tr: "Diğer" } },
];

// ===== أنواع الأصول التي يمكن للوكيل توفيرها =====
export const ASSET_TYPES: Taxon[] = [
  { code: "land", label: { ar: "أراضٍ", en: "Land", tr: "Arsa / arazi" } },
  { code: "residential", label: { ar: "عقارات سكنية", en: "Residential real estate", tr: "Konut gayrimenkulü" } },
  { code: "commercial", label: { ar: "عقارات تجارية", en: "Commercial real estate", tr: "Ticari gayrimenkul" } },
  { code: "hotels", label: { ar: "فنادق ومنشآت سياحية", en: "Hotels & tourism facilities", tr: "Oteller ve turizm tesisleri" } },
  { code: "factories", label: { ar: "مصانع", en: "Factories", tr: "Fabrikalar" } },
  { code: "agricultural", label: { ar: "مشاريع زراعية", en: "Agricultural projects", tr: "Tarım projeleri" } },
  { code: "industrial", label: { ar: "مشاريع صناعية", en: "Industrial projects", tr: "Sanayi projeleri" } },
  { code: "distressed", label: { ar: "مشاريع متعثرة", en: "Distressed projects", tr: "Sorunlu projeler" } },
  { code: "companies_for_sale", label: { ar: "شركات للبيع أو الشراكة", en: "Companies for sale or partnership", tr: "Satılık veya ortaklık şirketleri" } },
  { code: "general_opportunities", label: { ar: "فرص استثمارية عامة", en: "General investment opportunities", tr: "Genel yatırım fırsatları" } },
  { code: "other", label: { ar: "أخرى", en: "Other", tr: "Diğer" } },
];

// ===== الدول / المناطق التي يغطيها الوكيل =====
export const REGIONS: Taxon[] = [
  { code: "syria", label: { ar: "سوريا", en: "Syria", tr: "Suriye" } },
  { code: "turkey", label: { ar: "تركيا", en: "Türkiye", tr: "Türkiye" } },
  { code: "gulf", label: { ar: "دول الخليج", en: "Gulf countries", tr: "Körfez ülkeleri" } },
  { code: "iraq", label: { ar: "العراق", en: "Iraq", tr: "Irak" } },
  { code: "egypt", label: { ar: "مصر", en: "Egypt", tr: "Mısır" } },
  { code: "jordan", label: { ar: "الأردن", en: "Jordan", tr: "Ürdün" } },
  { code: "europe", label: { ar: "أوروبا", en: "Europe", tr: "Avrupa" } },
  { code: "other", label: { ar: "أخرى", en: "Other", tr: "Diğer" } },
];

// نعم / لا (للأسئلة الثنائية)
export const YES_NO: Taxon[] = [
  { code: "yes", label: { ar: "نعم", en: "Yes", tr: "Evet" } },
  { code: "no", label: { ar: "لا", en: "No", tr: "Hayır" } },
];

// اللغة المفضّلة للتواصل (القسم متاح بثلاث لغات فقط)
export const CONTACT_LANGUAGES: Taxon[] = [
  { code: "ar", label: { ar: "العربية", en: "Arabic", tr: "Arapça" } },
  { code: "tr", label: { ar: "التركية", en: "Turkish", tr: "Türkçe" } },
  { code: "en", label: { ar: "الإنجليزية", en: "English", tr: "İngilizce" } },
];

// ===== حالات طلب الوكيل =====
// تطابق enum AssetAgentAppStatus في Prisma (انظر ملف التكامل ASSET_OWNER_AGENTS_INTEGRATION.md).
export const AGENT_STATUSES = [
  "NEW",
  "UNDER_REVIEW",
  "NEEDS_INFO",
  "PRE_QUALIFIED",
  "REJECTED",
  "AWAITING_CONTRACT",
  "CONTRACTED",
  "ACTIVE",
  "SUSPENDED",
] as const;

export type AgentStatus = (typeof AGENT_STATUSES)[number];

export const AGENT_STATUS_LABELS: Record<string, Tri> = {
  NEW: { ar: "جديد", en: "New", tr: "Yeni" },
  UNDER_REVIEW: { ar: "قيد المراجعة", en: "Under review", tr: "İnceleniyor" },
  NEEDS_INFO: { ar: "بحاجة إلى معلومات إضافية", en: "Needs more information", tr: "Ek bilgi gerekli" },
  PRE_QUALIFIED: { ar: "مؤهَّل مبدئياً", en: "Pre-qualified", tr: "Ön onaylı" },
  REJECTED: { ar: "مرفوض", en: "Rejected", tr: "Reddedildi" },
  AWAITING_CONTRACT: { ar: "بانتظار توقيع العقد", en: "Awaiting contract", tr: "Sözleşme bekleniyor" },
  CONTRACTED: { ar: "تم التعاقد", en: "Contracted", tr: "Sözleşme imzalandı" },
  ACTIVE: { ar: "حساب مفعّل", en: "Account active", tr: "Hesap aktif" },
  SUSPENDED: { ar: "موقوف", en: "Suspended", tr: "Askıya alındı" },
};

const AGENT_STATUS_TONE: Record<string, string> = {
  NEW: "blue",
  UNDER_REVIEW: "blue",
  NEEDS_INFO: "amber",
  PRE_QUALIFIED: "teal",
  REJECTED: "red",
  AWAITING_CONTRACT: "amber",
  CONTRACTED: "teal",
  ACTIVE: "green",
  SUSPENDED: "gray",
};

// شارة الحالة (التسمية حسب اللغة + اللون) — للاستخدام مع مكوّن Badge.
export function agentStatusBadge(locale: Locale, status: string): { label: string; tone: string } {
  const tri = AGENT_STATUS_LABELS[status];
  return {
    label: tri ? pick(tri, locale) : status,
    tone: AGENT_STATUS_TONE[status] ?? "gray",
  };
}

// ============================================================
// ===== المرحلة 2: تصنيفات وحالات الأصول/العقود/المراسلات =====
// ============================================================

// حالة الأصل (وضعه الحالي)
export const ASSET_STATUSES: Taxon[] = [
  { code: "operating", label: { ar: "قائم/مُشغَّل", en: "Operating", tr: "Faal" } },
  { code: "distressed", label: { ar: "متعثّر", en: "Distressed", tr: "Sorunlu" } },
  { code: "needs_financing", label: { ar: "يحتاج تمويلاً", en: "Needs financing", tr: "Finansman gerekiyor" } },
  { code: "for_sale", label: { ar: "للبيع", en: "For sale", tr: "Satılık" } },
  { code: "for_partnership", label: { ar: "للشراكة", en: "For partnership", tr: "Ortaklık için" } },
  { code: "for_development", label: { ar: "للتطوير", en: "For development", tr: "Geliştirme için" } },
];

// نوع العرض المطلوب على الأصل
export const OFFER_TYPES: Taxon[] = [
  { code: "sale", label: { ar: "بيع", en: "Sale", tr: "Satış" } },
  { code: "partnership", label: { ar: "شراكة", en: "Partnership", tr: "Ortaklık" } },
  { code: "financing", label: { ar: "تمويل", en: "Financing", tr: "Finansman" } },
  { code: "operation", label: { ar: "تشغيل/إدارة", en: "Operation / management", tr: "İşletme / yönetim" } },
  { code: "restructuring", label: { ar: "إعادة هيكلة", en: "Restructuring", tr: "Yeniden yapılandırma" } },
];

// ===== حالات الأصل المقدّم (AssetSubmissionStatus) =====
export const SUBMISSION_STATUSES = [
  "NEW_SUBMISSION", "UNDER_REVIEW", "NEEDS_INFO", "PRE_QUALIFIED",
  "NOT_QUALIFIED", "APPROVED", "CONVERTED", "REJECTED", "ARCHIVED",
] as const;

const SUBMISSION_STATUS_LABELS: Record<string, Tri> = {
  NEW_SUBMISSION: { ar: "جديد", en: "New", tr: "Yeni" },
  UNDER_REVIEW: { ar: "قيد المراجعة", en: "Under review", tr: "İnceleniyor" },
  NEEDS_INFO: { ar: "بحاجة معلومات", en: "Needs info", tr: "Bilgi gerekli" },
  PRE_QUALIFIED: { ar: "مؤهَّل مبدئياً", en: "Pre-qualified", tr: "Ön onaylı" },
  NOT_QUALIFIED: { ar: "غير مؤهَّل", en: "Not qualified", tr: "Uygun değil" },
  APPROVED: { ar: "معتمد", en: "Approved", tr: "Onaylandı" },
  CONVERTED: { ar: "حُوِّل إلى فرصة", en: "Converted to opportunity", tr: "Fırsata dönüştürüldü" },
  REJECTED: { ar: "مرفوض", en: "Rejected", tr: "Reddedildi" },
  ARCHIVED: { ar: "مؤرشف", en: "Archived", tr: "Arşivlendi" },
};

const SUBMISSION_STATUS_TONE: Record<string, string> = {
  NEW_SUBMISSION: "blue", UNDER_REVIEW: "blue", NEEDS_INFO: "amber", PRE_QUALIFIED: "teal",
  NOT_QUALIFIED: "gray", APPROVED: "green", CONVERTED: "green", REJECTED: "red", ARCHIVED: "gray",
};

export function submissionStatusBadge(locale: Locale, status: string): { label: string; tone: string } {
  const tri = SUBMISSION_STATUS_LABELS[status];
  return { label: tri ? pick(tri, locale) : status, tone: SUBMISSION_STATUS_TONE[status] ?? "gray" };
}

// ===== حالات عقد الوكالة (AssetAgentContractStatus) =====
export const AGENT_CONTRACT_STATUSES = [
  "NOT_SENT", "SENT", "OPENED", "AWAITING_SIGNATURE", "SIGNED", "REJECTED", "EXPIRED",
] as const;

const CONTRACT_STATUS_LABELS: Record<string, Tri> = {
  NOT_SENT: { ar: "لم يُرسَل", en: "Not sent", tr: "Gönderilmedi" },
  SENT: { ar: "تم الإرسال", en: "Sent", tr: "Gönderildi" },
  OPENED: { ar: "تم الفتح", en: "Opened", tr: "Açıldı" },
  AWAITING_SIGNATURE: { ar: "بانتظار التوقيع", en: "Awaiting signature", tr: "İmza bekleniyor" },
  SIGNED: { ar: "تم التوقيع", en: "Signed", tr: "İmzalandı" },
  REJECTED: { ar: "مرفوض", en: "Rejected", tr: "Reddedildi" },
  EXPIRED: { ar: "منتهي الصلاحية", en: "Expired", tr: "Süresi doldu" },
};

const CONTRACT_STATUS_TONE: Record<string, string> = {
  NOT_SENT: "gray", SENT: "blue", OPENED: "blue", AWAITING_SIGNATURE: "amber",
  SIGNED: "green", REJECTED: "red", EXPIRED: "gray",
};

export function agentContractStatusBadge(locale: Locale, status: string): { label: string; tone: string } {
  const tri = CONTRACT_STATUS_LABELS[status];
  return { label: tri ? pick(tri, locale) : status, tone: CONTRACT_STATUS_TONE[status] ?? "gray" };
}

// ===== حالات الرسالة الداخلية (AssetAgentMessageStatus) =====
const MESSAGE_STATUS_LABELS: Record<string, Tri> = {
  NEW: { ar: "جديد", en: "New", tr: "Yeni" },
  IN_PROGRESS: { ar: "قيد الرد", en: "In progress", tr: "Yanıtlanıyor" },
  REPLIED: { ar: "تم الرد", en: "Replied", tr: "Yanıtlandı" },
  CLOSED: { ar: "مغلق", en: "Closed", tr: "Kapalı" },
};
const MESSAGE_STATUS_TONE: Record<string, string> = {
  NEW: "blue", IN_PROGRESS: "amber", REPLIED: "green", CLOSED: "gray",
};
export function agentMessageStatusBadge(locale: Locale, status: string): { label: string; tone: string } {
  const tri = MESSAGE_STATUS_LABELS[status];
  return { label: tri ? pick(tri, locale) : status, tone: MESSAGE_STATUS_TONE[status] ?? "gray" };
}

export const AGENT_MESSAGE_TYPES: Taxon[] = [
  { code: "general", label: { ar: "استفسار عام", en: "General inquiry", tr: "Genel soru" } },
  { code: "new_asset", label: { ar: "أصل جديد", en: "New asset", tr: "Yeni varlık" } },
  { code: "asset_followup", label: { ar: "متابعة أصل", en: "Asset follow-up", tr: "Varlık takibi" } },
  { code: "clarification", label: { ar: "طلب توضيح", en: "Clarification", tr: "Açıklama" } },
  { code: "technical", label: { ar: "مشكلة تقنية", en: "Technical issue", tr: "Teknik sorun" } },
  { code: "other", label: { ar: "أخرى", en: "Other", tr: "Diğer" } },
];
