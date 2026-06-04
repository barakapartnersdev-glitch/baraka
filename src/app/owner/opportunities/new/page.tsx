import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getAccountStatus } from "@/lib/account";
import CreateForm from "./CreateForm";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function NewOpportunityPage() {
  const session = await requireRole("PROJECT_OWNER");
  const locale = await getLocale();
  const verified = (await getAccountStatus(session.userId)) === "ACTIVE";

  return (
    <div>
      <Link href="/owner" className="text-sm text-baraka hover:underline">
        {t(locale, "ownerDetail.back")}
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">{t(locale, "newOpp.title")}</h1>

      {verified ? (
        <>
          <p className="text-gray-500 text-sm mb-6">{t(locale, "newOpp.sub")}</p>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <CreateForm locale={locale} />
          </div>
        </>
      ) : (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-4 mt-4">
          {t(locale, "newOpp.pendingNote")}
        </p>
      )}
    </div>
  );
}
