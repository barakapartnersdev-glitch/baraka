// بوّابة الوكيل: تقديم أصل جديد.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";
import AssetForm from "./AssetForm";

export default async function NewAssetPage() {
  await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  return (
    <div className="max-w-3xl">
      <Link href="/agent/assets" className="text-sm text-gray-500 hover:text-gray-700">{tg(locale, "assets.title")}</Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">{tg(locale, "assets.form.title")}</h1>
      <p className="text-sm text-gray-500 mb-6">{tg(locale, "assets.form.sub")}</p>
      <AssetForm locale={locale} />
    </div>
  );
}
