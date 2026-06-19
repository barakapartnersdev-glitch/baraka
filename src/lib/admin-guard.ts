// حُرّاس صلاحيات الإدارة (خادم فقط). يبني فوق requireRole("ADMIN") طبقة قدرات دقيقة.
import "server-only";
import { redirect } from "next/navigation";
import type { AdminRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole, type SessionUser } from "@/lib/auth";
import { roleHasCapability, type Capability } from "@/lib/admin-roles";

// الدور الفرعي للأدمن من القاعدة؛ null → SUPER_ADMIN (توافق رجعي).
// قبل تطبيق هجرة adminRole (عمود غير موجود) يُعامَل الجميع كـ SUPER_ADMIN كي لا تتعطّل الإدارة.
export async function getAdminRole(userId: string): Promise<AdminRole> {
  try {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { adminRole: true } });
    return u?.adminRole ?? "SUPER_ADMIN";
  } catch {
    return "SUPER_ADMIN";
  }
}

// لصفحات الخادم: يتحقق من الدور ثم القدرة، ويعيد التوجيه عند المنع.
export async function requirePageCapability(cap: Capability): Promise<SessionUser> {
  const session = await requireRole("ADMIN");
  const role = await getAdminRole(session.userId);
  if (!roleHasCapability(role, cap)) redirect("/admin?denied=1");
  return session;
}

export interface CapGuard {
  ok: boolean;
  error?: string;
  session?: SessionUser;
  role?: AdminRole;
}

// لإجراءات الخادم: يعيد نتيجة قابلة للإرجاع كـ ActionResult عند المنع.
export async function requireActionCapability(cap: Capability): Promise<CapGuard> {
  const session = await requireRole("ADMIN");
  const role = await getAdminRole(session.userId);
  if (!roleHasCapability(role, cap)) {
    return { ok: false, error: "ليس لديك صلاحية لتنفيذ هذا الإجراء." };
  }
  return { ok: true, session, role };
}
