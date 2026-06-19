// لوحة الإدارة: تفاصيل طلب سفير استثمار — بيانات المتقدّم والخبرة والملفات والسجل وأدوات الإدارة.
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePageCapability, getAdminRole } from "@/lib/admin-guard";
import { roleHasCapability, type Capability } from "@/lib/admin-roles";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";
import { ta } from "@/lib/ambassador-i18n";
import { AMB_STATUS_TONE, asStringArray } from "@/lib/ambassador-form";
import { esignConfigured } from "@/lib/esign";
import ManagePanel from "./ManagePanel";
import CreateAccount from "./CreateAccount";
import ContractPanel from "./ContractPanel";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

// صفّ عرض label/value
function Row({ label, value, ltr }: { label: string; value?: string | null; ltr?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm text-gray-800" dir={ltr ? "ltr" : undefined}>{value}</span>
    </div>
  );
}

export default async function AmbassadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requirePageCapability("view");
  const adminRole = await getAdminRole(session.userId);
  const can = (c: Capability) => roleHasCapability(adminRole, c);
  const locale = await getLocale();
  const { id } = await params;

  const app = await prisma.ambassadorApplication.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { fullName: true } },
      files: { orderBy: { createdAt: "asc" } },
      account: { select: { id: true } },
      contracts: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!app) notFound();
  const contract = app.contracts[0] ?? null;
  const fmtDt = (d: Date | null) => (d ? d.toISOString().slice(0, 16).replace("T", " ") : null);

  const [admins, logs] = await Promise.all([
    prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true, fullName: true } }),
    prisma.ambassadorActivityLog.findMany({
      where: { relatedEntityType: "Application", relatedEntityId: id },
      orderBy: { createdAt: "desc" },
      include: { createdBy: { select: { fullName: true } } },
    }),
  ]);

  const t = (k: string) => ta(locale, k);
  const labelList = (arr: string[], prefix: string) =>
    arr.map((v) => ta(locale, `${prefix}.${v}`)).join("، ");

  const answers = (app.answers ?? {}) as Record<string, string | null>;
  const notes = logs.filter((l) => l.actionType === "note");

  const sectors = labelList(asStringArray(app.coveredSectors), "opt.sector");
  const investorTypes = labelList(asStringArray(app.investorTypes), "opt.investorType");
  const langs = labelList(asStringArray(app.spokenLanguages), "opt.lang");
  const countries = asStringArray(app.coveredCountries).join("، ");

  return (
    <div>
      <Link href="/admin/ambassadors" className="text-sm text-gray-500 hover:text-gray-700">
        {t("admin.back")}
      </Link>

      <div className="mt-3 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{app.fullName}</h1>
          <p className="text-sm text-gray-500" dir="ltr">{app.email}</p>
        </div>
        <Badge label={t(`status.${app.status}`)} tone={AMB_STATUS_TONE[app.status] ?? "gray"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الرئيسي */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* بيانات المتقدّم */}
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-baraka-dark mb-3">{t("admin.detail.applicant")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <Row label={t("f.nationality")} value={app.nationality} />
              <Row label={t("f.residenceCountry")} value={app.residenceCountry} />
              <Row label={t("f.city")} value={app.city} />
              <Row label={t("f.phone")} value={app.phone} ltr />
              <Row label={t("f.whatsapp")} value={app.whatsapp} ltr />
              <Row label={t("f.preferredLanguage")} value={app.preferredLanguage ? t(`opt.lang.${app.preferredLanguage}`) : null} />
              <Row label={t("f.spokenLanguages")} value={langs || null} />
              <Row label={t("f.currentTitle")} value={app.currentTitle} />
              <Row label={t("f.companyName")} value={app.companyName} />
              <Row label={t("f.professionalRole")} value={app.professionalRole} />
              <Row label={t("f.yearsOfExperience")} value={app.yearsOfExperience ? t(`opt.years.${app.yearsOfExperience}`) : null} />
              <Row label={t("f.workType")} value={app.workType ? t(`opt.workType.${app.workType}`) : null} />
              <Row label={t("f.website")} value={app.website} ltr />
              <Row label={t("f.linkedin")} value={app.linkedinUrl} ltr />
              <Row label={t("f.otherLinks")} value={app.otherLinks} ltr />
            </div>
          </section>

          {/* الخبرة والعلاقات */}
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-baraka-dark mb-3">{t("admin.detail.experience")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <Row label={t("f.coveredCountries")} value={countries || null} />
              <Row label={t("f.investorTypes")} value={investorTypes || null} />
              <Row label={t("f.coveredSectors")} value={sectors || null} />
              <Row label={t("f.investmentRange")} value={app.investmentRange ? t(`opt.range.${app.investmentRange}`) : null} />
              <Row label={t("f.relationshipType")} value={app.relationshipType ? t(`opt.relationship.${app.relationshipType}`) : null} />
              <Row label={t("f.previousExperience")} value={app.previousExperience ? t(`opt.yesno.${app.previousExperience}`) : null} />
            </div>
            <Row label={t("f.experienceSummary")} value={app.experienceSummary} />
          </section>

          {/* أسئلة التقييم */}
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-baraka-dark mb-3">{t("admin.detail.evaluation")}</h2>
            <Row label={t("f.motivation")} value={app.motivation} />
            <Row label={t("f.addedValue")} value={app.addedValue} />
            <Row label={t("f.canArrangeMeetings")} value={answers.canArrangeMeetings ? t(`opt.yesno.${answers.canArrangeMeetings}`) : null} />
            <Row label={t("f.negotiationExperience")} value={answers.negotiationExperience ? t(`opt.yesno.${answers.negotiationExperience}`) : null} />
            <Row label={t("f.regionKnowledge")} value={answers.regionKnowledge ? t(`opt.region.${answers.regionKnowledge}`) : null} />
            <Row label={t("f.conflictOfInterest")} value={app.conflictOfInterest} />
          </section>

          {/* الملفات */}
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-baraka-dark mb-3">{t("admin.detail.files")}</h2>
            {app.files.length === 0 ? (
              <p className="text-sm text-gray-400">{t("admin.noFiles")}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {app.files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-700">
                      {f.fileCategory ? `${f.fileCategory} — ` : ""}
                      <span dir="ltr">{f.fileName}</span>
                    </span>
                    <a
                      href={`/api/ambassador-files/${f.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-baraka hover:underline shrink-0"
                    >
                      {t("admin.action.download")}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* الملاحظات وسجل النشاط */}
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-baraka-dark mb-3">{t("admin.detail.log")}</h2>
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400">{t("admin.noNotes")}</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {logs.map((l) => (
                  <li key={l.id} className="text-sm border-b border-gray-50 pb-2 last:border-0">
                    <div className="flex items-center justify-between gap-2 text-xs text-gray-400">
                      <span>{l.actionType === "note" ? t("admin.detail.notes") : l.actionType}</span>
                      <span dir="ltr">{fmt(l.createdAt)}</span>
                    </div>
                    <div className="text-gray-700">
                      {l.description ?? (l.oldValue || l.newValue ? `${l.oldValue ?? "—"} → ${l.newValue ?? "—"}` : "")}
                      {l.createdBy ? <span className="text-gray-400"> — {l.createdBy.fullName}</span> : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* عمود الإدارة */}
        <div className="lg:col-span-1">
          {(can("review") || can("account")) && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
              <h2 className="font-bold text-baraka-dark mb-4">{t("admin.detail.admin")}</h2>
              {can("review") && (
                <ManagePanel
                  id={app.id}
                  locale={locale}
                  status={app.status}
                  score={app.score}
                  assigneeId={app.assignedToId}
                  admins={admins}
                />
              )}
              {can("account") && (
                <div className={can("review") ? "mt-4 pt-4 border-t border-gray-100" : ""}>
                  <CreateAccount id={app.id} locale={locale} hasAccount={!!app.account} />
                </div>
              )}
            </div>
          )}

          {can("contract") && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
              <h2 className="font-bold text-baraka-dark mb-4">{t("contract.title")}</h2>
              <ContractPanel
                id={app.id}
                locale={locale}
                status={contract?.status ?? null}
                sentAt={fmtDt(contract?.sentAt ?? null)}
                signedAt={fmtDt(contract?.signedAt ?? null)}
                esignConfigured={esignConfigured()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
