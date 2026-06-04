"use client";
import { useState, useTransition } from "react";
import type { InterestStatus } from "@prisma/client";
import { requestInterest, signNcnda } from "@/app/investor/actions";
import { NCNDA_CLAUSES } from "@/lib/ncnda";
import { t, type Locale } from "@/lib/i18n";

export default function InvestorInterest({
  opportunityId,
  interestId,
  status,
  locale,
}: {
  opportunityId: string;
  interestId: string | null;
  status: InterestStatus | null;
  locale: Locale;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);

  function request() {
    setError(null);
    startTransition(async () => {
      const res = await requestInterest(opportunityId);
      if (!res.ok) setError(res.error ?? t(locale, "interestUi.requestFailed"));
    });
  }

  function sign() {
    if (!interestId) return;
    setError(null);
    startTransition(async () => {
      const res = await signNcnda(interestId, name.trim());
      if (!res.ok) setError(res.error ?? t(locale, "interestUi.signFailed"));
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {!status && (
        <button
          onClick={request}
          disabled={pending}
          className="bg-baraka text-white px-5 py-2.5 rounded-lg text-sm hover:bg-baraka-dark transition disabled:opacity-50 w-fit"
        >
          {t(locale, "interestUi.requestBtn")}
        </button>
      )}

      {status === "REQUESTED" && (
        <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg p-3">
          {t(locale, "interestUi.requested")}
        </p>
      )}

      {status === "ADMIN_APPROVED" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-teal-700 bg-teal-50 border border-teal-100 rounded-lg p-3">
            {t(locale, "ncndaUi.approvedPrompt")}
          </p>

          <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-auto text-xs text-gray-700 leading-relaxed">
            <p className="font-bold mb-2">{t(locale, "ncndaUi.agreementTitle")}</p>
            <ol className="list-decimal pr-4 space-y-1.5">
              {NCNDA_CLAUSES.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ol>
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <span>{t(locale, "ncndaUi.agree")}</span>
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t(locale, "ncndaUi.namePlaceholder")}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:border-baraka"
          />

          <button
            onClick={sign}
            disabled={pending || !agreed || name.trim().length < 3}
            className="bg-baraka text-white px-5 py-2.5 rounded-lg text-sm hover:bg-baraka-dark transition disabled:opacity-50 w-fit"
          >
            {t(locale, "ncndaUi.signBtn")}
          </button>
        </div>
      )}

      {status === "NCNDA_SIGNED" && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3">
            {t(locale, "ncndaUi.signedMsg")}
          </p>
          {interestId && (
            <a
              href={`/api/ncnda/${interestId}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-baraka hover:underline w-fit"
            >
              {t(locale, "ncndaUi.downloadSigned")}
            </a>
          )}
        </div>
      )}

      {status === "DECLINED" && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">
          {t(locale, "interestUi.declined")}
        </p>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
