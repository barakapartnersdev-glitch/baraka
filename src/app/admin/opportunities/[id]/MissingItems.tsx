"use client";
import { useState, useTransition } from "react";
import { addMissingItem, toggleMissingItem } from "./actions";
import { t, type Locale } from "@/lib/i18n";

export interface MissingItemView {
  id: string;
  description: string;
  resolved: boolean;
}

export default function MissingItems({
  opportunityId,
  items,
  locale,
}: {
  opportunityId: string;
  items: MissingItemView[];
  locale: Locale;
}) {
  const [pending, startTransition] = useTransition();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function add() {
    setError(null);
    startTransition(async () => {
      const res = await addMissingItem(opportunityId, text);
      if (res.ok) setText("");
      else setError(res.error ?? t(locale, "missing.addFailed"));
    });
  }

  function toggle(id: string, resolved: boolean) {
    setError(null);
    startTransition(async () => {
      const res = await toggleMissingItem(id, resolved);
      if (!res.ok) setError(res.error ?? t(locale, "missing.updateFailed"));
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {items.map((m) => (
            <li
              key={m.id}
              className="p-3 flex items-center justify-between text-sm gap-3"
            >
              <span className={m.resolved ? "line-through text-gray-400" : ""}>
                {m.description}
              </span>
              <button
                onClick={() => toggle(m.id, !m.resolved)}
                disabled={pending}
                className={`text-xs px-2.5 py-1 rounded-md transition disabled:opacity-50 ${
                  m.resolved
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                {m.resolved ? t(locale, "missing.reopen") : t(locale, "missing.markResolved")}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t(locale, "missing.placeholder")}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-baraka"
        />
        <button
          onClick={add}
          disabled={pending || !text.trim()}
          className="text-sm bg-baraka text-white px-4 py-1.5 rounded-lg hover:bg-baraka-dark transition disabled:opacity-50"
        >
          {t(locale, "missing.add")}
        </button>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
