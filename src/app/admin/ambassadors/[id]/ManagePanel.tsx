"use client";
// لوحة التحكّم بطلب السفير: الحالة، التقييم، الإسناد، وإضافة ملاحظة داخلية.
import { useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import { ta } from "@/lib/ambassador-i18n";
import { ALL_AMB_STATUSES } from "@/lib/ambassador-form";
import {
  setAmbassadorStatus,
  setAmbassadorScore,
  assignAmbassador,
  addAmbassadorNote,
} from "../actions";

type Admin = { id: string; fullName: string };

const selCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-baraka disabled:opacity-60";

export default function ManagePanel({
  id,
  locale,
  status,
  score,
  assigneeId,
  admins,
}: {
  id: string;
  locale: Locale;
  status: string;
  score: number;
  assigneeId: string | null;
  admins: Admin[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [scoreVal, setScoreVal] = useState(String(score));
  const [note, setNote] = useState("");

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error ?? "تعذّر تنفيذ الإجراء.");
      else after?.();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* الحالة */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{ta(locale, "admin.col.status")}</label>
        <select
          className={selCls}
          value={status}
          disabled={pending}
          onChange={(e) => run(() => setAmbassadorStatus(id, e.target.value))}
        >
          {ALL_AMB_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ta(locale, `status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {/* التقييم */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          {ta(locale, "admin.col.score")} (0–100)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            max={100}
            value={scoreVal}
            disabled={pending}
            onChange={(e) => setScoreVal(e.target.value)}
            className={`${selCls} flex-1`}
            dir="ltr"
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => setAmbassadorScore(id, Number(scoreVal)))}
            className="bg-baraka text-white px-4 rounded-lg text-sm hover:bg-baraka-dark transition disabled:opacity-60"
          >
            {ta(locale, "admin.action.save")}
          </button>
        </div>
      </div>

      {/* الإسناد */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{ta(locale, "admin.col.assignee")}</label>
        <select
          className={selCls}
          value={assigneeId ?? ""}
          disabled={pending}
          onChange={(e) => run(() => assignAmbassador(id, e.target.value || null))}
        >
          <option value="">—</option>
          {admins.map((a) => (
            <option key={a.id} value={a.id}>
              {a.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* إضافة ملاحظة */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{ta(locale, "admin.action.addNote")}</label>
        <textarea
          className={selCls}
          rows={3}
          value={note}
          disabled={pending}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="button"
          disabled={pending || note.trim().length < 2}
          onClick={() => run(() => addAmbassadorNote(id, note), () => setNote(""))}
          className="mt-2 bg-baraka text-white px-4 py-2 rounded-lg text-sm hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {ta(locale, "admin.action.addNote")}
        </button>
      </div>

      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
