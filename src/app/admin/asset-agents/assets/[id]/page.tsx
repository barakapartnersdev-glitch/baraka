// لوحة الإدارة: تفاصيل أصل مقدّم + مراجعة + تحويل إلى فرصة.
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";
import { labelFor, submissionStatusBadge, ASSET_TYPES, ASSET_STATUSES, OFFER_TYPES, RELATIONSHIP_TYPES, YES_NO } from "@/lib/agent";
import AssetReviewPanel from "./AssetReviewPanel";

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

export default async function AdminAssetDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const locale = await getLocale();
  const { id } = await params;
  const t = (k: string) => tg(locale, k);

  const [asset, admins] = await Promise.all([
    prisma.assetAgentSubmittedAsset.findUnique({
      where: { id },
      include: { agentUser: { select: { fullName: true } }, files: { orderBy: { createdAt: "asc" } } },
    }),
    prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true, fullName: true }, orderBy: { fullName: "asc" } }),
  ]);
  if (!asset) notFound();

  return (
    <div>
      <Link href="/admin/asset-agents/assets" className="text-sm text-gray-500 hover:text-gray-700">{t("admin.assets.title")}</Link>
      <div className="mt-2 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{asset.title}</h1>
          <p className="text-sm text-gray-500">{asset.agentUser?.fullName}</p>
        </div>
        <Badge {...submissionStatusBadge(locale, asset.status)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <Row label={t("assets.f.assetType")} value={labelFor(ASSET_TYPES, asset.assetType, locale)} />
              <Row label={t("assets.f.assetStatus")} value={labelFor(ASSET_STATUSES, asset.assetStatus, locale)} />
              <Row label={t("assets.f.offerType")} value={labelFor(OFFER_TYPES, asset.offerType, locale)} />
              <Row label={t("assets.f.country")} value={asset.country} />
              <Row label={t("assets.f.city")} value={asset.city} />
              <Row label={t("assets.f.estimatedValue")} value={asset.estimatedValue} />
              <Row label={t("assets.f.requiredFinancing")} value={asset.requiredFinancing} />
              <Row label={t("assets.f.relationship")} value={labelFor(RELATIONSHIP_TYPES, asset.agentRelationshipToOwner, locale)} />
              <Row label={t("assets.f.hasOwnerPermission")} value={labelFor(YES_NO, asset.hasOwnerPermission, locale)} />
              <Row label={t("assets.f.hasOwnershipDocuments")} value={labelFor(YES_NO, asset.hasOwnershipDocuments, locale)} />
              <Row label={t("assets.f.canArrangeOwnerMeeting")} value={labelFor(YES_NO, asset.canArrangeOwnerMeeting, locale)} />
            </div>
            <Row label={t("assets.f.shortDescription")} value={asset.shortDescription} />
            <Row label={t("assets.f.additionalNotes")} value={asset.additionalNotes} />
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-baraka-dark mb-3">{t("assets.detail.files")}</h2>
            {asset.files.length === 0 ? (
              <p className="text-sm text-gray-400">{t("assets.detail.noFiles")}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {asset.files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-700 truncate" dir="ltr">{f.fileName}</span>
                    <a href={`/api/agent-files/${f.id}`} target="_blank" rel="noopener noreferrer" className="text-baraka hover:underline shrink-0">{t("contract.download")}</a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
            <h2 className="font-bold text-baraka-dark mb-4">{t("admin.assets.title")}</h2>
            <AssetReviewPanel
              id={asset.id}
              locale={locale}
              status={asset.status}
              assigneeId={asset.assignedToId}
              notes={asset.adminNotes ?? ""}
              admins={admins}
              convertedOpportunityId={asset.convertedOpportunityId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
