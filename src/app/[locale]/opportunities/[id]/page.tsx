import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/PublicHeader";
import VersionView from "@/components/VersionView";
import { toVersion } from "@/lib/opportunity";
import { getLocale } from "@/lib/i18n-server";
import { t, localeHref } from "@/lib/i18n";
import Footer from "@/components/Footer";
import InterestLeadForm from "./InterestLeadForm";

export const dynamic = "force-dynamic";

export default async function PublicOpportunityDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();

  // النسخة العامة فقط — لا بيانات مصدر ولا هوية ولا نسخ أخرى
  const opp = await prisma.opportunity.findFirst({
    where: { id, state: "PUBLISHED" },
    select: {
      id: true,
      sector: true,
      country: true,
      currency: true,
      investmentMin: true,
      investmentMax: true,
      publicVersion: true,
    },
  });
  if (!opp) notFound();

  const pv = toVersion(opp.publicVersion);
  const title = pv?.displayTitle || `${t(locale, "opp.inSector")} ${opp.sector}`;
  const range =
    opp.investmentMin || opp.investmentMax
      ? `${opp.investmentMin ? Number(opp.investmentMin).toLocaleString("en-US") : "?"} – ${
          opp.investmentMax ? Number(opp.investmentMax).toLocaleString("en-US") : "?"
        } ${opp.currency}`
      : null;

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="max-w-3xl mx-auto p-6 md:p-8">
        <Link href={localeHref(locale, "/opportunities")} className="text-sm text-baraka hover:underline">
          {t(locale, "opp.back")}
        </Link>
        <h1 className="text-2xl font-bold mt-2 mb-2">{title}</h1>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <span className="bg-gray-100 px-2 py-0.5 rounded">{opp.sector}</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded">{opp.country}</span>
          {range && (
            <span className="bg-baraka-light text-baraka-dark px-2 py-0.5 rounded">
              {range}
            </span>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <VersionView data={pv} locale={locale} />
        </div>

        {/* نموذج طلب الاهتمام العام (CRM) — يلتقط المهتمين كـ leads في لوحة الإدارة */}
        <InterestLeadForm opportunityId={opp.id} locale={locale} />

        {/* تلميح للمستثمر المسجّل */}
        <p className="mt-4 text-center text-xs text-gray-400">
          {t(locale, "opp.loginPrompt")}{" "}
          <Link href="/login" className="text-baraka hover:underline">
            {t(locale, "home.login")}
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
