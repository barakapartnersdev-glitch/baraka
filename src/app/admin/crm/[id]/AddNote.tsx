"use client";
// إضافة ملاحظة/تسجيل متابعة على الطلب.
import { useRef, useState, useTransition } from "react";
import { tc } from "@/lib/crm-i18n";
import { NOTE_TYPES } from "@/lib/crm";
import type { Locale } from "@/lib/i18n";
import { addLeadNote } from "../actions";

const cls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-baraka";

export default function AddNote({ leadId, locale }: { leadId: string; locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [type, setType] = useState<string>("internal_note");
  const formRef = useRef<HTMLFormElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const r = await addLeadNote(leadId, text, type);
      if (!r.ok) {
        setError(r.error ?? tc(locale, "detail.actionFailed"));
      } else {
        setText("");
        setType("internal_note");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={submit} className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder={tc(locale, "detail.notePh")}
        className={cls}
      />
      <div className="flex flex-wrap items-center gap-2">
        <select value={type} onChange={(e) => setType(e.target.value)} className={`${cls} max-w-[200px]`}>
          {NOTE_TYPES.map((n) => (
            <option key={n} value={n}>
              {tc(locale, `noteType.${n}`)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending || text.trim().length < 2}
          className="bg-baraka text-white px-5 py-2 rounded-lg text-sm hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {pending ? tc(locale, "detail.saving") : tc(locale, "detail.saveNote")}
        </button>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </form>
  );
}
