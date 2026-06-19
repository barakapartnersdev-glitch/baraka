// لوحة الإدارة — تفاصيل طلب «وكيل صاحب أصل».
// ⚠️ يعتمد على نموذج AssetAgentApplication (انظر ASSET_OWNER_AGENTS_INTEGRATION.md).
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { agentUi } from "@/lib/agent-i18n";
import {
  agentStatusBadge,
  labelFor,
  labelsFor,
  pick,
  PROFESSIONAL_TYPES,
  RELATIONSHIP_TYPES,
  ASSET_TYPES,
  REGIONS,
  CONTACT_LANGUAGES,
  YES_NO,
} from "@/lib/agent";
import AgentAdminActions from "./AgentAdminActions";
import AgentManage from "./AgentManage";
import { tg } from "@/lib/agent-portal-i18n";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value == null || value === "" || value === "—") {
    return (
      <div className="flex flex-col gap-0.5 py-2">
        <dt className="text-xs text-gray-400">{label}</dt>
        <dd className="text-sm text-gray-300">—</dd>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-0.5 py-2">
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className="text-sm text-gray-800">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="mb-2 border-b border-gray-100 pb-2 text-sm font-bold text-navy">{title}</h2>
      <dl className="grid gap-x-6 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function YesNo({ v, yes, no }: { v: string | null; yes: string; no: string }) {
  if (v !== "yes" && v !== "no") return <span className="text-gray-300">—</span>;
  return (
    <span className={v === "yes" ? "font-semibold text-emerald-700" : "text-gray-500"}>
      {v === "yes" ? yes : no}
    </span>
  );
}

const ACTION_LABEL: Record<string, { ar: string; en: string; tr: string }> = {
  AGENT_STATUS_CHANGED: { ar: "تغيير الحالة", en: "Status changed", tr: "Durum değişti" },
  AGENT_ASSIGNED: { ar: "إسناد مسؤول", en: "Assignee changed", tr: "Sorumlu atandı" },
  AGENT_NOTE_SAVED: { ar: "حفظ ملاحظات", en: "Notes saved", tr: "Notlar kaydedildi" },
};

export default async function AssetAgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const ui = agentUi(locale);

  const app = await prisma.assetAgentApplication.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, fullName: true } },
      files: { orderBy: { createdAt: "asc" } },
      account: { select: { id: true, status: true } },
      contracts: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!app) notFound();

  const [admins, logs] = await Promise.all([
    prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true, fullName: true }, orderBy: { fullName: "asc" } }),
    prisma.activityLog.findMany({
      where: { entityType: "AssetAgentApplication", entityId: id },
      orderBy: { createdAt: "desc" },
      include: { actor: { select: { fullName: true } } },
      take: 50,
    }),
  ]);

  const yes = labelFor(YES_NO, "yes", locale);
  const no = labelFor(YES_NO, "no", locale);

  const consents: { label: string; ok: boolean }[] = [
    { label: ui.ackAccuracy, ok: app.infoAccuracyAck },
    { label: ui.ackNoRepresentation, ok: app.noRepresentationAck },
    { label: ui.ackPrivacy, ok: app.privacyAccepted },
    { label: ui.ackContact, ok: app.contactConsent },
    { label: ui.ackOwnerConsent, ok: app.ownerConsentAck },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link href="/admin/asset-agents" className="text-sm text-gray-500 hover:text-gold">{ui.back2}</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{app.fullName}</h1>
          <Badge {...agentStatusBadge(locale, app.status)} />
        </div>
      </div>

      {/* لوحة الإجراءات */}
      <AgentAdminActions
        id={app.id}
        locale={locale}
        status={app.status}
        assignedToId={app.assignedTo?.id ?? null}
        admins={admins}
        notes={app.adminNotes ?? ""}
        rejectionReason={app.rejectionReason ?? ""}
      />

      {/* الحساب والعقد (المرحلة 2) */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold text-navy">{tg(locale, "contract.title")}</h2>
        <AgentManage
          id={app.id}
          locale={locale}
          hasAccount={!!app.account}
          accountActive={app.account?.status === "active"}
          contractStatus={app.contracts[0]?.status ?? null}
          contractSentAt={app.contracts[0]?.sentAt ? app.contracts[0].sentAt.toISOString().slice(0, 16).replace("T", " ") : null}
          contractSignedAt={app.contracts[0]?.signedAt ? app.contracts[0].signedAt.toISOString().slice(0, 16).replace("T", " ") : null}
        />
      </section>

      <Section title={ui.secPersonal}>
        <Row label={ui.fNationality} value={app.nationality} />
        <Row label={ui.colCountry} value={app.country} />
        <Row label={ui.fCity} value={app.city} />
        <Row label={ui.fPhone} value={app.phone ? <span dir="ltr">{app.phone}</span> : null} />
        <Row label={ui.fWhatsapp} value={app.whatsapp ? <span dir="ltr">{app.whatsapp}</span> : null} />
        <Row label={ui.fEmail} value={<a href={`mailto:${app.email}`} dir="ltr" className="text-baraka hover:underline">{app.email}</a>} />
        <Row label={ui.fPreferredLang} value={labelFor(CONTACT_LANGUAGES, app.preferredLanguage, locale)} />
        <Row label={ui.registeredAt} value={<span dir="ltr">{app.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span>} />
      </Section>

      <Section title={ui.secProfessional}>
        <Row label={ui.fProfType} value={labelFor(PROFESSIONAL_TYPES, app.professionalType, locale)} />
        {app.professionalTypeOther && <Row label={ui.none} value={app.professionalTypeOther} />}
        <Row label={ui.fExpYears} value={app.experienceYears} />
        <Row label={ui.fExpDesc} value={app.experienceDescription} />
        <Row label={ui.fPrevDeals} value={<YesNo v={app.hasPreviousDeals} yes={yes} no={no} />} />
        <Row label={ui.fPrevDealsDesc} value={app.previousDeals} />
      </Section>

      <Section title={ui.secRelationship}>
        <Row label={ui.fRelationship} value={labelFor(RELATIONSHIP_TYPES, app.relationshipType, locale)} />
        {app.relationshipTypeOther && <Row label={ui.none} value={app.relationshipTypeOther} />}
      </Section>

      <Section title={ui.secCoverage}>
        <Row label={ui.fAssetTypes} value={labelsFor(ASSET_TYPES, app.coveredAssetTypes, locale).join("، ")} />
        {app.coveredAssetTypesOther && <Row label={ui.none} value={app.coveredAssetTypesOther} />}
        <Row label={ui.fRegions} value={labelsFor(REGIONS, app.coveredRegions, locale).join("، ")} />
        {app.coveredRegionsOther && <Row label={ui.none} value={app.coveredRegionsOther} />}
      </Section>

      <Section title={ui.secCapabilities}>
        <Row label={ui.capProvideInfo} value={<YesNo v={app.canProvideInfo} yes={yes} no={no} />} />
        <Row label={ui.capContactOwner} value={<YesNo v={app.canContactOwner} yes={yes} no={no} />} />
        <Row label={ui.capArrangeMeeting} value={<YesNo v={app.canArrangeMeeting} yes={yes} no={no} />} />
        <Row label={ui.capProvideDocs} value={<YesNo v={app.canProvideDocuments} yes={yes} no={no} />} />
        <Row label={ui.capOwnerWants} value={<YesNo v={app.ownerWantsDeal} yes={yes} no={no} />} />
        <Row label={ui.capOwnerPermission} value={<YesNo v={app.hasOwnerPermission} yes={yes} no={no} />} />
      </Section>

      <Section title={ui.secLinks}>
        <Row label={ui.linkLinkedin} value={app.linkedinUrl ? <a href={app.linkedinUrl} target="_blank" rel="noreferrer" dir="ltr" className="text-baraka hover:underline">{app.linkedinUrl}</a> : null} />
        <Row label={ui.linkWebsite} value={app.websiteUrl ? <a href={app.websiteUrl} target="_blank" rel="noreferrer" dir="ltr" className="text-baraka hover:underline">{app.websiteUrl}</a> : null} />
        <Row label={ui.linkCompany} value={app.companyUrl ? <a href={app.companyUrl} target="_blank" rel="noreferrer" dir="ltr" className="text-baraka hover:underline">{app.companyUrl}</a> : null} />
      </Section>

      {/* الإقرارات */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold text-navy">{ui.secConsents}</h2>
        <ul className="flex flex-col gap-2">
          {consents.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${c.ok ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                {c.ok ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 6l12 12M18 6L6 18" /></svg>
                )}
              </span>
              <span className="leading-relaxed text-gray-700">{c.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* الملفات */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold text-navy">{ui.secFiles}</h2>
        {app.files.length === 0 ? (
          <p className="text-sm text-gray-400">{ui.noFiles}</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {app.files.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <a href={`/api/agent-files/${f.id}`} target="_blank" rel="noreferrer" className="truncate text-navy hover:text-gold hover:underline">
                  {f.fileName}
                </a>
                <span className="shrink-0 text-xs text-gray-400">{f.fileSize ? `${Math.round(f.fileSize / 1024)} KB` : ""}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* سجل النشاط */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold text-navy">{ui.secActivity}</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400">{ui.noActivity}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {logs.map((l) => {
              const lbl = ACTION_LABEL[l.action];
              return (
                <li key={l.id} className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span dir="ltr" className="text-gray-400">{l.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span>
                  <span className="font-semibold text-gray-700">{lbl ? pick(lbl, locale) : l.action}</span>
                  {l.actor?.fullName && <span className="text-gray-400">— {l.actor.fullName}</span>}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
