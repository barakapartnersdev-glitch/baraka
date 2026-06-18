"use server";
// إجراءات إدارة طلبات سفراء الاستثمار — الحالة، التقييم، الإسناد، الملاحظات الداخلية.
// محميّة بدور ADMIN وتُسجَّل في AmbassadorActivityLog.
import { revalidatePath } from "next/cache";
import type { AmbassadorAppStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notify } from "@/lib/notify";
import { ALL_AMB_STATUSES } from "@/lib/ambassador-form";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

async function logAmb(
  applicationId: string,
  actorId: string,
  actionType: string,
  extra?: { oldValue?: string | null; newValue?: string | null; description?: string }
): Promise<void> {
  try {
    await prisma.ambassadorActivityLog.create({
      data: {
        relatedEntityType: "Application",
        relatedEntityId: applicationId,
        actionType,
        oldValue: extra?.oldValue ?? null,
        newValue: extra?.newValue ?? null,
        description: extra?.description ?? null,
        createdById: actorId,
      },
    });
  } catch (e) {
    console.error("[ambassadors] تعذّر تسجيل النشاط:", e);
  }
}

function refresh(id: string) {
  revalidatePath("/admin/ambassadors");
  revalidatePath(`/admin/ambassadors/${id}`);
}

export async function setAmbassadorStatus(id: string, status: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  if (!ALL_AMB_STATUSES.includes(status as AmbassadorAppStatus)) {
    return { ok: false, error: "حالة غير صالحة." };
  }
  const app = await prisma.ambassadorApplication.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!app) return { ok: false, error: "الطلب غير موجود." };
  if (app.status === status) return { ok: true };

  await prisma.ambassadorApplication.update({
    where: { id },
    data: { status: status as AmbassadorAppStatus },
  });
  await logAmb(id, session.userId, "status_change", { oldValue: app.status, newValue: status });
  refresh(id);
  return { ok: true };
}

export async function setAmbassadorScore(id: string, score: number): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const clamped = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const app = await prisma.ambassadorApplication.findUnique({
    where: { id },
    select: { score: true },
  });
  if (!app) return { ok: false, error: "الطلب غير موجود." };
  if (app.score === clamped) return { ok: true };

  await prisma.ambassadorApplication.update({ where: { id }, data: { score: clamped } });
  await logAmb(id, session.userId, "score_change", {
    oldValue: String(app.score),
    newValue: String(clamped),
  });
  refresh(id);
  return { ok: true };
}

export async function assignAmbassador(id: string, assigneeId: string | null): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const app = await prisma.ambassadorApplication.findUnique({
    where: { id },
    select: { assignedToId: true },
  });
  if (!app) return { ok: false, error: "الطلب غير موجود." };

  let valid: string | null = null;
  if (assigneeId) {
    const u = await prisma.user.findFirst({
      where: { id: assigneeId, role: "ADMIN" },
      select: { id: true },
    });
    if (!u) return { ok: false, error: "الموظف غير موجود." };
    valid = u.id;
  }

  await prisma.ambassadorApplication.update({ where: { id }, data: { assignedToId: valid } });
  await logAmb(id, session.userId, valid ? "assigned" : "unassigned", { newValue: valid });

  if (valid && valid !== app.assignedToId && valid !== session.userId) {
    await notify({
      userId: valid,
      type: "CRM_LEAD_ASSIGNED",
      message: "أُسند إليك طلب سفير استثمار للمراجعة.",
      link: `/admin/ambassadors/${id}`,
    });
  }
  refresh(id);
  return { ok: true };
}

export async function addAmbassadorNote(id: string, note: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const text = note.trim();
  if (text.length < 2) return { ok: false, error: "اكتب نص الملاحظة." };

  const app = await prisma.ambassadorApplication.findUnique({ where: { id }, select: { id: true } });
  if (!app) return { ok: false, error: "الطلب غير موجود." };

  await logAmb(id, session.userId, "note", { description: text });
  refresh(id);
  return { ok: true };
}
