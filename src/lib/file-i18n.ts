// ملصقات واجهة الملفات (client-safe) — لرفع/عرض/تنزيل مرفقات الـ CRM بأربع لغات.
import type { Locale } from "@/lib/i18n";

type Quad = { ar: string; en: string; tr: string; zh: string };

const M: Record<string, Quad> = {
  "attach": { ar: "إرفاق ملفات", en: "Attach files", tr: "Dosya ekle", zh: "附加文件" },
  "attachHint": {
    ar: "PDF أو Word أو Excel أو صور — حتى 15MB للملف، 5 ملفات كحد أقصى.",
    en: "PDF, Word, Excel, or images — up to 15MB each, max 5 files.",
    tr: "PDF, Word, Excel veya görseller — her biri 15MB'a kadar, en fazla 5 dosya.",
    zh: "PDF、Word、Excel 或图片 — 每个最大 15MB，最多 5 个文件。",
  },
  "filesTitle": { ar: "الملفات المرفقة", en: "Attached files", tr: "Ekli dosyalar", zh: "附件" },
  "noFiles": { ar: "لا ملفات مرفقة.", en: "No attached files.", tr: "Ekli dosya yok.", zh: "无附件。" },
  "download": { ar: "تنزيل", en: "Download", tr: "İndir", zh: "下载" },
  "delete": { ar: "حذف", en: "Delete", tr: "Sil", zh: "删除" },
  "uploadInternal": { ar: "رفع ملف داخلي", en: "Upload internal file", tr: "Dahili dosya yükle", zh: "上传内部文件" },
  "upload": { ar: "رفع", en: "Upload", tr: "Yükle", zh: "上传" },
};

export function tf(locale: Locale, key: string): string {
  const e = M[key];
  return e ? (e[locale] ?? e.ar) : key;
}

// تنسيق حجم الملف للعرض
export function fmtBytes(n: number | null | undefined): string {
  if (!n || n <= 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
