"use client";
import { useRef, useState, useTransition } from "react";
import type { FileVisibility } from "@prisma/client";
import {
  uploadFile,
  approveFile,
  setFileVisibility,
  deleteFile,
} from "./actions";
import { t, type Locale } from "@/lib/i18n";

export interface FileView {
  id: string;
  fileName: string;
  visibility: FileVisibility;
  approved: boolean;
}

export default function FilesManager({
  opportunityId,
  files,
  locale,
}: {
  opportunityId: string;
  files: FileView[];
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
      const res = await uploadFile(opportunityId, fd);
      if (res.ok && inputRef.current) inputRef.current.value = "";
      return res;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {files.length > 0 && (
        <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {files.map((f) => (
            <li key={f.id} className="p-3 flex items-center justify-between gap-3 text-sm flex-wrap">
              <a
                href={`/api/files/${f.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-baraka hover:underline truncate max-w-[40%]"
              >
                {f.fileName}
              </a>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    f.visibility === "POST_NCNDA"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {f.visibility === "POST_NCNDA"
                    ? t(locale, "file.postNcnda")
                    : t(locale, "file.adminOnly")}
                </span>
                <button
                  onClick={() =>
                    run(() =>
                      setFileVisibility(
                        f.id,
                        f.visibility === "POST_NCNDA" ? "ADMIN_ONLY" : "POST_NCNDA"
                      )
                    )
                  }
                  disabled={pending}
                  className="text-xs text-gray-500 hover:text-baraka disabled:opacity-50"
                >
                  {t(locale, "file.toggleVisibility")}
                </button>
                <button
                  onClick={() => run(() => approveFile(f.id, !f.approved))}
                  disabled={pending}
                  className={`text-xs px-2 py-0.5 rounded disabled:opacity-50 ${
                    f.approved
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f.approved ? t(locale, "file.approved") : t(locale, "file.approve")}
                </button>
                <button
                  onClick={() => run(() => deleteFile(f.id))}
                  disabled={pending}
                  className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {t(locale, "files.delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
          {t(locale, "file.upload")}
        </button>
      </div>
      <p className="text-xs text-gray-400">{t(locale, "file.hint")}</p>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
