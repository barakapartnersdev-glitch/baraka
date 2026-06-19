"use server";
// رفع/حذف مرفقات طلب الـ CRM من لوحة الإدارة — محميّة بدور ADMIN وتُسجَّل في النشاط.
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { storeCrmLeadFile, removeCrmFile } from "@/lib/crm-files";

export async function uploadLeadFile(formData: FormData): Promise<void> {
  const session = await requireRole("ADMIN");
  const locale = await getLocale();
  const leadId = String(formData.get("leadId") ?? "");
  const file = formData.get("file");

  if (!leadId || !(file instanceof File) || file.size === 0) return;
  const lead = await prisma.crmLead.findUnique({ where: { id: leadId }, select: { id: true } });
  if (!lead) return;

  const r = await storeCrmLeadFile(leadId, file, locale, session.userId);
  if (r.ok) {
    try {
      await prisma.crmActivityLog.create({
        data: { leadId, actorId: session.userId, actionType: "file_upload", description: file.name },
      });
    } catch {
      /* أفضل جهد */
    }
  }
  revalidatePath(`/admin/crm/${leadId}`);
}

export async function deleteLeadFile(formData: FormData): Promise<void> {
  const session = await requireRole("ADMIN");
  const fileId = String(formData.get("fileId") ?? "");
  if (!fileId) return;

  const f = await prisma.crmFile.findUnique({ where: { id: fileId }, select: { leadId: true } });
  if (!f) return;

  await removeCrmFile(fileId);
  try {
    await prisma.crmActivityLog.create({
      data: { leadId: f.leadId, actorId: session.userId, actionType: "file_deleted" },
    });
  } catch {
    /* أفضل جهد */
  }
  revalidatePath(`/admin/crm/${f.leadId}`);
}
