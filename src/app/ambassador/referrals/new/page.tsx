// بوّابة السفير: صفحة ترشيح مستثمر جديد.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import ReferralForm from "./ReferralForm";

export default async function NewReferralPage() {
  await requireRole("AMBASSADOR");
  const locale = await getLocale();
  return (
    <div className="max-w-3xl">
      <Link href="/ambassador/referrals" className="text-sm text-gray-500 hover:text-gray-700">
        {ta(locale, "ref.title")}
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">{ta(locale, "ref.form.title")}</h1>
      <p className="text-sm text-gray-500 mb-6">{ta(locale, "ref.form.sub")}</p>
      <ReferralForm locale={locale} />
    </div>
  );
}
