"use client";
// زرّ «فتح حساب السفير» — ينشئ الحساب ويعرض كلمة المرور المؤقتة مرّة واحدة.
import { useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import { ta } from "@/lib/ambassador-i18n";
import { createAmbassadorAccount } from "../actions";

export default function CreateAccount({
  id,
  locale,
  hasAccount,
}: {
  id: string;
  locale: Locale;
  hasAccount: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ tempPassword: string; email: string } | null>(null);

  if (hasAccount && !result) {
    return <p className="text-sm text-green-700">{ta(locale, "admin.accountExists")}</p>;
  }

  if (result) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
        <p className="font-bold text-green-800 mb-2">{ta(locale, "admin.accountCreatedTitle")}</p>
        <p className="text-xs text-gray-500">{ta(locale, "admin.accountEmail")}</p>
        <p className="font-mono text-gray-800 mb-2" dir="ltr">{result.email}</p>
        <p className="text-xs text-gray-500">{ta(locale, "admin.tempPassword")}</p>
        <p className="font-mono text-base font-bold text-baraka-dark select-all" dir="ltr">{result.tempPassword}</p>
        <a href="/login" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-baraka hover:underline text-xs">/login</a>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(ta(locale, "admin.confirmCreate"))) return;
          setError(null);
          start(async () => {
            const r = await createAmbassadorAccount(id);
            if (!r.ok) setError(r.error ?? ta(locale, "common.actionFailed"));
            else setResult({ tempPassword: r.tempPassword!, email: r.email! });
          });
        }}
        className="w-full bg-baraka text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
      >
        {ta(locale, "admin.createAccount")}
      </button>
      {error && <p className="text-xs text-red-700 mt-2">{error}</p>}
    </div>
  );
}
