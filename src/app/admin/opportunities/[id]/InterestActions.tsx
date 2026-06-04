"use client";
import { useState, useTransition } from "react";
import type { InterestStatus } from "@prisma/client";
import { approveInterest, declineInterest, recordNcnda } from "./actions";
import { t, type Locale } from "@/lib/i18n";

export default function InterestActions({
  interestId,
  status,
  locale,
}: {
  interestId: string;
  status: InterestStatus;
  locale: Locale;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? t(locale, "actionFailed"));
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-wrap items-center gap-2">
        {status === "REQUESTED" && (
          <>
            <button
              onClick={() => run(() => approveInterest(interestId))}
              disabled={pending}
              className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md hover:bg-teal-100 transition disabled:opacity-50"
            >
              {t(locale, "ia.approve")}
            </button>
            <button
              onClick={() => run(() => declineInterest(interestId))}
              disabled={pending}
              className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-md hover:bg-red-100 transition disabled:opacity-50"
            >
              {t(locale, "ia.decline")}
            </button>
          </>
        )}
        {status === "ADMIN_APPROVED" && (
          <>
            <button
              onClick={() => run(() => recordNcnda(interestId))}
              disabled={pending}
              className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-md hover:bg-green-100 transition disabled:opacity-50"
            >
              {t(locale, "ia.recordNcnda")}
            </button>
            <button
              onClick={() => run(() => declineInterest(interestId))}
              disabled={pending}
              className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-md hover:bg-red-100 transition disabled:opacity-50"
            >
              {t(locale, "ia.decline")}
            </button>
          </>
        )}
        {status === "NCNDA_SIGNED" && (
          <a
            href={`/api/ncnda/${interestId}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-baraka hover:underline"
          >
            {t(locale, "ia.downloadNcnda")}
          </a>
        )}
        {(status === "DECLINED" || status === "WITHDRAWN") && (
          <span className="text-xs text-gray-400">{t(locale, "ia.noAction")}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
