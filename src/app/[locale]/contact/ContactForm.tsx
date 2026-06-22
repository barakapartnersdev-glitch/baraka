"use client";
// نموذج التواصل العام — متعدّد اللغات، يحفظ الرسالة كـ CrmLead في لوحة الإدارة.
// التصميم فاخر (كريمي/ذهبي) لكن المنطق وأسماء الحقول والإرسال كما هي دون تغيير.
import { useActionState } from "react";
import { tc } from "@/lib/crm-i18n";
import { tcc, REQUEST_TYPES } from "@/lib/contact-i18n";
import { type Locale } from "@/lib/i18n";
import { submitContactLead } from "./actions";
import type { LeadFormState } from "@/lib/crm-submit";

const initial: LeadFormState = {};

const inputCls =
  "w-full rounded-2xl border border-[#e3d5bd] bg-white px-4 py-3.5 text-sm text-start outline-none transition focus:border-[#d7b56d]";
const labelCls = "mb-2 block text-sm font-bold text-[#333]";

export default function ContactForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(submitContactLead, initial);

  if (state.ok) {
    return (
      <div className="rounded-[2.5rem] border border-green-200 bg-green-50 p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl text-white">✓</div>
        <p className="text-xl font-black text-green-800">{tc(locale, "success.title")}</p>
        <p className="mt-2 leading-8 text-green-700">{tc(locale, "success.body")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-[2.5rem] border border-[#e3d5bd] bg-white p-6 shadow-sm md:p-10">
      {/* فخّ النحل */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="c-name" className={labelCls}>{tc(locale, "field.fullName")}</label>
          <input id="c-name" name="fullName" type="text" required autoComplete="name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="c-email" className={labelCls}>{tc(locale, "field.email")}</label>
          <input id="c-email" name="email" type="email" required dir="ltr" autoComplete="email" className={inputCls} />
        </div>
        <div>
          <label htmlFor="c-phone" className={labelCls}>
            {tc(locale, "field.phone")} <span className="font-normal text-[#999]">{tc(locale, "field.optional")}</span>
          </label>
          <input id="c-phone" name="phone" type="tel" dir="ltr" autoComplete="tel" className={inputCls} />
        </div>
        <div>
          <label htmlFor="c-country" className={labelCls}>
            {tc(locale, "field.country")} <span className="font-normal text-[#999]">{tc(locale, "field.optional")}</span>
          </label>
          <input id="c-country" name="country" type="text" autoComplete="country-name" className={inputCls} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="c-rt" className={labelCls}>{tcc(locale, "field.requestType")}</label>
        <select id="c-rt" name="requestType" defaultValue="general" className={inputCls}>
          {REQUEST_TYPES.map((rt) => (
            <option key={rt} value={rt}>
              {tcc(locale, `rt.${rt}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="c-msg" className={labelCls}>{tc(locale, "field.message")}</label>
        <textarea id="c-msg" name="message" rows={6} required className={inputCls} />
      </div>

      {state.error && (
        <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{state.error}</p>
      )}

      <div className="mt-6 rounded-[2rem] bg-[#171717] p-6 text-white md:p-8">
        <label className="flex gap-3 leading-8 text-white/80">
          <input type="checkbox" name="privacy" value="1" required className="mt-2 shrink-0" />
          <span>{tc(locale, "privacy.consent")}</span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-7 w-full rounded-full bg-[#d7b56d] px-8 py-4 text-sm font-black text-[#171717] transition hover:-translate-y-1 hover:bg-[#e5c77d] disabled:translate-y-0 disabled:opacity-60"
        >
          {pending ? tc(locale, "submitting") : tc(locale, "submit")}
        </button>
      </div>
    </form>
  );
}
