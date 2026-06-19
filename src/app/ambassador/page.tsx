// لوحة سفير الاستثمار — ترحيب، حالة الحساب، إحصاءات الترشيحات، آخر الرسائل، تعليمات.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAmbassadorAccount } from "@/lib/ambassador-account";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { asStringArray } from "@/lib/ambassador-form";

export const dynamic = "force-dynamic";

function Stat({ label, value, href }: { label: string; value: number; href?: string }) {
  const inner = (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-2xl font-bold text-navy">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AmbassadorDashboard() {
  const session = await requireRole("AMBASSADOR");
  const locale = await getLocale();
  const uid = session.userId;
  const t = (k: string) => ta(locale, k);

  const account = await getAmbassadorAccount(uid);

  const [total, review, qualified, closedWon, openMessages, latestMessages] = await Promise.all([
    prisma.ambassadorReferral.count({ where: { ambassadorUserId: uid } }),
    prisma.ambassadorReferral.count({
      where: { ambassadorUserId: uid, status: { in: ["NEW", "UNDER_REVIEW", "NEEDS_INFO"] } },
    }),
    prisma.ambassadorReferral.count({
      where: {
        ambassadorUserId: uid,
        status: { in: ["PRE_QUALIFIED", "INVESTOR_CONTACTED", "MEETING_SCHEDULED", "NEGOTIATING"] },
      },
    }),
    prisma.ambassadorReferral.count({ where: { ambassadorUserId: uid, status: "CLOSED_WON" } }),
    prisma.ambassadorMessage.count({ where: { ambassadorUserId: uid, status: { not: "CLOSED" } } }),
    prisma.ambassadorMessage.findMany({
      where: { ambassadorUserId: uid },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, subject: true, status: true, updatedAt: true },
    }),
  ]);

  const countries = account ? asStringArray(account.allowedCountries) : [];
  const sectors = account ? asStringArray(account.allowedSectors) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {t("dash.welcome")}، {session.fullName}
          </h1>
          <p className="text-sm text-gray-500">{ta(locale, "portal.role")}</p>
        </div>
        <Link
          href="/ambassador/referrals/new"
          className="rounded-lg bg-gradient-to-br from-gold to-gold-soft px-5 py-2.5 text-sm font-bold text-navy transition hover:brightness-110"
        >
          {t("dash.quickReferral")}
        </Link>
      </div>

      {/* الإحصاءات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label={t("dash.referralsTotal")} value={total} href="/ambassador/referrals" />
        <Stat label={t("dash.referralsReview")} value={review} href="/ambassador/referrals" />
        <Stat label={t("dash.referralsQualified")} value={qualified} href="/ambassador/referrals" />
        <Stat label={t("dash.openMessages")} value={openMessages} href="/ambassador/messages" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* آخر الرسائل */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-bold text-baraka-dark mb-3">{t("dash.latestMessages")}</h2>
          {latestMessages.length === 0 ? (
            <p className="text-sm text-gray-400">{t("dash.noMessages")}</p>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-50">
              {latestMessages.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/ambassador/messages/${m.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-baraka"
                  >
                    <span className="text-gray-800 truncate">{m.subject}</span>
                    <span className="text-xs text-gray-400 shrink-0">{ta(locale, `msgStatus.${m.status}`)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* حالة الحساب والنطاق */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-bold text-baraka-dark mb-3">{t("dash.accountStatus")}</h2>
          <p className="text-sm">
            <span
              className={`inline-block rounded-md px-2.5 py-1 text-xs ${
                account?.status === "active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {t(`dash.acc.${account?.status ?? "active"}`)}
            </span>
          </p>
          {account?.startDate && (
            <p className="mt-3 text-xs text-gray-500">
              {t("dash.startDate")}:{" "}
              <span className="text-gray-700" dir="ltr">{account.startDate.toISOString().slice(0, 10)}</span>
            </p>
          )}
          <div className="mt-3">
            <p className="text-xs text-gray-500">{t("dash.allowedCountries")}</p>
            <p className="text-sm text-gray-700">{countries.length ? countries.join("، ") : t("dash.all")}</p>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">{t("dash.allowedSectors")}</p>
            <p className="text-sm text-gray-700">
              {sectors.length ? sectors.map((s) => ta(locale, `opt.sector.${s}`)).join("، ") : t("dash.all")}
            </p>
          </div>
        </div>
      </div>

      {/* تعليمات العمل */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="font-bold text-amber-900 mb-2">{t("dash.instructions")}</h2>
        <p className="text-sm text-amber-800 leading-relaxed">{t("dash.instructionsBody")}</p>
      </div>
    </div>
  );
}
