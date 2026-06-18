"use server";
// إجراءات إدارة الطلبات داخل الـ CRM — تغيير الحالة/الأهمية/الإسناد، الملاحظات،
// القراءة، وتعليم السبام. كلّها محميّة بدور ADMIN وتُسجَّل في CrmActivityLog.
import { revalidatePath } from "next/cache";
import type { LeadPriority } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notify } from "@/lib/notify";
import {
  ALL_STATUSES,
  PRIORITIES,
  DEPARTMENTS,
  NOTE_TYPES,
  FOLLOWUP_TYPES,
  normalizeCode,
} from "@/lib/crm";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

async function logCrm(
  leadId: string,
  actorId: string,
  actionType: string,
  extra?: { oldValue?: string | null; newValue?: string | null; description?: string }
): Promise<void> {
  try {
    await prisma.crmActivityLog.create({
      data: {
        leadId,
        actorId,
        actionType,
        oldValue: extra?.oldValue ?? null,
        newValue: extra?.newValue ?? null,
        description: extra?.description ?? null,
      },
    });
  } catch (e) {
    console.error("[crm] تعذّر تسجيل النشاط:", e);
  }
}

function refresh(leadId: string) {
  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/${leadId}`);
}

export async function setLeadStatus(leadId: string, status: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  if (!ALL_STATUSES.includes(status)) return { ok: false, error: "حالة غير صالحة." };
  const lead = await prisma.crmLead.findUnique({ where: { id: leadId }, select: { status: true } });
  if (!lead) return { ok: false, error: "الطلب غير موجود." };
  if (lead.status === status) return { ok: true };

  await prisma.crmLead.update({ where: { id: leadId }, data: { status } });
  await logCrm(leadId, session.userId, "status_change", { oldValue: lead.status, newValue: status });
  refresh(leadId);
  return { ok: true };
}

export async function setLeadPriority(leadId: string, priority: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  if (!PRIORITIES.includes(priority as LeadPriority)) return { ok: false, error: "قيمة غير صالحة." };
  const lead = await prisma.crmLead.findUnique({ where: { id: leadId }, select: { priority: true } });
  if (!lead) return { ok: false, error: "الطلب غير موجود." };
  if (lead.priority === priority) return { ok: true };

  await prisma.crmLead.update({ where: { id: leadId }, data: { priority: priority as LeadPriority } });
  await logCrm(leadId, session.userId, "priority_change", { oldValue: lead.priority, newValue: priority });
  refresh(leadId);
  return { ok: true };
}

export async function assignLead(
  leadId: string,
  assigneeId: string | null,
  department: string | null
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const lead = await prisma.crmLead.findUnique({
    where: { id: leadId },
    select: { assignedToId: true },
  });
  if (!lead) return { ok: false, error: "الطلب غير موجود." };

  // تثبيت القسم والموظف
  const dept = department ? (normalizeCode(DEPARTMENTS, department) ?? null) : null;
  let validAssignee: string | null = null;
  if (assigneeId) {
    const u = await prisma.user.findFirst({
      where: { id: assigneeId, role: "ADMIN" },
      select: { id: true },
    });
    if (!u) return { ok: false, error: "الموظف غير موجود." };
    validAssignee = u.id;
  }

  await prisma.crmLead.update({
    where: { id: leadId },
    data: {
      assignedToId: validAssignee,
      department: dept,
      assignedById: validAssignee ? session.userId : null,
      assignedAt: validAssignee ? new Date() : null,
    },
  });
  await logCrm(leadId, session.userId, validAssignee ? "assigned" : "unassigned", {
    newValue: validAssignee,
    description: dept ?? undefined,
  });

  // إشعار الموظف المُسنَد إليه (إن تغيّر)
  if (validAssignee && validAssignee !== lead.assignedToId && validAssignee !== session.userId) {
    await notify({
      userId: validAssignee,
      type: "CRM_LEAD_ASSIGNED",
      message: "أُسند إليك طلب جديد في إدارة العلاقات (CRM).",
      link: `/admin/crm/${leadId}`,
    });
  }
  refresh(leadId);
  return { ok: true };
}

export async function addLeadNote(
  leadId: string,
  note: string,
  noteType: string
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const text = note.trim();
  if (text.length < 2) return { ok: false, error: "اكتب نص الملاحظة." };
  const type = normalizeCode(NOTE_TYPES, noteType) ?? "internal_note";

  const lead = await prisma.crmLead.findUnique({ where: { id: leadId }, select: { id: true } });
  if (!lead) return { ok: false, error: "الطلب غير موجود." };

  await prisma.crmNote.create({
    data: { leadId, authorId: session.userId, note: text, noteType: type },
  });
  // تسجيل آخر متابعة لأنواع التواصل
  if (["call_log", "whatsapp_log", "email_log", "meeting_log"].includes(type)) {
    await prisma.crmLead.update({ where: { id: leadId }, data: { lastFollowupAt: new Date() } });
  }
  await logCrm(leadId, session.userId, "note_added", { description: type });
  refresh(leadId);
  return { ok: true };
}

export async function markLeadRead(leadId: string, read: boolean): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const lead = await prisma.crmLead.findUnique({ where: { id: leadId }, select: { isRead: true } });
  if (!lead) return { ok: false, error: "الطلب غير موجود." };
  if (lead.isRead === read) return { ok: true };

  await prisma.crmLead.update({ where: { id: leadId }, data: { isRead: read } });
  if (read) await logCrm(leadId, session.userId, "read");
  refresh(leadId);
  return { ok: true };
}

export async function scheduleFollowup(
  leadId: string,
  followupAtISO: string,
  followupType: string,
  notes: string
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const when = new Date(followupAtISO);
  if (isNaN(when.getTime())) return { ok: false, error: "تاريخ غير صالح." };
  const type = normalizeCode(FOLLOWUP_TYPES, followupType) ?? "call";

  const lead = await prisma.crmLead.findUnique({
    where: { id: leadId },
    select: { assignedToId: true },
  });
  if (!lead) return { ok: false, error: "الطلب غير موجود." };

  await prisma.crmFollowup.create({
    data: {
      leadId,
      assignedToId: lead.assignedToId ?? session.userId,
      followupAt: when,
      followupType: type,
      notes: notes.trim() || null,
    },
  });
  await logCrm(leadId, session.userId, "followup_scheduled", { description: type });
  refresh(leadId);
  revalidatePath("/admin/crm/followups");
  return { ok: true };
}

export async function markFollowupDone(followupId: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const f = await prisma.crmFollowup.findUnique({
    where: { id: followupId },
    select: { leadId: true, status: true },
  });
  if (!f) return { ok: false, error: "المتابعة غير موجودة." };
  if (f.status !== "done") {
    await prisma.crmFollowup.update({ where: { id: followupId }, data: { status: "done" } });
    await prisma.crmLead.update({ where: { id: f.leadId }, data: { lastFollowupAt: new Date() } });
    await logCrm(f.leadId, session.userId, "followup_done");
  }
  refresh(f.leadId);
  revalidatePath("/admin/crm/followups");
  return { ok: true };
}

export async function toggleSpam(leadId: string, spam: boolean): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const lead = await prisma.crmLead.findUnique({ where: { id: leadId }, select: { isSpam: true } });
  if (!lead) return { ok: false, error: "الطلب غير موجود." };

  await prisma.crmLead.update({
    where: { id: leadId },
    data: { isSpam: spam, status: spam ? "SPAM" : "NEW" },
  });
  await logCrm(leadId, session.userId, spam ? "spam_on" : "spam_off");
  refresh(leadId);
  return { ok: true };
}
