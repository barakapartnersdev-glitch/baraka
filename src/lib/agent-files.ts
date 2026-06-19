// تخزين ملفات وكلاء أصحاب الأصول — التحقّق + التخزين (S3/محلي) + سجل AssetAgentFile.
// كل ملف مرتبط بطلب (applicationId مطلوب)، واختياراً بأصل مقدّم (submittedAssetId).
import "server-only";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { putObject } from "@/lib/storage";

export const AGENT_MAX_BYTES = 10 * 1024 * 1024; // 10MB

export const AGENT_ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]);

export type UploadError = "type" | "size" | "empty";

export function validateAgentUpload(file: File): { ok: boolean; error?: UploadError } {
  if (!file || file.size === 0) return { ok: false, error: "empty" };
  if (file.size > AGENT_MAX_BYTES) return { ok: false, error: "size" };
  if (file.type && !AGENT_ALLOWED_TYPES.has(file.type)) return { ok: false, error: "type" };
  return { ok: true };
}

export interface StoreOpts {
  applicationId: string;
  submittedAssetId?: string | null;
  agentUserId?: string | null;
  category?: string | null;
  visibility?: string;
}

export interface StoreResult {
  ok: boolean;
  error?: UploadError;
  storageKey?: string;
  fileId?: string;
}

export async function storeAgentUpload(file: File, opts: StoreOpts): Promise<StoreResult> {
  const v = validateAgentUpload(file);
  if (!v.ok) return v;

  const safeName = file.name.replace(/[^\w.\-؀-ۿ ]/g, "_").slice(0, 120);
  const scope = opts.submittedAssetId ?? opts.applicationId;
  const key = `asset-agents/${scope}/${randomUUID()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await putObject(key, buffer, file.type || "application/octet-stream");

  const rec = await prisma.assetAgentFile.create({
    data: {
      applicationId: opts.applicationId,
      submittedAssetId: opts.submittedAssetId ?? null,
      agentUserId: opts.agentUserId ?? null,
      fileName: safeName,
      storageKey: key,
      fileType: file.type || null,
      fileSize: file.size,
      fileCategory: opts.category ?? null,
      visibility: opts.visibility ?? "admin_only",
    },
    select: { id: true },
  });

  return { ok: true, storageKey: key, fileId: rec.id };
}
