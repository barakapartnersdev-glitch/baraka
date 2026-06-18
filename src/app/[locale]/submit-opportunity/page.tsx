import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { tc } from "@/lib/crm-i18n";
import SubmitOpportunityForm from "./SubmitOpportunityForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "اعرض فرصتك الاستثمارية — شركاء البركة" };

export default async function SubmitOpportunityPage() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold text-baraka-dark mb-3">{tc(locale, "submitOpp.title")}</h1>
        <p className="text-gray-600 leading-relaxed mb-8">{tc(locale, "submitOpp.sub")}</p>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
          <SubmitOpportunityForm locale={locale} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
