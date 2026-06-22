import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NewOpportunityForm from "./NewOpportunityForm";

export const dynamic = "force-dynamic";

export default async function NewAdminOpportunity() {
  // الوجهات المفعّلة (لربط الفرصة بصفحة الدولة) — مع الاسم العربي للعرض.
  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    include: {
      translations: {
        where: { locale: "ar" },
        select: { countryName: true, h1Title: true },
      },
    },
  });

  const destOptions = destinations.map((d) => ({
    id: d.id,
    label: d.translations[0]?.countryName || d.translations[0]?.h1Title || d.countryKey,
  }));

  return (
    <div className="max-w-3xl">
      <Link href="/admin/opportunities" className="text-sm text-gray-500 hover:text-baraka">
        → كل الفرص
      </Link>
      <h1 className="mb-1 mt-3 text-2xl font-bold">نشر فرصة استثمارية جديدة</h1>
      <p className="mb-6 text-sm text-gray-500">
        أدخل بيانات الفرصة بالعربية وأرفق صورة. عند الضغط على «ترجمة ونشر» يترجمها الذكاء
        الاصطناعي تلقائياً للإنجليزية والصينية والتركية، وتُنشَر مباشرةً في صفحة الفرص العامة وفي
        صفحة الدولة المرتبطة بها.
      </p>

      <NewOpportunityForm destinations={destOptions} />
    </div>
  );
}
