import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getAccountStatus } from "@/lib/account";
import { interestBadge } from "@/lib/states";
import { toVersion } from "@/lib/opportunity";
import OpportunityCard, { type OpportunityCardData } from "@/components/OpportunityCard";
import { isInvestorProfileComplete, type Ans } from "@/lib/investor-form";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function fmtRange(min: bigint | null, max: bigint | null, cur: string) {
  if (!min && !max) return null;
  const f = (n: bigint) => Number(n).toLocaleString("en-US");
  return `${min ? f(min) : "?"} – ${max ? f(max) : "?"} ${cur}`;
}

export default async function InvestorHome() {
  const session = await requireRole("INVESTOR");
  const locale = await getLocale();
  const verified = (await getAccountStatus(session.userId)) === "ACTIVE";

  const [opps, myInterests, entity] = await Promise.all([
    prisma.opportunity.findMany({
      where: { state: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        sector: true,
        country: true,
        currency: true,
        investmentMin: true,
        investmentMax: true,
        investorVersion: true,
        publicVersion: true,
      },
    }),
    prisma.interest.findMany({
      where: { investorId: session.userId },
      select: { opportunityId: true, status: true },
    }),
    prisma.investorEntity.findFirst({
      where: { investorId: session.userId },
      orderBy: { createdAt: "asc" },
      select: { profile: true, profileSubmittedAt: true },
    }),
  ]);

  const statusByOpp = new Map(myInterests.map((i) => [i.opportunityId, i.status]));
  const profileAns = (entity?.profile && typeof entity.profile === "object" && !Array.isArray(entity.profile)
    ? entity.profile
    : {}) as Ans;
  const profileComplete = isInvestorProfileComplete(profileAns);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{t(locale, "invHome.title")}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {verified ? t(locale, "invHome.subVerified") : t(locale, "invHome.subPending")}
      </p>

      {!profileComplete && (
        <Link
          href="/investor/profile"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gradient-to-l from-baraka-light to-white p-4 transition hover:border-gold"
        >
          <div>
            <p className="text-sm font-bold text-navy">أكمل توثيق حسابك</p>
            <p className="mt-0.5 text-xs text-gray-500">
              استكمل ملف المستثمر (الهوية والتفضيلات) ليعتمد الفريق حسابك ويتيح لك طلب الاهتمام بالفرص.
            </p>
          </div>
          <span className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white">استكمال التوثيق ←</span>
        </Link>
      )}
      {profileComplete && !verified && (
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
          ملفك مكتمل وقيد مراجعة الإدارة. سيتم تفعيل حسابك بعد الاعتماد.{" "}
          <Link href="/investor/profile" className="font-semibold underline">تحديث الملف</Link>
        </div>
      )}

      {opps.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-6 text-center">
          {t(locale, "invHome.empty")}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {opps.map((o) => {
            const v = verified
              ? toVersion(o.investorVersion) ?? toVersion(o.publicVersion)
              : toVersion(o.publicVersion);
            const status = statusByOpp.get(o.id);
            const data: OpportunityCardData = {
              id: o.id,
              href: `/investor/opportunities/${o.id}`,
              title: v?.displayTitle || `${t(locale, "opp.inSector")} ${o.sector}`,
              summary: v?.summary,
              sector: o.sector,
              country: o.country,
              range: fmtRange(o.investmentMin, o.investmentMax, o.currency),
              imageUrl: v?.imageUrl ?? null,
              statusBadge: status ? interestBadge(locale, status) : null,
            };
            return <OpportunityCard key={o.id} data={data} locale={locale} />;
          })}
        </div>
      )}
    </div>
  );
}
