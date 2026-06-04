"use client";
import { useRef, useState, useTransition } from "react";
import { uploadOwnerFile, deleteOwnerFile } from "@/app/owner/actions";
import { t, type Locale } from "@/lib/i18n";

export interface OwnerFileView {
  id: string;
  fileName: string;
}

export default function OwnerFiles({
  opportunityId,
  editable,
  files,
  locale,
}: {
  opportunityId: string;
  editable: boolean;
  files: OwnerFileView[];
  locale: Locale;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? t(locale, "actionFailed"));
    });
  }

  function upload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    run(async () => {
      const res = await uploadOwnerFile(opportunityId, fd);
      if (res.ok && inputRef.current) inputRef.current.value = "";
      return res;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {files.length > 0 ? (
        <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {files.map((f) => (
            <li
              key={f.id}
              className="p-3 flex items-center justify-between gap-3 text-sm"
            >
              <a
                href={`/api/files/${f.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-baraka hover:underline truncate"
              >
                {f.fileName}
              </a>
              {editable && (
                <button
                  onClick={() => run(() => deleteOwnerFile(f.id))}
                  disabled={pending}
                  className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {t(locale, "files.delete")}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">{t(locale, "files.empty")}</p>
      )}

      {editable && (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            className="text-sm flex-1 file:ml-3 file:rounded-lg file:border-0 file:bg-baraka-light file:text-baraka-dark file:px-3 file:py-1.5 file:text-sm"
          />
          <button
            onClick={upload}
            disabled={pending}
            className="text-sm bg-baraka text-white px-4 py-1.5 rounded-lg hover:bg-baraka-dark transition disabled:opacity-50"
          >
            {t(locale, "files.upload")}
          </button>
        </div>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
