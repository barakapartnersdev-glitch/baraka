// بوّابة الوكيل: تفاصيل أصل مقدّم (للقراءة + ملفات + ملاحظات الإدارة المسموح بها).
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";
import { labelFor, submissionStatusBadge, ASSET_TYPES, ASSET_STATUSES, OFFER_TYPES, RELATIONSHIP_TYPES } from "@/lib/agent";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value || value === "—") return null;
  return (
    <div className="flex flex-col gap-0.5 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
}

export default async function AgentAssetDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const { id } = await params;
  const t = (k: string) => tg(locale, k);

  const asset = await prisma.assetAgentSubmittedAsset.findFirst({
    where: { id, agentUserId: session.userId },
    include: { files: { orderBy: { createdAt: "asc" } } },
  });
  if (!asset) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/agent/assets" className="text-sm text-gray-500 hover:text-gray-700">{t("assets.title")}</Link>
      <div className="mt-2 mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">{asset.title}</h1>
        <Badge {...submissionStatusBadge(locale, asset.status)} />
      </div>

      <section className="bg-white border border-gray-200 rounded-xl p-5">
        <Row label={t("assets.f.assetType")} value={labelFor(ASSET_TYPES, asset.assetType, locale)} />
        <Row label={t("assets.f.assetStatus")} value={labelFor(ASSET_STATUSES, asset.assetStatus, locale)} />
        <Row label={t("assets.f.offerType")} value={labelFor(OFFER_TYPES, asset.offerType, locale)} />
        <Row label={t("assets.f.country")} value={asset.country} />
        <Row label={t("assets.f.city")} value={asset.city} />
        <Row label={t("assets.f.estimatedValue")} value={asset.estimatedValue} />
        <Row label={t("assets.f.requiredFinancing")} value={asset.requiredFinancing} />
        <Row label={t("assets.f.relationship")} value={labelFor(RELATIONSHIP_TYPES, asset.agentRelationshipToOwner, locale)} />
        <Row label={t("assets.f.shortDescription")} value={asset.shortDescription} />
        <Row label={t("assets.f.additionalNotes")} value={asset.additionalNotes} />
        {asset.adminNotes && <Row label={t("assets.detail.adminNotes")} value={asset.adminNotes} />}
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-5 mt-5">
        <h2 className="font-bold text-baraka-dark mb-3">{t("assets.detail.files")}</h2>
        {asset.files.length === 0 ? (
          <p className="text-sm text-gray-400">{t("assets.detail.noFiles")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {asset.files.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-700 truncate" dir="ltr">{f.fileName}</span>
                <a href={`/api/agent-files/${f.id}`} target="_blank" rel="noopener noreferrer" className="text-baraka hover:underline shrink-0">
                  {t("contract.download")}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
