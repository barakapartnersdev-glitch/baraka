"use server";
// بوّابة السفير: رفع ملف إلى «ملفاتي».
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { storeAmbassadorUpload } from "@/lib/ambassador-files";

export interface FileState {
  ok?: boolean;
  error?: string;
}

export async function uploadMyFile(_prev: FileState, formData: FormData): Promise<FileState> {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: ta(locale, "err.fileType") };

  const res = await storeAmbassadorUpload(file, {
    ambassadorUserId: session.userId,
    uploadedById: session.userId,
    category: "ambassador_upload",
    visibility: "shared",
  });
  if (!res.ok) return { error: ta(locale, res.error === "size" ? "err.fileSize" : "err.fileType") };

  revalidatePath("/ambassador/files");
  return { ok: true };
}
