"use client";
import { useState, useTransition } from "react";
import type { AccountStatus } from "@prisma/client";
import { setUserStatus } from "./actions";
import { t, type Locale } from "@/lib/i18n";

export default function UserActions({
  userId,
  status,
  locale,
}: {
  userId: string;
  status: AccountStatus;
  locale: Locale;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(target: AccountStatus) {
    setError(null);
    startTransition(async () => {
      const res = await setUserStatus(userId, target);
      if (!res.ok) setError(res.error ?? t(locale, "actionFailed"));
    });
  }

  return (
    <div className="flex items-center gap-2">
      {(status === "PENDING_REVIEW" || status === "PENDING_EMAIL") && (
        <button
          onClick={() => run("ACTIVE")}
          disabled={pending}
          className="text-xs bg-baraka text-white px-3 py-1.5 rounded-md hover:bg-baraka-dark transition disabled:opacity-50"
        >
          {t(locale, "ua.approve")}
        </button>
      )}
      {status === "ACTIVE" && (
        <button
          onClick={() => run("SUSPENDED")}
          disabled={pending}
          className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition disabled:opacity-50"
        >
          {t(locale, "ua.suspend")}
        </button>
      )}
      {status === "SUSPENDED" && (
        <button
          onClick={() => run("ACTIVE")}
          disabled={pending}
          className="text-xs border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
        >
          {t(locale, "ua.reactivate")}
        </button>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
