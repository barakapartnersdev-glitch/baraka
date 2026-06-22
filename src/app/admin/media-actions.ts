"use server";
// إجراء رفع صورة عامة من لوحة الإدارة — يستخدمه مكوّن ImageUploadField.
// محمي بـ requireRole("ADMIN")؛ يعيد رابط العرض العام للصورة.
import { requireRole } from "@/lib/auth";
import { storePublicImage, type UploadResult } from "@/lib/public-media";

export async function uploadPublicImage(formData: FormData): Promise<UploadResult> {
  await requireRole("ADMIN");
  const file = formData.get("file");
  const folder = (formData.get("folder") as string) || "misc";
  if (!(file instanceof File)) return { ok: false, error: "لم يتم اختيار صورة." };
  return storePublicImage(file, folder);
}
