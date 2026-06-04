import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import Badge from "@/components/Badge";
import { oppBadge } from "@/lib/states";
import {
  ownerCanEdit,
  ownerCanSubmit,
  SOURCE_FIELDS,
  type SourceData,
} from "@/lib/opportunity";
import SourceEditor from "./SourceEditor";
import OwnerFiles from "./OwnerFiles";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function asSource(value: unknown): SourceData {
  return value && typeof value === "object" ? (value as SourceData) : {};
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
  // حارس الملكية: المالك لا يصل إلا لفرصه
  if (!opp || opp.ownerId !== session.userId) redirect("/owner");

  const editable = ownerCanEdit(opp.state);
  const source = asSource(opp.sourceData);
  const columns = {
    title: opp.title,
    sector: opp.sector,
    country: opp.country,
    investmentMin: opp.investmentMin?.toString() ?? "",
    investmentMax: opp.investmentMax?.toString() ?? "",
  };

  return (
    <div>
      <Link href="/owner" className="text-sm text-baraka hover:underline">
        {t(locale, "ownerDetail.back")}
      </Link>
      <div className="flex items-start justify-between mt-2 mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">{opp.title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {opp.sector} · {opp.country}
          </p>
        </div>
        <Badge {...oppBadge(locale, opp.state)} />
      </div>

      {opp.state === "SUBMITTED" || opp.state === "UNDER_REVIEW" ? (
        <p className="mb-6 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg p-3">
          {t(locale, "ownerDetail.underReview")}
        </p>
      ) : null}

      {opp.missingItems.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-2">
            {t(locale, "ownerDetail.missingTitle")}
            <span className="text-xs font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded mr-2">
              {t(locale, "ownerDetail.missingHint")}
            </span>
          </h2>
          <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {opp.missingItems.map((m) => (
              <li
                key={m.id}
                className="p-3 flex items-center justify-between text-sm"
              >
                <span className={m.resolved ? "line-through text-gray-400" : ""}>
                  {m.description}
                </span>
                <Badge
                  label={m.resolved ? t(locale, "item.resolved") : t(locale, "item.required")}
                  tone={m.resolved ? "green" : "amber"}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-base font-bold mb-3">{t(locale, "ownerEditor.sourceTitle")}</h2>
        {editable ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <SourceEditor
              id={opp.id}
              canSubmit={ownerCanSubmit(opp.state)}
              initialColumns={columns}
              initialSource={source}
              locale={locale}
            />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3 text-sm">
            {SOURCE_FIELDS.map((f) => (
              <div key={f.key}>
                <p className="text-xs text-gray-500 mb-0.5">{t(locale, `sfield.${f.key}`)}</p>
                <p className="text-gray-800 whitespace-pre-wrap">
                  {source[f.key] ?? "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-bold mb-1">{t(locale, "invDetail.docs")}</h2>
        <p className="text-xs text-gray-500 mb-3">{t(locale, "ownerDetail.docsHint")}</p>
        <OwnerFiles
          opportunityId={opp.id}
          editable={editable}
          files={opp.files.map((f) => ({ id: f.id, fileName: f.fileName }))}
          locale={locale}
        />
      </section>
    </div>
  );
}
