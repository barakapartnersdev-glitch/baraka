"use client";
// نموذج تقديم أصل/فرصة — بوّابة الوكيل. مكوّنات الحقول على مستوى الوحدة (تحفظ القيم عند الخطأ).
import { useActionState } from "react";
import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { tg } from "@/lib/agent-portal-i18n";
import { pick, ASSET_TYPES, ASSET_STATUSES, OFFER_TYPES, RELATIONSHIP_TYPES, YES_NO, type Taxon } from "@/lib/agent";
import { submitAsset, type AssetFormState } from "../actions";

const initial: AssetFormState = {};
const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

function Text({ locale, name, labelKey, required }: { locale: Locale; name: string; labelKey: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={`a-${name}`} className={labelCls}>{tg(locale, labelKey)}</label>
      <input id={`a-${name}`} name={name} type="text" required={required} className={inputCls} />
    </div>
  );
}

function Sel({ locale, name, labelKey, list }: { locale: Locale; name: string; labelKey: string; list: Taxon[] }) {
  return (
    <div>
      <label htmlFor={`a-${name}`} className={labelCls}>{tg(locale, labelKey)}</label>
      <select id={`a-${name}`} name={name} defaultValue="" className={inputCls}>
        <option value="" disabled>{tg(locale, "opt.choose")}</option>
        {list.map((t) => <option key={t.code} value={t.code}>{pick(t.label, locale)}</option>)}
      </select>
    </div>
  );
}

export default function AssetForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(submitAsset, initial);
  const t = (k: string) => tg(locale, k);

  if (state.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-green-700 text-3xl mb-2">✓</div>
        <p className="text-sm text-green-700 mb-4">{t("assets.success")}</p>
        <Link href="/agent/assets" className="text-baraka hover:underline text-sm font-medium">{t("assets.title")}</Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3">{t("assets.privacyNote")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><Text locale={locale} name="title" labelKey="assets.f.title" required /></div>
        <Text locale={locale} name="country" labelKey="assets.f.country" />
        <Text locale={locale} name="city" labelKey="assets.f.city" />
        <Sel locale={locale} name="assetType" labelKey="assets.f.assetType" list={ASSET_TYPES} />
        <Sel locale={locale} name="assetStatus" labelKey="assets.f.assetStatus" list={ASSET_STATUSES} />
        <Sel locale={locale} name="offerType" labelKey="assets.f.offerType" list={OFFER_TYPES} />
        <Sel locale={locale} name="relationship" labelKey="assets.f.relationship" list={RELATIONSHIP_TYPES} />
        <Text locale={locale} name="estimatedValue" labelKey="assets.f.estimatedValue" />
        <Text locale={locale} name="requiredFinancing" labelKey="assets.f.requiredFinancing" />
      </div>

      <div>
        <label htmlFor="a-shortDescription" className={labelCls}>{t("assets.f.shortDescription")}</label>
        <textarea id="a-shortDescription" name="shortDescription" rows={3} className={inputCls} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Sel locale={locale} name="hasOwnerPermission" labelKey="assets.f.hasOwnerPermission" list={YES_NO} />
        <Sel locale={locale} name="hasOwnershipDocuments" labelKey="assets.f.hasOwnershipDocuments" list={YES_NO} />
        <Sel locale={locale} name="canArrangeOwnerMeeting" labelKey="assets.f.canArrangeOwnerMeeting" list={YES_NO} />
      </div>

      <div>
        <label htmlFor="a-additionalNotes" className={labelCls}>{t("assets.f.additionalNotes")}</label>
        <textarea id="a-additionalNotes" name="additionalNotes" rows={2} className={inputCls} />
      </div>

      <div>
        <label htmlFor="a-files" className={labelCls}>{t("assets.f.files")} <span className="text-gray-400 font-normal">{t("field.optional")}</span></label>
        <input id="a-files" name="files" type="file" multiple accept=".pdf,.doc,.docx,image/png,image/jpeg" className="text-sm" />
        <p className="text-xs text-gray-400 mt-1">{t("assets.filesHint")}</p>
      </div>

      {state.error && <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{state.error}</p>}

      <div>
        <button type="submit" disabled={pending} className="bg-baraka text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-baraka-dark transition disabled:opacity-60">
          {pending ? t("assets.submitting") : t("assets.submit")}
        </button>
      </div>
    </form>
  );
}
