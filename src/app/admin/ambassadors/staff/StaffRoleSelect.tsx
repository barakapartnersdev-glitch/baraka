"use client";
// محدِّد الدور الفرعي لموظف إدارة.
import { useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import { ta } from "@/lib/ambassador-i18n";
import { ADMIN_ROLES } from "@/lib/admin-roles";
import { setAdminRole } from "../actions";

export default function StaffRoleSelect({
  userId,
  locale,
  role,
}: {
  userId: string;
  locale: Locale;
  role: string;
}) {
  const [pending, start] = useTransition();
  const [val, setVal] = useState(role);
  const [err, setErr] = useState<string | null>(null);

  return (
    <span className="flex items-center gap-2">
      <select
        value={val}
        disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          const prev = val;
          setVal(v);
          setErr(null);
          start(async () => {
            const r = await setAdminRole(userId, v);
            if (!r.ok) {
              setVal(prev);
              setErr(r.error ?? ta(locale, "common.actionFailed"));
            }
          });
        }}
        className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:border-baraka disabled:opacity-60"
      >
        {ADMIN_ROLES.map((r) => (
          <option key={r} value={r}>
            {ta(locale, `role.${r}`)}
          </option>
        ))}
      </select>
      {err && <span className="text-xs text-red-700">{err}</span>}
    </span>
  );
}
