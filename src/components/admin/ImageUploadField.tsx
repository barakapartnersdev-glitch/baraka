"use client";
// حقل رفع صورة قابل لإعادة الاستخدام (أغلفة الفرص + صور هيرو الدول).
// يرفع الصورة فوراً عبر uploadPublicImage ويضع الرابط الناتج في input مخفي
// يحمل الاسم `name` ليُرسَل ضمن النموذج الأب. يعرض معاينة + حالة الرفع.
import { useRef, useState, useTransition } from "react";
import { uploadPublicImage } from "@/app/admin/media-actions";

export default function ImageUploadField({
  name,
  label,
  folder,
  initialUrl,
  required,
}: {
  name: string;
  label: string;
  folder: string;
  initialUrl?: string | null;
  required?: boolean;
}) {
  const [url, setUrl] = useState<string>(initialUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function onPick(file: File | undefined) {
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder);
    startTransition(async () => {
      const res = await uploadPublicImage(fd);
      if (res.ok && res.url) setUrl(res.url);
      else setError(res.error ?? "تعذّر رفع الصورة.");
    });
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>

      {/* الرابط الناتج يُرسَل مع النموذج */}
      <input type="hidden" name={name} value={url} required={required} />

      <div className="flex items-start gap-3">
        {/* معاينة */}
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[11px] text-gray-400">
              لا صورة
            </div>
          )}
        </div>

        <div className="flex-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending}
            className="rounded-lg border border-baraka px-3 py-1.5 text-sm text-baraka-dark hover:bg-baraka-light disabled:opacity-50"
          >
            {pending ? "جارٍ الرفع..." : url ? "تغيير الصورة" : "رفع صورة"}
          </button>
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="mr-2 text-xs text-rose-600 hover:underline"
            >
              إزالة
            </button>
          )}
          <p className="mt-1 text-[11px] text-gray-400">PNG / JPG / WEBP حتى 8MB</p>
          {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
