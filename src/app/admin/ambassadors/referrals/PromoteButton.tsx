"use client";
// إحالة ترشيح إلى مسار علاقات المستثمرين في الـ CRM.
import { useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import { ta } from "@/lib/ambassador-i18n";
import { promoteReferralToCrm } from "../actions";

export default function PromoteButton({
  id,
  locale,
  hasLead,
}: {
  id: string;
  locale: Locale;
  hasLead: boolean;
}) {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (done) return <span className="text-xs text-green-700">{ta(locale, "ref.promoted")}</span>;

  return (
    <span>
      <button
        type="button"
        disabled={pending || !hasLead}
        title={!hasLead ? ta(locale, "ref.promoteNoLead") : undefined}
        onClick={() => {
          setErr(null);
          start(async () => {
            const r = await promoteReferralToCrm(id);
            if (!r.ok) setErr(r.error ?? ta(locale, "common.actionFailed"));
            else setDone(true);
          });
        }}
        className="text-xs text-baraka hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
      >
        {ta(locale, "ref.promote")}
      </button>
      {err && <span className="block text-xs text-red-700">{err}</span>}
    </span>
  );
}
