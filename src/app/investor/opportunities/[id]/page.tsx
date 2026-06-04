import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getAccountStatus } from "@/lib/account";
import VersionView from "@/components/VersionView";
import { toVersion } from "@/lib/opportunity";
import InvestorInterest from "./InvestorInterest";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function InvestorOpportunityDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole("INVESTOR");
  const locale = await getLocale();
  const verified = (await getAccountStatus(session.userId)) === "ACTIVE";
  const { id } = await params;

  // الفرص المنشورة فقط — بلا بيانات مصدر ولا هوية إطلاقاً
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
      investorVersion: true,
      postNcndaVersion: true,
    },
  });
  if (!opp) notFound();

  const interest = await prisma.interest.findUnique({
    where: {
      opportunityId_investorId: { opportunityId: id, investorId: session.userId },
    },
    select: { id: true, status: true },
  });

  const signed = interest?.status === "NCNDA_SIGNED";

  // ملفات ما بعد NCNDA المعتمدة — تُجلب فقط عند التوقيع
  const files = signed
    ? await prisma.opportunityFile.findMany({
        where: { opportunityId: id, visibility: "POST_NCNDA", approved: true },
        select: { id: true, fileName: true },
        orderBy: { createdAt: "asc" },
      })
    : [];

  const publicV = toVersion(opp.publicVersion);
  const investorV = toVersion(opp.investorVersion);
  const postV = toVersion(opp.postNcndaVersion);
  // الحساب المعلّق يرى النسخة العامة فقط حتى اعتماد الإدارة
  const shownV = verified ? investorV ?? publicV : publicV;
  const title = shownV?.displayTitle || `${t(locale, "opp.inSector")} ${opp.sector}`;
  const range =
    opp.investmentMin || opp.investmentMax
      ? `${opp.investmentMin ? Number(opp.investmentMin).toLocaleString("en-US") : "?"} – ${
          opp.investmentMax ? Number(opp.investmentMax).toLocaleString("en-US") : "?"
        } ${opp.currency}`
      : null;

  return (
    <div>
      <Link href="/investor" className="text-sm text-baraka hover:underline">
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

      <section className="mb-6">
        <h2 className="text-base font-bold mb-3">
          {verified ? t(locale, "invDetail.investorDetails") : t(locale, "invDetail.overview")}
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <VersionView data={shownV} locale={locale} />
        </div>
        {!verified && (
          <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3">
            {t(locale, "invDetail.publicOnlyNote")}
          </p>
        )}
      </section>

      {verified && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-3">{t(locale, "invDetail.interestSection")}</h2>
          <InvestorInterest
            opportunityId={opp.id}
            interestId={interest?.id ?? null}
            status={interest?.status ?? null}
            locale={locale}
          />
        </section>
      )}

      {signed && (
        <section>
          <h2 className="text-base font-bold mb-3">
            {t(locale, "invDetail.fullAfterNcnda")}
            <span className="text-xs font-normal text-gray-500 mr-2">
              {t(locale, "invDetail.identityHidden")}
            </span>
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <VersionView data={postV} locale={locale} />
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-bold mb-2">{t(locale, "invDetail.docs")}</h3>
              <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                {files.map((f) => (
                  <li key={f.id} className="p-3 text-sm">
                    <a
                      href={`/api/files/${f.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-baraka hover:underline"
                    >
                      {f.fileName}
                    </a>
                    <span className="text-xs text-gray-400 mr-2">
                      {t(locale, "invDetail.watermarkNote")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
