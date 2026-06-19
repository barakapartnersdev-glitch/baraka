// نموذج صلاحيات الإدارة الفرعية (نقي — قابل للاستيراد في الواجهة والخادم).
// يربط كل AdminRole بمجموعة قدرات (capabilities). null يُعامَل كـ SUPER_ADMIN في الخادم.
import type { AdminRole } from "@prisma/client";

export type Capability =
  | "view" // اطّلاع على قسم السفراء
  | "review" // مراجعة الطلبات: حالة/ملاحظة/تقييم/إسناد
  | "account" // فتح حساب السفير
  | "contract" // العقود والتوقيع الإلكتروني
  | "referrals" // إدارة الترشيحات
  | "messages" // الرد على الرسائل الداخلية
  | "templates" // تحرير قوالب البريد
  | "reports" // التقارير
  | "staff"; // إدارة صلاحيات الموظفين

export const ADMIN_ROLES: AdminRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "AMBASSADOR_MANAGER",
  "LEGAL_MANAGER",
  "STAFF",
];

const CAPS: Record<AdminRole, Capability[]> = {
  SUPER_ADMIN: ["view", "review", "account", "contract", "referrals", "messages", "templates", "reports", "staff"],
  ADMIN: ["view", "review", "referrals", "messages", "reports"],
  AMBASSADOR_MANAGER: ["view", "review", "referrals", "messages", "reports"],
  LEGAL_MANAGER: ["view", "contract", "reports"],
  STAFF: ["view"],
};

export function roleHasCapability(role: AdminRole, cap: Capability): boolean {
  return CAPS[role]?.includes(cap) ?? false;
}

export function capabilitiesFor(role: AdminRole): Capability[] {
  return CAPS[role] ?? [];
}
