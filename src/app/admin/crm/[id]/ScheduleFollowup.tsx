"use client";
// جدولة متابعة على الطلب (اتصال/بريد/واتساب/اجتماع...).
import { useState, useTransition } from "react";
import { tc } from "@/lib/crm-i18n";
import { FOLLOWUP_TYPES } from "@/lib/crm";
import type { Locale } from "@/lib/i18n";
import { scheduleFollowup } from "../actions";

const cls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-baraka";

export default function ScheduleFollowup({ leadId, locale }: { leadId: string; locale: Locale }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [when, setWhen] = useState("");
  const [type, setType] = useState<string>("call");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const r = await scheduleFollowup(leadId, when, type, notes);
      if (!r.ok) setError(r.error ?? tc(locale, "detail.actionFailed"));
      else {
        setWhen("");
        setNotes("");
        setType("call");
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 border-t border-gray-100 pt-3 mt-3">
      <div className="flex flex-wrap gap-2">
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          required
          className={`${cls} max-w-[210px]`}
          dir="ltr"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className={`${cls} max-w-[180px]`}>
          {FOLLOWUP_TYPES.map((f) => (
            <option key={f} value={f}>
              {tc(locale, `followupType.${f}`)}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={tc(locale, "followups.notesPh")}
        className={cls}
      />
      <button
        type="submit"
        disabled={pending || !when}
        className="self-start bg-baraka text-white px-4 py-2 rounded-lg text-sm hover:bg-baraka-dark transition disabled:opacity-60"
      >
        {tc(locale, "followups.schedule")}
      </button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </form>
  );
}
