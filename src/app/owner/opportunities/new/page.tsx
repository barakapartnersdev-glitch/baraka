import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getAccountStatus } from "@/lib/account";
import OpportunityWizard from "@/components/wizard/OpportunityWizard";
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
      <h1 className="mt-2 mb-1 text-2xl font-extrabold text-navy">{t(locale, "newOpp.title")}</h1>

      {verified ? (
        <>
          <p className="mb-6 text-sm text-gray-500">
            عبّئ الأقسام بالتسلسل، يمكنك الحفظ والعودة لاحقاً في أي وقت. أرفق ملفاتك في القسم الأخير ثم أرسل الطلب للمراجعة.
          </p>
          <OpportunityWizard initialId={null} initialAnswers={{}} files={[]} canSubmit />
        </>
      ) : (
        <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
          {t(locale, "newOpp.pendingNote")}
        </p>
      )}
    </div>
  );
}
