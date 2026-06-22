"use client";
// نموذج تسجيل صاحب المشروع/الأصل — تصميم فاخر، جميع الحقول إلزامية.
// يحافظ على عقد registerOwner (fullName/email/phone/password/confirm)، وتُلتقط نبذة
// الفرصة (الصفة/النوع/المرحلة/الدولة/المدينة/الحجم/القطاع/الوصف) كـ CrmLead في الإجراء.
import { useActionState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { ownerRegisterX } from "@/lib/register-owner-extra";
import type { RegisterState } from "../actions";

const initial: RegisterState = {};
const inputCls =
  "w-full rounded-2xl border border-[#e3d5bd] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#d7b56d]";
const labelCls = "mb-2 block text-sm font-bold text-[#333]";

export default function OwnerRegisterForm({
  action,
  locale,
}: {
  action: (prev: RegisterState, formData: FormData) => Promise<RegisterState>;
  locale: Locale;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const ox = ownerRegisterX(locale);
  const req = <span className="text-red-500"> *</span>;
  const ownerValues = ["project_owner", "asset_owner", "authorized_representative"];

  return (
    <form action={formAction} className="space-y-6">
      {/* 1. بيانات الحساب */}
      <section className="rounded-[2rem] bg-[#f7f1e7] p-5 md:p-6">
        <h3 className="mb-5 text-xl font-black">{ox.secAccount}</h3>
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
            <label htmlFor="country" className={labelCls}>{ox.fieldCountry}{req}</label>
            <input id="country" name="country" type="text" autoComplete="country-name" required className={inputCls} />
          </div>
          <div>
            <label htmlFor="city" className={labelCls}>{ox.fieldCity}{req}</label>
            <input id="city" name="city" type="text" required className={inputCls} />
          </div>
          <div>
            <label htmlFor="language" className={labelCls}>{ox.fieldLanguage}{req}</label>
            <select id="language" name="language" required defaultValue="" className={inputCls}>
              <option value="" disabled>{ox.selectPlaceholder}</option>
              {ox.languages.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* 2. صفتك في الفرصة */}
      <section className="rounded-[2rem] bg-[#f7f1e7] p-5 md:p-6">
        <h3 className="mb-5 text-xl font-black">{ox.secType}{req}</h3>
        <div className="grid gap-4">
          {ox.ownerTypes.map((type, i) => (
            <label
              key={ownerValues[i]}
              className="group flex cursor-pointer gap-4 rounded-3xl border border-[#e3d5bd] bg-white p-5 transition hover:border-[#d7b56d] hover:shadow-lg has-[:checked]:border-[#d7b56d] has-[:checked]:shadow-lg"
            >
              <input type="radio" name="ownerType" value={ownerValues[i]} defaultChecked={i === 0} required className="mt-2" />
              <span>
                <span className="block text-lg font-black">{type.title}</span>
                <span className="mt-2 block leading-7 text-[#666]">{type.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* 3. نبذة عن الفرصة */}
      <section className="rounded-[2rem] bg-[#f7f1e7] p-5 md:p-6">
        <h3 className="mb-5 text-xl font-black">{ox.secProject}</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="assetType" className={labelCls}>{ox.fieldAssetType}{req}</label>
            <select id="assetType" name="assetType" required defaultValue="" className={inputCls}>
              <option value="" disabled>{ox.selectPlaceholder}</option>
              {ox.assetTypes.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="projectStage" className={labelCls}>{ox.fieldProjectStage}{req}</label>
            <select id="projectStage" name="projectStage" required defaultValue="" className={inputCls}>
              <option value="" disabled>{ox.selectPlaceholder}</option>
              {ox.projectStages.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="projectCountry" className={labelCls}>{ox.fieldProjectCountry}{req}</label>
            <input id="projectCountry" name="projectCountry" type="text" required className={inputCls} />
          </div>
          <div>
            <label htmlFor="projectCity" className={labelCls}>{ox.fieldProjectCity}{req}</label>
            <input id="projectCity" name="projectCity" type="text" required className={inputCls} />
          </div>
          <div>
            <label htmlFor="investmentNeed" className={labelCls}>{ox.fieldInvestmentNeed}{req}</label>
            <select id="investmentNeed" name="investmentNeed" required defaultValue="" className={inputCls}>
              <option value="" disabled>{ox.selectPlaceholder}</option>
              {ox.investmentNeeds.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sector" className={labelCls}>{ox.fieldSector}{req}</label>
            <input id="sector" name="sector" type="text" required className={inputCls} />
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor="projectDescription" className={labelCls}>{ox.fieldDescription}{req}</label>
          <textarea id="projectDescription" name="projectDescription" rows={6} required placeholder={ox.descPlaceholder} className={inputCls} />
        </div>
      </section>

      {/* 4. كلمة المرور */}
      <section className="rounded-[2rem] bg-[#f7f1e7] p-5 md:p-6">
        <h3 className="mb-5 text-xl font-black">{ox.secPassword}</h3>
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

      {/* 5. الإقرار + الإرسال */}
      <section className="rounded-[2rem] bg-[#171717] p-5 text-white md:p-6">
        <h3 className="mb-5 text-xl font-black">{ox.secConsent}{req}</h3>
        <div className="grid gap-4">
          {ox.consents.map((c, i) => (
            <label key={i} className="flex gap-3 leading-8 text-white/80">
              <input type="checkbox" name={i === 1 ? "privacy" : undefined} value="1" required className="mt-2 shrink-0" />
              <span>{c}</span>
            </label>
          ))}
        </div>
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
