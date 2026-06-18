"use client";
import { useState, useTransition } from "react";
import { submitDestinationLead } from "./actions";
import { destUi } from "@/lib/dest-i18n";
import type { Locale } from "@/lib/i18n";

export default function DestinationLeadForm({
  locale,
  destinationId,
  countryKey,
  sectors,
}: {
  locale: Locale;
  destinationId: string;
  countryKey: string;
  sectors: string[];
}) {
  const ui = destUi(locale);
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-baraka focus:ring-1 focus:ring-baraka";
  const labelCls = "mb-1 block text-xs font-medium text-gray-600";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const input = {
      destinationId,
      countryKey,
      pageLocale: locale,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      investorCountry: String(fd.get("investorCountry") ?? ""),
      investorType: String(fd.get("investorType") ?? ""),
      interestCountry: String(fd.get("interestCountry") ?? ""),
      sector: String(fd.get("sector") ?? ""),
      investmentSize: String(fd.get("investmentSize") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""), // honeypot
    };
    start(async () => {
      const res = await submitDestinationLead(input);
      if (res.ok) setDone(true);
      else setError(ui.fError);
    });
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-800">
        {ui.fSuccess}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="ld-name">{ui.fName}</label>
          <input id="ld-name" name="name" required className={inputCls} autoComplete="name" />
        </div>
        <div>
          <label className={labelCls} htmlFor="ld-email">{ui.fEmail}</label>
          <input id="ld-email" name="email" type="email" required className={inputCls} dir="ltr" autoComplete="email" />
        </div>
        <div>
          <label className={labelCls} htmlFor="ld-phone">{ui.fPhone} <span className="text-gray-400">{ui.optional}</span></label>
          <input id="ld-phone" name="phone" className={inputCls} dir="ltr" autoComplete="tel" />
        </div>
        <div>
          <label className={labelCls} htmlFor="ld-country">{ui.fCountry} <span className="text-gray-400">{ui.optional}</span></label>
          <input id="ld-country" name="investorCountry" className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="ld-type">{ui.fInvestorType} <span className="text-gray-400">{ui.optional}</span></label>
          <select id="ld-type" name="investorType" className={inputCls} defaultValue="">
            <option value="" disabled>{ui.selectPlaceholder}</option>
            <option value="individual">{ui.typeIndividual}</option>
            <option value="company">{ui.typeCompany}</option>
            <option value="fund">{ui.typeFund}</option>
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="ld-interest">{ui.fInterestCountry} <span className="text-gray-400">{ui.optional}</span></label>
          <input id="ld-interest" name="interestCountry" className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="ld-sector">{ui.fSector} <span className="text-gray-400">{ui.optional}</span></label>
          {sectors.length > 0 ? (
            <select id="ld-sector" name="sector" className={inputCls} defaultValue="">
              <option value="">{ui.selectPlaceholder}</option>
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          ) : (
            <input id="ld-sector" name="sector" className={inputCls} />
          )}
        </div>
        <div>
          <label className={labelCls} htmlFor="ld-size">{ui.fSize} <span className="text-gray-400">{ui.optional}</span></label>
          <input id="ld-size" name="investmentSize" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="ld-message">{ui.fMessage} <span className="text-gray-400">{ui.optional}</span></label>
          <textarea id="ld-message" name="message" rows={4} className={inputCls} />
        </div>
      </div>

      {/* مصيدة سبام مخفية — لا يراها المستخدم */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-baraka px-6 py-3 text-sm font-bold text-white transition hover:bg-baraka-dark disabled:opacity-50"
      >
        {pending ? ui.fSubmitting : ui.fSubmit}
      </button>
    </form>
  );
}
