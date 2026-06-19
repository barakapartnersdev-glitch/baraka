"use client";
// لوحة إجراءات الإدارة على طلب وكيل — تغيير الحالة، الإسناد، الملاحظات الداخلية.
import { useState, useTransition } from "react";
import { changeAgentStatus, assignAgentAdmin, saveAgentNotes } from "../actions";
import { AGENT_STATUSES, AGENT_STATUS_LABELS, pick } from "@/lib/agent";
import { agentUi } from "@/lib/agent-i18n";
import type { Locale } from "@/lib/i18n";

interface Admin {
  id: string;
  fullName: string;
}

const selectCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-baraka focus:ring-1 focus:ring-baraka/30";

export default function AgentAdminActions({
  id,
  locale,
  status,
  assignedToId,
  admins,
  notes,
  rejectionReason,
}: {
  id: string;
  locale: Locale;
  status: string;
  assignedToId: string | null;
  admins: Admin[];
  notes: string;
  rejectionReason: string;
}) {
  const ui = agentUi(locale);
  const [pending, start] = useTransition();
  const [st, setSt] = useState(status);
  const [reason, setReason] = useState(rejectionReason);
  const [assignee, setAssignee] = useState(assignedToId ?? "");
  const [noteText, setNoteText] = useState(notes);
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null);

  function flash(ok: boolean) {
    setMsg(ok ? { t: "ok", m: ui.saved } : { t: "err", m: ui.actionFailed });
  }

  function saveStatus() {
    start(async () => {
      const r = await changeAgentStatus(id, st, st === "REJECTED" ? reason : undefined);
      flash(r.ok);
    });
  }
  function saveAssignee(value: string) {
    setAssignee(value);
    start(async () => {
      const r = await assignAgentAdmin(id, value || null);
      flash(r.ok);
    });
  }
  function saveNotes() {
    start(async () => {
      const r = await saveAgentNotes(id, noteText);
      flash(r.ok);
    });
  }

  return (
    <div className="rounded-2xl border border-gold/30 bg-amber-50/40 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* الحالة */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-600">{ui.changeStatus}</label>
          <div className="flex gap-2">
            <select value={st} onChange={(e) => setSt(e.target.value)} className={selectCls} disabled={pending}>
              {AGENT_STATUSES.map((s) => (
                <option key={s} value={s}>{pick(AGENT_STATUS_LABELS[s], locale)}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={saveStatus}
              disabled={pending}
              className="shrink-0 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-600 disabled:opacity-50"
            >
              {ui.save}
            </button>
          </div>
          {st === "REJECTED" && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder={ui.rejectionReasonLabel}
              className={`${selectCls} mt-2`}
            />
          )}
        </div>

        {/* المسؤول */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-600">{ui.assignAdmin}</label>
          <select value={assignee} onChange={(e) => saveAssignee(e.target.value)} className={selectCls} disabled={pending}>
            <option value="">{ui.unassigned}</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>{a.fullName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* الملاحظات الداخلية */}
      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">{ui.notesLabel}</label>
        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={3} className={selectCls} disabled={pending} />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={saveNotes}
            disabled={pending}
            className="rounded-lg border border-baraka/40 px-4 py-2 text-sm font-semibold text-navy transition hover:bg-baraka-light disabled:opacity-50"
          >
            {ui.saveNotes}
          </button>
          {msg && (
            <span className={`text-sm ${msg.t === "ok" ? "text-emerald-700" : "text-red-600"}`}>{msg.m}</span>
          )}
        </div>
      </div>
    </div>
  );
}
