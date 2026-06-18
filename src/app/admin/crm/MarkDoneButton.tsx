"use client";
// زر تعليم متابعة كمنجزة (مشترك بين صفحة التفاصيل وقائمة المتابعات).
import { useState, useTransition } from "react";
import { tc } from "@/lib/crm-i18n";
import type { Locale } from "@/lib/i18n";
import { markFollowupDone } from "./actions";

export default function MarkDoneButton({ followupId, locale }: { followupId: string; locale: Locale }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await markFollowupDone(followupId);
          if (!r.ok) setErr(true);
        })
      }
      className={`text-xs rounded-lg px-3 py-1.5 border transition disabled:opacity-60 ${
        err ? "border-red-300 text-red-700" : "border-green-300 text-green-700 hover:bg-green-50"
      }`}
    >
      {tc(locale, "followups.markDone")}
    </button>
  );
}
