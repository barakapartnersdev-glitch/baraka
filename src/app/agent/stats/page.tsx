// لوحة إحصائيات أداء وكيل صاحب الأصل (المرحلة 3) — أصوله المقدّمة وتحويلها ومراسلاته.
// خادم فقط، مقيّدة بـ agentUserId = الجلسة (لا يرى الوكيل بيانات غيره).
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAgentAccount } from "@/lib/agent-account";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";
import { submissionStatusBadge, labelFor, OFFER_TYPES, agentContractStatusBadge } from "@/lib/agent";

export const dynamic = "force-dynamic";

function Tile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-2xl font-bold text-navy">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{label}</div>
      {sub && <div className="mt-0.5 text-[11px] text-gray-400">{sub}</div>}
    </div>
  );
}

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 shrink-0 truncate text-xs text-gray-600" title={label}>{label}</div>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${tone ?? "bg-baraka"}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-8 shrink-0 text-end text-xs font-semibold text-navy">{value}</div>
    </div>
  );
}

export default async function AgentStatsPage() {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const uid = session.userId;
  const t = (k: string) => tg(locale, k);

  const [assets, totalThreads, openThreads, account, contract] = await Promise.all([
    prisma.assetAgentSubmittedAsset.findMany({
      where: { agentUserId: uid },
      select: { status: true, offerType: true },
    }),
    prisma.assetAgentMessage.count({ where: { agentUserId: uid } }),
    prisma.assetAgentMessage.count({ where: { agentUserId: uid, status: { not: "CLOSED" } } }),
    getAgentAccount(uid),
    prisma.assetAgentContract.findFirst({
      where: { application: { userId: uid } },
      orderBy: { createdAt: "desc" },
      select: { status: true },
    }),
  ]);

  const total = assets.length;
  const converted = assets.filter((a) => a.status === "CONVERTED").length;
  const approved = assets.filter((a) => a.status === "APPROVED" || a.status === "CONVERTED").length;
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  // حسب الحالة (الموجودة فقط، تنازلياً)
  const statusCounts = new Map<string, number>();
  for (const a of assets) statusCounts.set(a.status, (statusCounts.get(a.status) ?? 0) + 1);
  const byStatus = [...statusCounts.entries()].sort((a, b) => b[1] - a[1]);
  const maxStatus = byStatus.reduce((m, [, v]) => Math.max(m, v), 0);

  // حسب نوع العرض
  const offerCounts = new Map<string, number>();
  for (const a of assets) if (a.offerType) offerCounts.set(a.offerType, (offerCounts.get(a.offerType) ?? 0) + 1);
  const byOffer = [...offerCounts.entries()].sort((a, b) => b[1] - a[1]);
  const maxOffer = byOffer.reduce((m, [, v]) => Math.max(m, v), 0);

  const tenureDays = account?.startDate
    ? Math.max(0, Math.floor((Date.now() - account.startDate.getTime()) / 86_400_000))
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{t("stats.title")}</h1>
        <p className="text-sm text-gray-500">{t("stats.sub")}</p>
      </div>

      {/* مسار التحويل */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile label={t("stats.submitted")} value={total} />
        <Tile label={t("stats.approved")} value={approved} />
        <Tile label={t("stats.converted")} value={converted} />
        <Tile label={t("stats.conversionRate")} value={`${conversionRate}%`} />
      </div>

      {total === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          {t("stats.empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 font-bold text-baraka-dark">{t("stats.byStatus")}</h2>
            <div className="flex flex-col gap-2.5">
              {byStatus.map(([s, v]) => (
                <Bar key={s} label={submissionStatusBadge(locale, s).label} value={v} max={maxStatus} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 font-bold text-baraka-dark">{t("stats.byOffer")}</h2>
            {byOffer.length === 0 ? (
              <p className="text-sm text-gray-400">—</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {byOffer.map(([o, v]) => (
                  <Bar key={o} label={labelFor(OFFER_TYPES, o, locale)} value={v} max={maxOffer} tone="bg-gold" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* المراسلات + الحساب */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile label={t("stats.threadsTotal")} value={totalThreads} />
        <Tile label={t("stats.threadsOpen")} value={openThreads} />
        <Tile label={t("stats.tenure")} value={tenureDays ?? "—"} sub={tenureDays != null ? t("stats.days") : undefined} />
        <Tile label={t("stats.contractStatus")} value={contract ? agentContractStatusBadge(locale, contract.status).label : "—"} />
      </div>
    </div>
  );
}
