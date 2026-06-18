// منطق نظام الـ CRM (إدارة العلاقات) — تعريفات الحالات والأهمية ودرجة الجدية
// والقيم الموحّدة وبنّاؤو الشارات. التسميات تأتي من crm-i18n عبر tc().
import type { LeadType, LeadPriority } from "@prisma/client";
import { tc } from "@/lib/crm-i18n";
import type { Locale } from "@/lib/i18n";

// ===== الحالات: اللون لكل حالة (التسمية من القاموس crmStatus.*) =====
export const STATUS_TONE: Record<string, string> = {
  NEW: "blue",
  UNDER_REVIEW: "blue",
  CONTACTED: "teal",
  AWAITING_REPLY: "amber",
  QUALIFIED: "green",
  NOT_QUALIFIED: "gray",
  NEEDS_INFO: "amber",
  FILE_SENT: "teal",
  NDA_SIGNED: "green",
  MEETING_SCHEDULED: "teal",
  NEGOTIATING: "blue",
  CLOSED_WON: "green",
  CLOSED_LOST: "gray",
  // مسار أصحاب الفرص
  AWAITING_DOCS: "amber",
  PRELIM_ACCEPTED: "teal",
  REJECTED: "red",
  PREP_PROFILE: "blue",
  READY_TO_PUBLISH: "teal",
  PUBLISHED: "green",
  ARCHIVED: "gray",
  // مشترك
  SPAM: "red",
};

// مسار حالات المستثمرين/التواصل العام
const INVESTOR_FLOW = [
  "NEW",
  "UNDER_REVIEW",
  "CONTACTED",
  "AWAITING_REPLY",
  "NEEDS_INFO",
  "QUALIFIED",
  "NOT_QUALIFIED",
  "FILE_SENT",
  "NDA_SIGNED",
  "MEETING_SCHEDULED",
  "NEGOTIATING",
  "CLOSED_WON",
  "CLOSED_LOST",
];

// مسار حالات أصحاب الفرص
const OWNER_FLOW = [
  "NEW",
  "UNDER_REVIEW",
  "NEEDS_INFO",
  "AWAITING_DOCS",
  "PRELIM_ACCEPTED",
  "REJECTED",
  "PREP_PROFILE",
  "READY_TO_PUBLISH",
  "PUBLISHED",
  "ARCHIVED",
];

// الحالات المتاحة لنوع طلب معيّن (تظهر في قائمة تغيير الحالة)
export function statusesForType(leadType: LeadType): string[] {
  const base = leadType === "OPPORTUNITY_SUBMISSION" ? OWNER_FLOW : INVESTOR_FLOW;
  return [...base, "SPAM"];
}

export const ALL_STATUSES: string[] = Array.from(
  new Set([...INVESTOR_FLOW, ...OWNER_FLOW, "SPAM"])
);

export const PRIORITIES: LeadPriority[] = ["VERY_HIGH", "HIGH", "MEDIUM", "LOW"];
export const LEAD_TYPES: LeadType[] = [
  "INVESTOR_INTEREST",
  "OPPORTUNITY_SUBMISSION",
  "CONTACT",
  "HOME_QUICK",
];

const PRIORITY_TONE: Record<LeadPriority, string> = {
  VERY_HIGH: "red",
  HIGH: "amber",
  MEDIUM: "blue",
  LOW: "gray",
};

// ===== القيم الموحّدة (تُحفظ كأكواد؛ تُعرض حسب اللغة) =====
export const SENDER_ROLES = [
  "investor",
  "investment_company",
  "broker",
  "consultant",
  "government",
  "project_owner",
  "partner",
  "legal_rep",
  "other",
] as const;

export const PREFERRED_CONTACTS = ["whatsapp", "email", "phone", "online_meeting"] as const;

export const DEPARTMENTS = [
  "investor_relations",
  "opp_review",
  "legal",
  "finance",
  "content",
  "management",
] as const;

export const NOTE_TYPES = [
  "internal_note",
  "call_log",
  "whatsapp_log",
  "email_log",
  "meeting_log",
] as const;

export const FOLLOWUP_TYPES = [
  "call",
  "email",
  "whatsapp",
  "online_meeting",
  "document_request",
  "internal_review",
] as const;

// قطاعات المشروع لنموذج تقديم فرصة (§2 ثانياً)
export const PROJECT_SECTORS = [
  "industrial",
  "agricultural",
  "real_estate",
  "tourism",
  "energy",
  "logistics",
  "food",
  "tech",
  "other",
] as const;

// صفة مقدّم طلب الفرصة (مجموعة فرعية من SENDER_ROLES)
export const OWNER_SENDER_ROLES = [
  "project_owner",
  "partner",
  "legal_rep",
  "broker",
  "consultant",
] as const;

export const FEASIBILITY_OPTS = ["yes", "no", "in_progress"] as const;
export const LICENSING_OPTS = ["yes", "no", "partial"] as const;

// تثبيت قيمة واردة من نموذج إلى كود معروف (أو undefined إن لم تطابق)
export function normalizeCode<T extends readonly string[]>(
  allowed: T,
  value: string | null | undefined
): T[number] | undefined {
  if (!value) return undefined;
  return (allowed as readonly string[]).includes(value) ? (value as T[number]) : undefined;
}

// ===== الشارات (label + tone) =====
export function crmStatusBadge(locale: Locale, status: string) {
  return { label: tc(locale, `crmStatus.${status}`), tone: STATUS_TONE[status] ?? "gray" };
}

export function crmPriorityBadge(locale: Locale, priority: LeadPriority) {
  return { label: tc(locale, `crmPriority.${priority}`), tone: PRIORITY_TONE[priority] ?? "gray" };
}

export function leadTypeLabel(locale: Locale, leadType: LeadType): string {
  return tc(locale, `leadType.${leadType}`);
}

// ===== درجة الجدية (Lead Score) — حسب القسم 6 من المواصفات، بحد أقصى 100 =====
// دول مستهدفة (مثال أوّلي قابل للتوسعة من الإدارة لاحقاً)
const TARGET_COUNTRIES = new Set([
  "السعودية", "الإمارات", "قطر", "الكويت", "تركيا", "مصر",
  "Saudi Arabia", "UAE", "Qatar", "Kuwait", "Turkey", "Türkiye", "Egypt",
]);

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com",
  "live.com", "qq.com", "163.com", "yandex.com", "proton.me", "protonmail.com",
]);

function looksLikeMeetingRequest(message: string | null | undefined): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return /اجتماع|لقاء|مقابلة|meeting|call|zoom|görüşme|toplant|会议|会面/.test(m);
}

function isValidWhatsapp(value: string | null | undefined): boolean {
  if (!value) return false;
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function computeLeadScore(input: {
  investmentBudget?: string | null;
  companyName?: string | null;
  message?: string | null;
  relatedOpportunityId?: string | null;
  country?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  preferredContact?: string | null;
}): number {
  let score = 0;

  // ذكر حجم استثمار واضح: +20
  if (input.investmentBudget && input.investmentBudget.trim().length > 0) score += 20;
  // لديه شركة: +10
  if (input.companyName && input.companyName.trim().length > 1) score += 10;
  // رسالة واضحة: +10
  if (input.message && input.message.trim().length >= 20) score += 10;
  // اختار فرصة محددة: +20
  if (input.relatedOpportunityId) score += 20;
  // من دولة مستهدفة: +10
  if (input.country && TARGET_COUNTRIES.has(input.country.trim())) score += 10;
  // بريد رسمي باسم شركة (ليس بريداً مجانياً): +10
  if (input.email) {
    const domain = input.email.split("@")[1]?.toLowerCase().trim();
    if (domain && !FREE_EMAIL_DOMAINS.has(domain)) score += 10;
  }
  // رقم واتساب/هاتف صحيح: +10
  if (isValidWhatsapp(input.whatsapp) || isValidWhatsapp(input.phone)) score += 10;
  // طلب اجتماع (نصّاً أو تفضيلاً): +20
  if (input.preferredContact === "online_meeting" || looksLikeMeetingRequest(input.message)) {
    score += 20;
  }

  return Math.min(100, score);
}

// أهمية مقترحة من الدرجة (تُستخدم كقيمة ابتدائية)
export function priorityFromScore(score: number): LeadPriority {
  if (score >= 70) return "VERY_HIGH";
  if (score >= 45) return "HIGH";
  if (score >= 20) return "MEDIUM";
  return "LOW";
}

// رابط محادثة واتساب جاهز
export function whatsappLink(number: string, prefilled?: string): string {
  const digits = number.replace(/[^\d]/g, "");
  const base = `https://wa.me/${digits}`;
  return prefilled ? `${base}?text=${encodeURIComponent(prefilled)}` : base;
}
