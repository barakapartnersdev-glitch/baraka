"use client";
// بوّابة الوكيل: نموذجا بيانات الاتصال وتغيير كلمة المرور.
import { useActionState } from "react";
import { type Locale } from "@/lib/i18n";
import { tg } from "@/lib/agent-portal-i18n";
import { updateAgentProfile, changeAgentPassword, type ProfileState } from "./actions";

const initial: ProfileState = {};
const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

export function ContactForm({
  locale,
  phone,
  whatsapp,
  linkedinUrl,
  websiteUrl,
  companyUrl,
}: {
  locale: Locale;
  phone: string;
  whatsapp: string;
  linkedinUrl: string;
  websiteUrl: string;
  companyUrl: string;
}) {
  const [state, action, pending] = useActionState(updateAgentProfile, initial);
  const t = (k: string) => tg(locale, k);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="ap-phone" className={labelCls}>{t("profile.phone")}</label>
        <input id="ap-phone" name="phone" type="tel" defaultValue={phone} required dir="ltr" className={inputCls} />
      </div>
      <div>
        <label htmlFor="ap-wa" className={labelCls}>{t("profile.whatsapp")}</label>
        <input id="ap-wa" name="whatsapp" type="tel" defaultValue={whatsapp} dir="ltr" className={inputCls} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input name="linkedinUrl" type="url" defaultValue={linkedinUrl} dir="ltr" placeholder="LinkedIn" className={inputCls} />
        <input name="websiteUrl" type="url" defaultValue={websiteUrl} dir="ltr" placeholder="Website" className={inputCls} />
        <input name="companyUrl" type="url" defaultValue={companyUrl} dir="ltr" placeholder="Company" className={inputCls} />
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state.ok && <p className="text-sm text-green-700">{t("profile.saved")}</p>}
      <div>
        <button type="submit" disabled={pending} className="bg-baraka text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60">
          {t("profile.save")}
        </button>
      </div>
    </form>
  );
}

export function PasswordForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(changeAgentPassword, initial);
  const t = (k: string) => tg(locale, k);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="ap-current" className={labelCls}>{t("profile.password.current")}</label>
        <input id="ap-current" name="current" type="password" required dir="ltr" className={inputCls} />
      </div>
      <div>
        <label htmlFor="ap-new" className={labelCls}>{t("profile.password.new")}</label>
        <input id="ap-new" name="new" type="password" required dir="ltr" className={inputCls} />
      </div>
      <div>
        <label htmlFor="ap-confirm" className={labelCls}>{t("profile.password.confirm")}</label>
        <input id="ap-confirm" name="confirm" type="password" required dir="ltr" className={inputCls} />
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state.ok && <p className="text-sm text-green-700">{t("profile.password.changed")}</p>}
      <div>
        <button type="submit" disabled={pending} className="bg-baraka text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60">
          {t("profile.password.change")}
        </button>
      </div>
    </form>
  );
}
