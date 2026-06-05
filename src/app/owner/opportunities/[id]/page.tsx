import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getAccountStatus } from "@/lib/account";
import Badge from "@/components/Badge";
import { oppBadge } from "@/lib/states";
import { ownerCanEdit, ownerCanSubmit, SOURCE_FIELDS, type SourceData } from "@/lib/opportunity";
import type { Ans } from "@/lib/opportunity-form";
import OpportunityWizard from "@/components/wizard/OpportunityWizard";
import OwnerFiles from "./OwnerFiles";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function asSource(value: unknown): SourceData {
  return value && typeof value === "object" ? (value as SourceData) : {};
}
function asAnswers(value: unknown): Ans {
  if (value && typeof value === "object" && "answers" in (value as object)) {
    const a = (value as { answers?: unknown }).answers;
    if (a && typeof a === "object") return a as Ans;
  }
  return {};
}

export default async function OwnerOpportunityDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();
  const { id } = await params;

  const opp = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      missingItems: { orderBy: { createdAt: "asc" } },
      files: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!opp || opp.ownerId !== session.userId) redirect("/owner");

  const editable = ownerCanEdit(opp.state);
  const active = (await getAccountStatus(session.userId)) === "ACTIVE";

  return (
    <div>
      <Link href="/owner" className="text-sm text-baraka hover:underline">
        {t(locale, "ownerDetail.back")}
      </Link>
      <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">{opp.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {opp.sector} · {opp.country}
          </p>
        </div>
        <Badge {...oppBadge(locale, opp.state)} />
      </div>

      {opp.state === "SUBMITTED" || opp.state === "UNDER_REVIEW" ? (
        <p className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          {t(locale, "ownerDetail.underReview")}
        </p>
      ) : null}

      {/* النواقص المطلوبة (تظهر عند طلب الإدارة) */}
      {opp.missingItems.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-base font-bold">
            {t(locale, "ownerDetail.missingTitle")}
            <span className="mr-2 rounded bg-amber-50 px-2 py-0.5 text-xs font-normal text-amber-700">
              {t(locale, "ownerDetail.missingHint")}
            </span>
          </h2>
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {opp.missingItems.map((m) => (
              <li key={m.id} className="flex items-center justify-between p-3 text-sm">
                <span className={m.resolved ? "text-gray-400 line-through" : ""}>{m.description}</span>
                <Badge
                  label={m.resolved ? t(locale, "item.resolved") : t(locale, "item.required")}
                  tone={m.resolved ? "green" : "amber"}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {editable ? (
        // قابلة للتحرير: المعالج معبّأ بالإجابات المحفوظة (استئناف)
        <OpportunityWizard
          initialId={opp.id}
          initialAnswers={asAnswers(opp.sourceData)}
          files={opp.files.map((f) => ({ id: f.id, fileName: f.fileName }))}
          canSubmit={active && ownerCanSubmit(opp.state)}
        />
      ) : (
        // غير قابلة للتحرير: عرض للقراءة
        <>
          <section>
            <h2 className="mb-3 text-base font-bold">{t(locale, "ownerEditor.sourceTitle")}</h2>
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 text-sm">
              {SOURCE_FIELDS.map((f) => {
                const src = asSource(opp.sourceData);
                return (
                  <div key={f.key}>
                    <p className="mb-0.5 text-xs text-gray-500">{t(locale, `sfield.${f.key}`)}</p>
                    <p className="whitespace-pre-wrap text-gray-800">{src[f.key] ?? "—"}</p>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="mt-8">
            <h2 className="mb-1 text-base font-bold">{t(locale, "invDetail.docs")}</h2>
            <p className="mb-3 text-xs text-gray-500">{t(locale, "ownerDetail.docsHint")}</p>
            <OwnerFiles
              opportunityId={opp.id}
              editable={false}
              files={opp.files.map((f) => ({ id: f.id, fileName: f.fileName }))}
              locale={locale}
            />
          </section>
        </>
      )}
    </div>
  );
}
