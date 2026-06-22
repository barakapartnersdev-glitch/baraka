// قواعد انتقالات حالة الفرصة — مرجع موحّد يُفرض على الخادم.
// لا يُسمح إلا بالانتقالات المنطقية ضمن رحلة الحوكمة.
import type { OpportunityState } from "@prisma/client";

// الانتقالات المسموحة للإدارة من كل حالة.
// ملاحظة: DRAFT_SOURCE → SUBMITTED بيد صاحب المشروع لا الإدارة.
export const ADMIN_TRANSITIONS: Record<OpportunityState, OpportunityState[]> = {
  DRAFT_SOURCE: [],
  SUBMITTED: ["UNDER_REVIEW", "NEEDS_INFO"],
  UNDER_REVIEW: ["NEEDS_INFO", "READY_TO_PUBLISH"],
  NEEDS_INFO: ["UNDER_REVIEW"],
  READY_TO_PUBLISH: ["PUBLISHED", "UNDER_REVIEW"],
  PUBLISHED: ["PAUSED", "CLOSED"],
  PAUSED: ["PUBLISHED", "CLOSED"],
  CLOSED: ["ARCHIVED"],
  ARCHIVED: [],
};

export function canTransition(
  from: OpportunityState,
  to: OpportunityState
): boolean {
  return ADMIN_TRANSITIONS[from]?.includes(to) ?? false;
}

// ===== انتقالات صاحب المشروع =====
// المالك يرسل المسودة أو يعيد إرسالها بعد استكمال النواقص فقط.
export const OWNER_TRANSITIONS: Record<OpportunityState, OpportunityState[]> = {
  DRAFT_SOURCE: ["SUBMITTED"],
  SUBMITTED: [],
  UNDER_REVIEW: [],
  NEEDS_INFO: ["SUBMITTED"],
  READY_TO_PUBLISH: [],
  PUBLISHED: [],
  PAUSED: [],
  CLOSED: [],
  ARCHIVED: [],
};

// التحرير مسموح للمالك في المسودة وعند طلب نواقص فقط.
export function ownerCanEdit(state: OpportunityState): boolean {
  return state === "DRAFT_SOURCE" || state === "NEEDS_INFO";
}

export function ownerCanSubmit(state: OpportunityState): boolean {
  return (OWNER_TRANSITIONS[state] ?? []).includes("SUBMITTED");
}

// ===== بيانات المصدر (يُدخلها صاحب المشروع — لا تُنشر كما هي أبداً) =====
export interface SourceData {
  summary?: string;
  useOfFunds?: string;
  financials?: string;
  ownerContact?: string; // سرّي — للإدارة فقط
  exactLocation?: string; // سرّي — لا يُكشف إلا بقرار إداري
}

export const SOURCE_FIELDS: {
  key: keyof SourceData;
  label: string;
  textarea: boolean;
  sensitive: boolean;
}[] = [
  { key: "summary", label: "وصف المشروع", textarea: true, sensitive: false },
  {
    key: "useOfFunds",
    label: "أوجه استخدام التمويل",
    textarea: true,
    sensitive: false,
  },
  { key: "financials", label: "لمحة مالية", textarea: true, sensitive: false },
  {
    key: "ownerContact",
    label: "بيانات تواصلك (سرّية — للإدارة فقط)",
    textarea: false,
    sensitive: true,
  },
  {
    key: "exactLocation",
    label: "الموقع الدقيق (سرّي — لا يُنشر)",
    textarea: false,
    sensitive: true,
  },
];

// ===== صياغة النسخ الثلاث =====
export type VersionKey =
  | "publicVersion"
  | "investorVersion"
  | "postNcndaVersion";

export interface VersionData {
  displayTitle?: string;
  summary?: string;
  highlights?: string;
  details?: string;
  paybackPeriod?: string; // فترة الاسترداد المتوقعة لرأس المال
  annualReturn?: string; // العائد السنوي المتوقع
  imageUrl?: string; // غلاف اختياري تضبطه الإدارة (يجب ألا يكشف الهوية أو الموقع)
  gallery?: string[]; // صور معبّرة إضافية (محايدة لغوياً) — تُعرض في صفحة الفرصة؛ يجب ألا تكشف الهوية أو الموقع الدقيق
}

export const VERSION_KEYS: VersionKey[] = [
  "publicVersion",
  "investorVersion",
  "postNcndaVersion",
];

export const VERSION_FIELDS: {
  key: keyof VersionData;
  label: string;
  textarea: boolean;
}[] = [
  { key: "displayTitle", label: "عنوان العرض", textarea: false },
  { key: "summary", label: "ملخّص", textarea: true },
  { key: "highlights", label: "أبرز النقاط", textarea: true },
  { key: "details", label: "تفاصيل إضافية", textarea: true },
];

// تحويل آمن لقيمة JSON إلى VersionData
export function toVersion(value: unknown): VersionData | null {
  return value && typeof value === "object"
    ? (value as VersionData)
    : null;
}

export const VERSION_META: Record<VersionKey, { title: string; note: string }> =
  {
    publicVersion: {
      title: "النسخة العامة",
      note: "للزائر — ممنوع تضمين أي بيانات تعريف لصاحب المشروع أو موقعه الدقيق",
    },
    investorVersion: {
      title: "نسخة المستثمر",
      note: "للمستثمر المسجّل قبل توقيع NCNDA",
    },
    postNcndaVersion: {
      title: "نسخة ما بعد NCNDA",
      note: "للمعتمد بعد التوقيع — تبقى الهوية والموقع الدقيق مخفيين ما لم يصدر قرار إداري",
    },
  };
