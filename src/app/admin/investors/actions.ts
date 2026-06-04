"use server";
// إجراءات الإدارة على حسابات المستخدمين — محمية بـ requireRole("ADMIN") ومسجَّلة.
// الإدارة تعتمد الحساب (ACTIVE) أو توقفه (SUSPENDED) فقط، وتُشعِر صاحبه.
import { revalidatePath } from "next/cache";
import type { AccountStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/audit";
import { notify } from "@/lib/notify";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function setUserStatus(
  userId: string,
  status: AccountStatus
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const locale = await getLocale();

  // الإدارة تعتمد أو توقف فقط (لا تُرجِع الحساب يدويّاً إلى "بانتظار")
  if (status !== "ACTIVE" && status !== "SUSPENDED") {
    return { ok: false, error: t(locale, "err.statusNotAllowed") };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, accountStatus: true },
  });
  if (!user) return { ok: false, error: t(locale, "err.userNotFound") };
  if (user.role === "ADMIN") {
    return { ok: false, error: t(locale, "err.cannotEditAdmin") };
  }
  if (user.accountStatus === status) {
    return { ok: false, error: t(locale, "err.alreadyInStatus") };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { accountStatus: status },
  });

  const wasSuspended = user.accountStatus === "SUSPENDED";
  const action =
    status === "ACTIVE"
      ? wasSuspended
        ? "USER_REACTIVATED"
        : "USER_APPROVED"
      : "USER_SUSPENDED";

  await logActivity({
    actorId: session.userId,
    action,
    entityType: "User",
    entityId: userId,
    details: { from: user.accountStatus, to: status },
  });

  // إشعار صاحب الحساب بالقرار، مع رابط بوابته حسب دوره
  const home = user.role === "PROJECT_OWNER" ? "/owner" : "/investor";
  await notify({
    userId,
    type: status === "ACTIVE" ? "ACCOUNT_APPROVED" : "ACCOUNT_SUSPENDED",
    message:
      status === "ACTIVE"
        ? wasSuspended
          ? "تمت إعادة تفعيل حسابك."
          : "تم اعتماد حسابك. يمكنك الآن الاطّلاع على التفاصيل وتسجيل اهتمامك بالفرص."
        : "تم إيقاف حسابك. تواصل مع الإدارة.",
    link: home,
  });

  revalidatePath("/admin/investors");
  revalidatePath("/admin");
  return { ok: true };
}
