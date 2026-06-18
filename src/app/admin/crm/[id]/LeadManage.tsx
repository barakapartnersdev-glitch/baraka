"use client";
// لوحة التحكّم بالطلب: الحالة، الأهمية، الإسناد، القسم، السبام، القراءة.
import { useState, useTransition } from "react";
import type { LeadPriority } from "@prisma/client";
import { tc } from "@/lib/crm-i18n";
import { PRIORITIES, DEPARTMENTS } from "@/lib/crm";
import type { Locale } from "@/lib/i18n";
import {
  setLeadStatus,
  setLeadPriority,
  assignLead,
  toggleSpam,
  markLeadRead,
} from "../actions";

type Admin = { id: string; fullName: string };

const selCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-baraka disabled:opacity-60";

export default function LeadManage({
  leadId,
  locale,
  statuses,
  status,
  priority,
  assigneeId,
  department,
  isRead,
  isSpam,
  admins,
}: {
  leadId: string;
  locale: Locale;
  statuses: string[];
  status: string;
  priority: LeadPriority;
  assigneeId: string | null;
  department: string | null;
  isRead: boolean;
  isSpam: boolean;
  admins: Admin[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // الإسناد محليّاً (الموظف + القسم يُرسلان معاً)
  const [assignee, setAssignee] = useState(assigneeId ?? "");
  const [dept, setDept] = useState(department ?? "");

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error ?? tc(locale, "detail.actionFailed"));
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* الحالة */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{tc(locale, "detail.status")}</label>
        <select
          className={selCls}
          value={status}
          disabled={pending}
          onChange={(e) => run(() => setLeadStatus(leadId, e.target.value))}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {tc(locale, `crmStatus.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {/* الأهمية */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{tc(locale, "detail.priority")}</label>
        <select
          className={selCls}
          value={priority}
          disabled={pending}
          onChange={(e) => run(() => setLeadPriority(leadId, e.target.value))}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {tc(locale, `crmPriority.${p}`)}
            </option>
          ))}
        </select>
      </div>

      {/* الإسناد: موظف + قسم */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{tc(locale, "detail.assignTo")}</label>
        <select
          className={selCls}
          value={assignee}
          disabled={pending}
          onChange={(e) => {
            const v = e.target.value;
            setAssignee(v);
            run(() => assignLead(leadId, v || null, dept || null));
          }}
        >
          <option value="">{tc(locale, "detail.unassigned")}</option>
          {admins.map((a) => (
            <option key={a.id} value={a.id}>
              {a.fullName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{tc(locale, "detail.department")}</label>
        <select
          className={selCls}
          value={dept}
          disabled={pending}
          onChange={(e) => {
            const v = e.target.value;
            setDept(v);
            run(() => assignLead(leadId, assignee || null, v || null));
          }}
        >
          <option value="">{tc(locale, "detail.noDept")}</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {tc(locale, `dept.${d}`)}
            </option>
          ))}
        </select>
      </div>

      {/* أزرار سريعة */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => markLeadRead(leadId, !isRead))}
          className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 disabled:opacity-60"
        >
          {isRead ? tc(locale, "detail.markUnread") : tc(locale, "detail.markRead")}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => toggleSpam(leadId, !isSpam))}
          className={`text-xs border rounded-lg px-3 py-1.5 disabled:opacity-60 ${
            isSpam
              ? "border-gray-300 hover:bg-gray-50"
              : "border-red-200 text-red-700 hover:bg-red-50"
          }`}
        >
          {isSpam ? tc(locale, "detail.unmarkSpam") : tc(locale, "detail.markSpam")}
        </button>
      </div>

      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
