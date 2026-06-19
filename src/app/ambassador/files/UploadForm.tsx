"use client";
// بوّابة السفير: نموذج رفع ملف.
import { useActionState, useEffect, useRef } from "react";
import { ta } from "@/lib/ambassador-i18n";
import { type Locale } from "@/lib/i18n";
import { uploadMyFile, type FileState } from "./actions";

const initial: FileState = {};

export default function UploadForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(uploadMyFile, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-center gap-3">
      <input
        name="file"
        type="file"
        required
        accept=".pdf,.doc,.docx,image/png,image/jpeg"
        className="text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-baraka text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
      >
        {pending ? ta(locale, "files.uploading") : ta(locale, "files.upload")}
      </button>
      <span className="text-xs text-gray-400 w-full">{ta(locale, "f.filesHint")}</span>
      {state.error && <p className="text-sm text-red-700 w-full">{state.error}</p>}
      {state.ok && <p className="text-sm text-green-700 w-full">{ta(locale, "files.uploaded")}</p>}
    </form>
  );
}
