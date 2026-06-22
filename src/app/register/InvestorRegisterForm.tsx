"use client";
// نموذج تسجيل المستثمر — تصميم فاخر، جميع الحقول إلزامية.
// يحافظ على عقد الإجراء registerInvestor: fullName/email/phone/country/investorType/
// investmentRange/preferredSector/password/confirm. الدخول التلقائي وإعادة التوجيه في الإجراء.
import { useActionState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { registerX } from "@/lib/register-extra";
import type { RegisterState } from "./actions";

const initial: RegisterState = {};
const inputCls =
  "w-full rounded-2xl border border-[#e3d5bd] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#d7b56d]";
const labelCls = "mb-2 block text-sm font-bold text-[#333]";

export default function InvestorRegisterForm({
  action,
  locale,
}: {
  action: (prev: RegisterState, formData: FormData) => Promise<RegisterState>;
  locale: Locale;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const rx = registerX(locale);
  const req = <span className="text-red-500"> *</span>;

  const types = [
    { v: "individual", title: t(locale, "reg.typeIndividual"), desc: rx.typeIndividualDesc },
    { v: "company", title: t(locale, "reg.typeCompany"), desc: rx.typeCompanyDesc },
    { v: "fund", title: t(locale, "reg.typeFund"), desc: rx.typeFundDesc },
  ];

  return (
    <form action={formAction} className="space-y-6">
      {/* 1. بيانات الحساب */}
      <section className="rounded-[2rem] bg-[#f7f1e7] p-5 md:p-6">
        <h3 className="mb-5 text-xl font-black">{rx.secAccount}</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="fullName" className={labelCls}>{t(locale, "field.fullName")}{req}</label>
            <input id="fullName" name="fullName" type="text" autoComplete="name" required className={inputCls} />
          </div>
          <div>
            <label htmlFor="email" className={labelCls}>{t(locale, "field.email")}{req}</label>
            <input id="email" name="email" type="email" autoComplete="email" required dir="ltr" className={inputCls} />
          </div>
          <div>
            <label htmlFor="phone" className={labelCls}>{t(locale, "field.phone")}{req}</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required dir="ltr" className={inputCls} />
          </div>
          <div>
            <label htmlFor="country" className={labelCls}>{rx.fieldCountry}{req}</label>
            <input id="country" name="country" type="text" autoComplete="country-name" required className={inputCls} />
          </div>
        </div>
      </section>

      {/* 2. نوع المستثمر */}
      <section className="rounded-[2rem] bg-[#f7f1e7] p-5 md:p-6">
        <h3 className="mb-5 text-xl font-black">{rx.secType}{req}</h3>
        <div className="grid gap-4">
          {types.map((type, i) => (
            <label
              key={type.v}
              className="group flex cursor-pointer gap-4 rounded-3xl border border-[#e3d5bd] bg-white p-5 transition hover:border-[#d7b56d] hover:shadow-lg has-[:checked]:border-[#d7b56d] has-[:checked]:shadow-lg"
            >
              <input type="radio" name="investorType" value={type.v} defaultChecked={i === 0} required className="mt-2" />
              <span>
                <span className="block text-lg font-black">{type.title}</span>
                <span className="mt-2 block leading-7 text-[#666]">{type.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* 3. الملف الاستثماري */}
      <section className="rounded-[2rem] bg-[#f7f1e7] p-5 md:p-6">
        <h3 className="mb-5 text-xl font-black">{rx.secProfile}</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="investmentRange" className={labelCls}>{rx.fieldRange}{req}</label>
            <select id="investmentRange" name="investmentRange" required defaultValue="" className={inputCls}>
              <option value="" disabled>{rx.selectPlaceholder}</option>
              {rx.investmentRanges.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="preferredSector" className={labelCls}>{rx.fieldSector}{req}</label>
            <select id="preferredSector" name="preferredSector" required defaultValue="" className={inputCls}>
              <option value="" disabled>{rx.selectPlaceholder}</option>
              {rx.sectors.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* 4. كلمة المرور */}
      <section className="rounded-[2rem] bg-[#f7f1e7] p-5 md:p-6">
        <h3 className="mb-5 text-xl font-black">{rx.secPassword}</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="password" className={labelCls}>{t(locale, "field.password")}{req}</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required dir="ltr" className={inputCls} />
          </div>
          <div>
            <label htmlFor="confirm" className={labelCls}>{t(locale, "field.confirm")}{req}</label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required dir="ltr" className={inputCls} />
          </div>
        </div>
      </section>

      {state?.error && (
        <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{state.error}</p>
      )}

      {/* الإقرار + الإرسال */}
      <section className="rounded-[2rem] bg-[#171717] p-5 text-white md:p-6">
        <label className="flex gap-3 leading-8 text-white/80">
          <input type="checkbox" required className="mt-2 shrink-0" />
          <span>{rx.consent}{req}</span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-7 w-full rounded-full bg-[#d7b56d] px-8 py-4 text-sm font-black text-[#171717] transition hover:-translate-y-1 hover:bg-[#e5c77d] disabled:translate-y-0 disabled:opacity-60"
        >
          {pending ? t(locale, "reg.submitting") : t(locale, "reg.submit")}
        </button>
      </section>
    </form>
  );
}
