"use client";
// لوحة مراجعة أصل مقدّم: الحالة، الإسناد، الملاحظات، والتحويل إلى فرصة.
import { useState, useTransition } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { tg } from "@/lib/agent-portal-i18n";
import { SUBMISSION_STATUSES, submissionStatusBadge } from "@/lib/agent";
import {
  setSubmittedAssetStatus,
  assignSubmittedAsset,
  saveSubmittedAssetNotes,
  convertAssetToOpportunity,
  type ActionState,
} from "../../actions";

type Admin = { id: string; fullName: string };
const selCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-baraka disabled:opacity-60";

export default function AssetReviewPanel({
  id,
  locale,
  status,
  assigneeId,
  notes,
  admins,
  convertedOpportunityId,
}: {
  id: string;
  locale: Locale;
  status: string;
  assigneeId: string | null;
  notes: string;
  admins: Admin[];
  convertedOpportunityId: string | null;
}) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [noteVal, setNoteVal] = useState(notes);

  function run(fn: () => Promise<ActionState>) {
    setErr(null);
    start(async () => {
      const r = await fn();
      if (!r.ok) setErr(r.error === "need_approved" ? tg(locale, "admin.assets.needApproved") : r.error ?? tg(locale, "common.actionFailed"));
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{tg(locale, "assets.col.status")}</label>
        <select className={selCls} value={status} disabled={pending} onChange={(e) => run(() => setSubmittedAssetStatus(id, e.target.value))}>
          {SUBMISSION_STATUSES.map((s) => (
            <option key={s} value={s}>{submissionStatusBadge(locale, s).label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{tg(locale, "admin.assets.byAgent")}</label>
        <select className={selCls} value={assigneeId ?? ""} disabled={pending} onChange={(e) => run(() => assignSubmittedAsset(id, e.target.value || null))}>
          <option value="">—</option>
          {admins.map((a) => <option key={a.id} value={a.id}>{a.fullName}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{tg(locale, "assets.detail.adminNotes")}</label>
        <textarea className={selCls} rows={3} value={noteVal} disabled={pending} onChange={(e) => setNoteVal(e.target.value)} />
        <button type="button" disabled={pending} onClick={() => run(() => saveSubmittedAssetNotes(id, noteVal))} className="mt-2 bg-baraka text-white px-4 py-1.5 rounded-lg text-sm hover:bg-baraka-dark transition disabled:opacity-60">
          {tg(locale, "profile.save")}
        </button>
      </div>

      <div className="pt-3 border-t border-gray-100">
        {convertedOpportunityId ? (
          <Link href={`/admin/opportunities/${convertedOpportunityId}`} className="text-sm text-baraka hover:underline font-medium">
            {tg(locale, "admin.assets.viewOpp")} →
          </Link>
        ) : (
          <button type="button" disabled={pending} onClick={() => run(() => convertAssetToOpportunity(id))} className="w-full bg-gradient-to-br from-gold to-gold-soft text-navy px-4 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition disabled:opacity-60">
            {tg(locale, "admin.assets.convert")}
          </button>
        )}
      </div>

      {err && <p className="text-xs text-red-700">{err}</p>}
    </div>
  );
}
