import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const LOCALE_LABEL: Record<string, string> = { ar: "عربي", en: "EN", tr: "TR", zh: "中" };

async function getLeads() {
  try {
    return await prisma.crmLead.findMany({
      where: { source: "DESTINATION_PAGE" },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { destination: { select: { countryKey: true, flagEmoji: true } } },
    });
  } catch (e) {
    console.error("[admin destinations leads]", e);
    return [];
  }
}

export default async function DestinationLeads() {
  const leads = await getLeads();

  return (
    <div>
      <Link href="/admin/destinations" className="text-sm text-gray-500 hover:text-baraka">
        → كل الوجهات
      </Link>
      <h1 className="mb-1 mt-3 text-2xl font-bold">الطلبات الواردة من صفحات الوجهات</h1>
      <p className="mb-6 text-sm text-gray-500">
        طلبات نموذج «استثمر في &lt;دولة&gt;» — مصدرها <code className="rounded bg-gray-100 px-1">DESTINATION_PAGE</code> في الـ CRM.
      </p>

      {leads.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
          لا توجد طلبات بعد.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-right">
              <tr>
                <th className="p-3 font-medium">التاريخ</th>
                <th className="p-3 font-medium">الدولة</th>
                <th className="p-3 font-medium">المرسِل</th>
                <th className="p-3 font-medium">القطاع</th>
                <th className="p-3 font-medium">الحجم</th>
                <th className="p-3 font-medium">اللغة</th>
                <th className="p-3 font-medium">الرسالة</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-gray-100 align-top hover:bg-gray-50">
                  <td className="whitespace-nowrap p-3 text-xs text-gray-500">
                    {l.createdAt.toLocaleDateString("en-GB")}
                  </td>
                  <td className="whitespace-nowrap p-3">
                    {l.destination ? `${l.destination.flagEmoji ?? ""} ${l.destination.countryKey}` : "—"}
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{l.fullName}</div>
                    <a href={`mailto:${l.email}`} dir="ltr" className="text-xs text-baraka hover:underline">{l.email}</a>
                    {l.phone && <div dir="ltr" className="text-xs text-gray-500">{l.phone}</div>}
                  </td>
                  <td className="p-3 text-gray-600">{l.sectorInterest ?? "—"}</td>
                  <td className="p-3 text-gray-600">{l.investmentBudget ?? "—"}</td>
                  <td className="p-3 text-xs text-gray-500">{LOCALE_LABEL[l.languageCode] ?? l.languageCode}</td>
                  <td className="max-w-xs p-3 text-xs text-gray-600">
                    <span className="line-clamp-3 whitespace-pre-wrap">{l.message ?? "—"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
