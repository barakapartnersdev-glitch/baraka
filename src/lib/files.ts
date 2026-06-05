// منطق ملفات الفرص — التحقق والتخزين والحذف. الصلاحيات والتدقيق في الإجراءات.
import "server-only";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { putObject, deleteObject } from "@/lib/storage";
import { t, type Locale } from "@/lib/i18n";

const MAX_BYTES = 50 * 1024 * 1024; // 50MB (يشمل مقاطع فيديو قصيرة)
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/msword",
  "application/vnd.ms-excel",
  // فيديو (مقاطع قصيرة لعرض المشروع)
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

export interface FileResult {
  ok: boolean;
  error?: string;
  fileId?: string;
}

// تخزين ملف مرفوع لفرصة. الرؤية الافتراضية ADMIN_ONLY غير معتمد.
export async function storeFile(
  opportunityId: string,
  file: File,
  locale: Locale
): Promise<FileResult> {
  if (!file || file.size === 0) return { ok: false, error: t(locale, "err.noFile") };
  if (file.size > MAX_BYTES) {
    return { ok: false, error: t(locale, "err.fileTooLarge") };
  }
  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: t(locale, "err.fileTypeNotAllowed") };
  }

  const safeName = file.name.replace(/[^\w.\-؀-ۿ ]/g, "_").slice(0, 120);
  const key = `opportunities/${opportunityId}/${randomUUID()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await putObject(key, buffer, file.type || "application/octet-stream");

  const record = await prisma.opportunityFile.create({
    data: {
      opportunityId,
      fileName: safeName,
      storageKey: key,
      visibility: "ADMIN_ONLY",
      approved: false,
    },
  });

  return { ok: true, fileId: record.id };
}

// حذف ملف من التخزين وقاعدة البيانات
export async function removeFile(storageKey: string, fileId: string): Promise<void> {
  await deleteObject(storageKey);
  await prisma.opportunityFile.delete({ where: { id: fileId } });
}
