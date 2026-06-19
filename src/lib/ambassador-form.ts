// تعريفات نموذج سفير الاستثمار — قوائم القيم الموحّدة وحالات الطلب ومساعدات.
// مصدر موحّد يستخدمه النموذج العام (AmbassadorForm) وإجراء الإرسال ولوحة الإدارة.
// القيم أكواد ثابتة تُخزَّن؛ التسميات تأتي من ambassador-i18n عبر ta().
import type {
  AmbassadorAppStatus,
  ReferralStatus,
  AmbassadorMessageStatus,
  AmbassadorContractStatus,
} from "@prisma/client";

// ===== قوائم خيارات النموذج (القيمة = كود ثابت، التسمية: opt.<group>.<value>) =====
export const WORK_TYPES = ["individual", "company", "consulting_office", "brokerage", "other"] as const;
export const YEARS_EXPERIENCE = ["lt2", "2to5", "5to10", "10to20", "gt20"] as const;
export const INVESTOR_TYPES = [
  "hnwi",
  "investment_company",
  "family_office",
  "fund",
  "holding",
  "real_estate_dev",
  "industrial",
  "agri",
  "energy",
  "government",
  "other",
] as const;
export const SECTORS = [
  "industry",
  "agriculture",
  "food",
  "realestate",
  "energy",
  "tourism",
  "logistics",
  "tech",
  "infrastructure",
  "mining",
  "reconstruction",
  "other",
] as const;
export const INVESTMENT_RANGES = ["lt100k", "100k_500k", "500k_1m", "1m_5m", "5m_20m", "gt20m"] as const;
export const RELATIONSHIP_TYPES = ["direct", "via_partners", "mixed"] as const;
export const YES_NO = ["yes", "no"] as const;
export const REGION_KNOWLEDGE = ["yes", "no", "some"] as const;
export const LANGUAGES = ["ar", "en", "tr", "zh", "fr", "ru", "other"] as const;

// أنواع المرفقات المسموح برفعها في النموذج العام (مفتاح الحقل → فئة الملف)
export const FILE_FIELDS = [
  { name: "cv", category: "cv", labelKey: "f.cv" },
  { name: "companyProfile", category: "company_profile", labelKey: "f.companyProfile" },
  { name: "personalProfile", category: "personal_profile", labelKey: "f.personalProfile" },
  { name: "workSamples", category: "work_sample", labelKey: "f.workSamples" },
  { name: "supporting", category: "supporting", labelKey: "f.supporting" },
] as const;

// الإقرارات الإلزامية (اسم الحقل في النموذج → عمود قاعدة البيانات)
export const REQUIRED_CONSENTS = [
  { field: "infoAccuracy", column: "infoAccuracyAck", labelKey: "c.infoAccuracy" },
  { field: "privacy", column: "privacyAccepted", labelKey: "c.privacy" },
  { field: "application", column: "applicationAck", labelKey: "c.application" },
  { field: "noRepresentation", column: "noRepresentationAck", labelKey: "c.noRepresentation" },
  { field: "contact", column: "contactConsent", labelKey: "c.contact" },
] as const;

// ===== خيارات ترشيح المستثمر (بوّابة السفير) =====
export const REF_INVESTOR_TYPES = [
  "individual",
  "company",
  "fund",
  "family_office",
  "holding",
  "government",
  "other",
] as const;
export const REF_RELATIONSHIP = ["direct", "via_third_party", "initial", "prior_contact"] as const;
export const REF_SERIOUSNESS = ["high", "medium", "low"] as const;
export const REF_CONSENT = ["yes", "no", "needs_confirmation"] as const;

export const ALL_REFERRAL_STATUSES: ReferralStatus[] = [
  "NEW",
  "UNDER_REVIEW",
  "NEEDS_INFO",
  "PRE_QUALIFIED",
  "NOT_QUALIFIED",
  "INVESTOR_CONTACTED",
  "AWAITING_INVESTOR",
  "MEETING_SCHEDULED",
  "NEGOTIATING",
  "CLOSED_WON",
  "CLOSED_LOST",
  "ARCHIVED",
];

export const REF_STATUS_TONE: Record<string, string> = {
  NEW: "blue",
  UNDER_REVIEW: "blue",
  NEEDS_INFO: "amber",
  PRE_QUALIFIED: "teal",
  NOT_QUALIFIED: "gray",
  INVESTOR_CONTACTED: "teal",
  AWAITING_INVESTOR: "amber",
  MEETING_SCHEDULED: "teal",
  NEGOTIATING: "blue",
  CLOSED_WON: "green",
  CLOSED_LOST: "gray",
  ARCHIVED: "gray",
};

export const ALL_MESSAGE_STATUSES: AmbassadorMessageStatus[] = ["NEW", "IN_PROGRESS", "REPLIED", "CLOSED"];
export const MSG_STATUS_TONE: Record<string, string> = {
  NEW: "blue",
  IN_PROGRESS: "amber",
  REPLIED: "green",
  CLOSED: "gray",
};
export const MESSAGE_TYPES = [
  "general",
  "new_investor",
  "file_followup",
  "clarification",
  "technical",
  "other",
] as const;

export const ALL_CONTRACT_STATUSES: AmbassadorContractStatus[] = [
  "NOT_SENT",
  "SENT",
  "OPENED",
  "AWAITING_SIGNATURE",
  "SIGNED",
  "REJECTED",
  "EXPIRED",
];
export const CONTRACT_STATUS_TONE: Record<string, string> = {
  NOT_SENT: "gray",
  SENT: "blue",
  OPENED: "blue",
  AWAITING_SIGNATURE: "amber",
  SIGNED: "green",
  REJECTED: "red",
  EXPIRED: "gray",
};

// ===== حالات الطلب: الترتيب واللون (التسمية من القاموس status.*) =====
export const ALL_AMB_STATUSES: AmbassadorAppStatus[] = [
  "NEW",
  "UNDER_REVIEW",
  "NEEDS_INFO",
  "INTERVIEW",
  "PRE_QUALIFIED",
  "NOT_QUALIFIED",
  "PRE_ACCEPTED",
  "AWAITING_CONTRACT",
  "CONTRACT_SIGNED",
  "ACCOUNT_CREATED",
  "ACTIVE",
  "SUSPENDED",
  "REJECTED",
  "ARCHIVED",
];

export const AMB_STATUS_TONE: Record<string, string> = {
  NEW: "blue",
  UNDER_REVIEW: "blue",
  NEEDS_INFO: "amber",
  INTERVIEW: "teal",
  PRE_QUALIFIED: "teal",
  NOT_QUALIFIED: "gray",
  PRE_ACCEPTED: "green",
  AWAITING_CONTRACT: "amber",
  CONTRACT_SIGNED: "green",
  ACCOUNT_CREATED: "green",
  ACTIVE: "green",
  SUSPENDED: "amber",
  REJECTED: "red",
  ARCHIVED: "gray",
};

// ===== مساعدات =====

// تثبيت قيمة واردة من نموذج إلى كود معروف (أو null إن لم تطابق)
export function normalizeOption<T extends readonly string[]>(
  allowed: T,
  value: string | null | undefined
): T[number] | null {
  if (!value) return null;
  return (allowed as readonly string[]).includes(value) ? (value as T[number]) : null;
}

// تثبيت مجموعة قيم متعددة الاختيار إلى الأكواد المعروفة فقط
export function normalizeMulti<T extends readonly string[]>(allowed: T, values: string[]): T[number][] {
  const set = new Set(allowed as readonly string[]);
  return values.filter((v) => set.has(v)) as T[number][];
}

// تحويل نص حر (دول مفصولة بفواصل/أسطر) إلى مصفوفة منظّفة
export function parseList(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[,\n،;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
}

// قراءة حقل Json مخزَّن كمصفوفة نصوص بأمان
export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}
