"use client";
// بوّابة السفير: نموذجا تحديث بيانات الاتصال وتغيير كلمة المرور.
import { useActionState } from "react";
import { ta } from "@/lib/ambassador-i18n";
import { type Locale } from "@/lib/i18n";
import { updateProfile, changePassword, type ProfileState } from "./actions";

const initial: ProfileState = {};
const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

export function ContactForm({
  locale,
  fullName,
  phone,
}: {
  locale: Locale;
  fullName: string;
  phone: string;
}) {
  const [state, action, pending] = useActionState(updateProfile, initial);
  const t = (k: string) => ta(locale, k);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="p-name" className={labelCls}>{t("f.fullName")}</label>
        <input id="p-name" name="fullName" type="text" defaultValue={fullName} required className={inputCls} />
      </div>
      <div>
        <label htmlFor="p-phone" className={labelCls}>{t("f.phone")}</label>
        <input id="p-phone" name="phone" type="tel" defaultValue={phone} dir="ltr" className={inputCls} />
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
  const [state, action, pending] = useActionState(changePassword, initial);
  const t = (k: string) => ta(locale, k);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="p-current" className={labelCls}>{t("profile.password.current")}</label>
        <input id="p-current" name="current" type="password" required dir="ltr" className={inputCls} />
      </div>
      <div>
        <label htmlFor="p-new" className={labelCls}>{t("profile.password.new")}</label>
        <input id="p-new" name="new" type="password" required dir="ltr" className={inputCls} />
      </div>
      <div>
        <label htmlFor="p-confirm" className={labelCls}>{t("profile.password.confirm")}</label>
        <input id="p-confirm" name="confirm" type="password" required dir="ltr" className={inputCls} />
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
