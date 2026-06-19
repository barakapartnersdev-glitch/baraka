"use client";
// محدِّد حالة الترشيح في لوحة الإدارة.
import { useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import { ta } from "@/lib/ambassador-i18n";
import { ALL_REFERRAL_STATUSES } from "@/lib/ambassador-form";
import { setReferralStatus } from "../actions";

export default function StatusSelect({ id, locale, status }: { id: string; locale: Locale; status: string }) {
  const [pending, start] = useTransition();
  const [val, setVal] = useState(status);
  return (
    <select
      value={val}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value;
        setVal(v);
        start(() => setReferralStatus(id, v).then(() => undefined));
      }}
      className="border border-gray-300 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:border-baraka disabled:opacity-60"
    >
      {ALL_REFERRAL_STATUSES.map((s) => (
        <option key={s} value={s}>
          {ta(locale, `refStatus.${s}`)}
        </option>
      ))}
    </select>
  );
}
