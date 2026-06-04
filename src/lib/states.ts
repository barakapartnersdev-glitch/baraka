// تعريفات حالات الفرص وطلبات الاهتمام — مرجع موحّد للواجهة (مع دعم لغتين).
// التسمية تأتي من القاموس حسب اللغة؛ اللون ثابت من الجداول أدناه.
import { t, type Locale } from "@/lib/i18n";

export const OPP_STATES: Record<string, { label: string; tone: string }> = {
  DRAFT_SOURCE:     { label: "مسودة مصدر",            tone: "gray" },
  SUBMITTED:        { label: "مُرسلة للإدارة",         tone: "blue" },
  UNDER_REVIEW:     { label: "قيد مراجعة الإدارة",     tone: "blue" },
  NEEDS_INFO:       { label: "بانتظار استكمال نواقص",  tone: "amber" },
  READY_TO_PUBLISH: { label: "جاهزة للنشر",            tone: "teal" },
  PUBLISHED:        { label: "منشورة",                 tone: "green" },
  PAUSED:           { label: "موقوفة مؤقتاً",          tone: "gray" },
  CLOSED:           { label: "مغلقة",                  tone: "gray" },
  ARCHIVED:         { label: "مؤرشفة",                 tone: "gray" },
};

export const INTEREST_STATES: Record<string, { label: string; tone: string }> = {
  REQUESTED:      { label: "طلب جديد",        tone: "blue" },
  ADMIN_APPROVED: { label: "معتمد للتوقيع",   tone: "teal" },
  NCNDA_SIGNED:   { label: "وقّع NCNDA",      tone: "green" },
  DECLINED:       { label: "مرفوض",           tone: "red" },
  WITHDRAWN:      { label: "مسحوب",           tone: "gray" },
};

export const TONE_CLASSES: Record<string, string> = {
  gray:  "bg-gray-100 text-gray-700",
  blue:  "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  teal:  "bg-teal-50 text-teal-700",
  green: "bg-green-50 text-green-700",
  red:   "bg-red-50 text-red-700",
};

const ACCT_TONES: Record<string, string> = {
  PENDING_EMAIL: "gray",
  PENDING_REVIEW: "amber",
  ACTIVE: "green",
  SUSPENDED: "red",
};

// شارات ثنائية اللغة: التسمية من القاموس، واللون من الجداول أعلاه.
export function oppBadge(locale: Locale, state: string) {
  return { label: t(locale, `oppState.${state}`), tone: OPP_STATES[state]?.tone ?? "gray" };
}

export function interestBadge(locale: Locale, status: string) {
  return {
    label: t(locale, `interestStatus.${status}`),
    tone: INTEREST_STATES[status]?.tone ?? "gray",
  };
}

export function acctBadge(locale: Locale, status: string) {
  return { label: t(locale, `acct.${status}`), tone: ACCT_TONES[status] ?? "gray" };
}
