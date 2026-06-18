// منطق ملفات سفراء الاستثمار — التحقّق والتخزين. الصلاحيات في مسار التقديم والإجراءات.
// يُبنى على طبقة التخزين (S3/محلي) مثل lib/files.ts، مع حدّ 10MB والأنواع المسموحة بالمواصفات.
import "server-only";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { putObject } from "@/lib/storage";

export const AMB_MAX_BYTES = 10 * 1024 * 1024; // 10MB لكل ملف

export const AMB_ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword", // doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "image/jpeg",
  "image/png",
]);

export type UploadError = "type" | "size" | "empty";

export interface StoreResult {
  ok: boolean;
  error?: UploadError;
  storageKey?: string;
  fileId?: string;
}

// تحقّق سريع من نوع/حجم الملف قبل أي تخزين
export function validateUpload(file: File): { ok: boolean; error?: UploadError } {
  if (!file || file.size === 0) return { ok: false, error: "empty" };
  if (file.size > AMB_MAX_BYTES) return { ok: false, error: "size" };
  if (file.type && !AMB_ALLOWED_TYPES.has(file.type)) return { ok: false, error: "type" };
  return { ok: true };
}

export interface StoreOpts {
  applicationId?: string | null;
  ambassadorUserId?: string | null;
  referralId?: string | null;
  messageId?: string | null;
  category?: string | null;
  uploadedById?: string | null;
  visibility?: string;
}

// تخزين ملف مرفوع وإنشاء سجل AmbassadorFile مرتبط بالكيان المناسب
export async function storeAmbassadorUpload(file: File, opts: StoreOpts): Promise<StoreResult> {
  const v = validateUpload(file);
  if (!v.ok) return v;

  const safeName = file.name.replace(/[^\w.\-؀-ۿ ]/g, "_").slice(0, 120);
  const scope = opts.applicationId ?? opts.ambassadorUserId ?? opts.referralId ?? "misc";
  const key = `ambassadors/${scope}/${randomUUID()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await putObject(key, buffer, file.type || "application/octet-stream");

  const rec = await prisma.ambassadorFile.create({
    data: {
      applicationId: opts.applicationId ?? null,
      ambassadorUserId: opts.ambassadorUserId ?? null,
      referralId: opts.referralId ?? null,
      messageId: opts.messageId ?? null,
      fileName: safeName,
      storageKey: key,
      fileType: file.type || null,
      fileSize: file.size,
      fileCategory: opts.category ?? null,
      visibility: opts.visibility ?? "admin_only",
      uploadedById: opts.uploadedById ?? null,
    },
    select: { id: true },
  });

  return { ok: true, storageKey: key, fileId: rec.id };
}
