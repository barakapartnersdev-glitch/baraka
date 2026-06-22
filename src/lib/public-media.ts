// رفع وعرض الصور العامة (أغلفة الفرص وصور هيرو الدول).
// تُخزَّن عبر طبقة التخزين (S3/B2 أو محلي) تحت بادئة public-media/ وتُخدَم بلا مصادقة
// عبر /api/media/<key> لأنها صور تسويقية محايدة لا تكشف بيانات حسّاسة.
import "server-only";
import { randomUUID } from "crypto";
import { putObject } from "@/lib/storage";

export const PUBLIC_MEDIA_PREFIX = "public-media";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

// الأنواع المسموحة → الامتداد
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export interface UploadResult {
  ok: boolean;
  url?: string;
  key?: string;
  error?: string;
}

// يرفع صورة ويعيد رابط العرض العام. `folder` لتنظيم المفاتيح (opportunities / destinations).
export async function storePublicImage(
  file: File,
  folder: string
): Promise<UploadResult> {
  if (!file || file.size === 0) return { ok: false, error: "لم يتم اختيار صورة." };
  if (file.size > MAX_BYTES) return { ok: false, error: "حجم الصورة يتجاوز 8 ميجابايت." };

  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return { ok: false, error: "نوع الصورة غير مدعوم (المسموح: JPG, PNG, WEBP, GIF)." };
  }

  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "") || "misc";
  const key = `${PUBLIC_MEDIA_PREFIX}/${safeFolder}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await putObject(key, buffer, file.type);
  } catch (e) {
    console.error("[public-media] upload failed:", e);
    return { ok: false, error: "تعذّر رفع الصورة. حاول مرة أخرى." };
  }

  return { ok: true, key, url: publicUrlForKey(key) };
}

export function publicUrlForKey(key: string): string {
  return `/api/media/${key}`;
}

// مفتاح آمن للعرض العام: داخل بادئة public-media/ فقط وبلا اجتياز مسار.
export function isPublicMediaKey(key: string): boolean {
  if (!key.startsWith(`${PUBLIC_MEDIA_PREFIX}/`)) return false;
  if (key.includes("..")) return false;
  return true;
}
