// نواة مرفقات الـ CRM — تحقّق + تخزين (S3 أو محلي) + سجل CrmFile.
// تُستخدم من نواة الإرسال (submitLead) ومن لوحة الإدارة. الصلاحيات في المستدعي.
import "server-only";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { putObject, deleteObject } from "@/lib/storage";
import { t, type Locale } from "@/lib/i18n";

export const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB للملف
export const MAX_FILES = 5; // حد أقصى للملفات في الإرسال الواحد

// PDF / Word / Excel / صور (يطابق متطلّب نموذج تقديم الفرصة §2-ثانياً)
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/msword", // doc
  "application/vnd.ms-excel", // xls
]);

export interface CrmFileResult {
  ok: boolean;
  error?: string;
  fileId?: string;
}

function isUploadFile(v: unknown): v is File {
  return typeof File !== "undefined" && v instanceof File && v.size > 0;
}

// تخزين ملف واحد على طلب CRM. يعيد خطأً عند تجاوز الحجم أو نوع غير مسموح.
export async function storeCrmLeadFile(
  leadId: string,
  file: File,
  locale: Locale,
  uploadedById?: string | null
): Promise<CrmFileResult> {
  if (!isUploadFile(file)) return { ok: false, error: t(locale, "err.noFile") };
  if (file.size > MAX_FILE_BYTES) return { ok: false, error: t(locale, "err.fileTooLarge") };
  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: t(locale, "err.fileTypeNotAllowed") };
  }

  const safeName = file.name.replace(/[^\w.\-؀-ۿ ]/g, "_").slice(0, 120) || "file";
  const key = `crm-leads/${leadId}/${randomUUID()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await putObject(key, buffer, file.type || "application/octet-stream");

  const record = await prisma.crmFile.create({
    data: {
      leadId,
      fileName: safeName,
      storageKey: key,
      fileType: file.type || null,
      fileSize: file.size,
      visibility: "admin_only",
      uploadedById: uploadedById ?? null,
    },
    select: { id: true },
  });

  return { ok: true, fileId: record.id };
}

// معالجة عدّة ملفات قادمة من نموذج عام — أفضل جهد: تجاهل غير الصالح، لا ترمِ للأعلى.
export async function processLeadFiles(
  leadId: string,
  files: File[],
  locale: Locale
): Promise<number> {
  let stored = 0;
  for (const file of files.slice(0, MAX_FILES)) {
    try {
      const r = await storeCrmLeadFile(leadId, file, locale);
      if (r.ok) stored++;
    } catch (e) {
      console.error("[crm-files] تعذّر تخزين ملف:", e);
    }
  }
  return stored;
}

// حذف ملف (من التخزين وقاعدة البيانات)
export async function removeCrmFile(fileId: string): Promise<void> {
  const f = await prisma.crmFile.findUnique({
    where: { id: fileId },
    select: { storageKey: true },
  });
  if (!f) return;
  try {
    await deleteObject(f.storageKey);
  } catch (e) {
    console.error("[crm-files] تعذّر حذف الكائن من التخزين:", e);
  }
  await prisma.crmFile.delete({ where: { id: fileId } });
}
