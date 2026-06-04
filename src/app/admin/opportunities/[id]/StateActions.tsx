"use client";
import { useState, useTransition } from "react";
import type { OpportunityState } from "@prisma/client";
import { ADMIN_TRANSITIONS } from "@/lib/opportunity";
import { changeOpportunityState } from "./actions";
import { t, type Locale } from "@/lib/i18n";

// مفتاح القاموس للزر حسب الحالة الهدف (مع مراعاة الحالة الحالية عند اللزوم).
function actionKey(from: OpportunityState, to: OpportunityState): string {
  switch (to) {
    case "UNDER_REVIEW":
      return from === "SUBMITTED" ? "stateAction.startReview" : "stateAction.backToReview";
    case "NEEDS_INFO":
      return "stateAction.needsInfo";
    case "READY_TO_PUBLISH":
      return "stateAction.readyPublish";
    case "PUBLISHED":
      return "stateAction.publish";
    case "PAUSED":
      return "stateAction.pause";
    case "CLOSED":
      return "stateAction.close";
    case "ARCHIVED":
      return "stateAction.archive";
    default:
      return "stateAction.changeState";
  }
}

export default function StateActions({
  id,
  state,
  locale,
}: {
  id: string;
  state: OpportunityState;
  locale: Locale;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const targets = ADMIN_TRANSITIONS[state] ?? [];

  if (targets.length === 0) {
    return <p className="text-xs text-gray-400">{t(locale, "state.noActions")}</p>;
  }

  function go(next: OpportunityState) {
    setError(null);
    startTransition(async () => {
      const res = await changeOpportunityState(id, next);
      if (!res.ok) setError(res.error ?? t(locale, "actionFailed"));
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {targets.map((target) => (
          <button
            key={target}
            disabled={pending}
            onClick={() => go(target)}
            className="text-sm border border-baraka text-baraka-dark px-3 py-1.5 rounded-lg hover:bg-baraka-light transition disabled:opacity-50"
          >
            {t(locale, actionKey(state, target))}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-2">
          {error}
        </p>
      )}
    </div>
  );
}
