import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleActive } from "./actions";

export const dynamic = "force-dynamic";

const LOCALE_LABEL: Record<string, string> = { ar: "ع", en: "EN", tr: "TR", zh: "中" };

export default async function AdminDestinations() {
  const destinations = await prisma.destination.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    include: {
      translations: { select: { locale: true, slug: true } },
      _count: { select: { crmLeads: true, opportunities: true } },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة صفحات وجهات الاستثمار</h1>
          <p className="mt-1 text-sm text-gray-500">
            صفحات «استثمر في &lt;دولة&gt;» متعددة اللغات — المحتوى وSEO قابلان للتحرير لكل لغة.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/destinations/leads"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            الطلبات الواردة
          </Link>
          <Link
            href="/admin/destinations/new"
            className="rounded-lg bg-baraka px-4 py-2 text-sm font-bold text-white hover:bg-baraka-dark"
          >
            + وجهة جديدة
          </Link>
        </div>
      </div>

      {destinations.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
          لا توجد وجهات بعد. ابدأ بإضافة أول دولة.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-right">
              <tr>
                <th className="p-3 font-medium">الترتيب</th>
                <th className="p-3 font-medium">الدولة</th>
                <th className="p-3 font-medium">اللغات</th>
                <th className="p-3 font-medium">الفرص</th>
                <th className="p-3 font-medium">الطلبات</th>
                <th className="p-3 font-medium">الحالة</th>
                <th className="p-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((d) => (
                <tr key={d.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{d.displayOrder}</td>
                  <td className="p-3 font-medium">
                    <Link href={`/admin/destinations/${d.id}`} className="hover:text-baraka">
                      {d.flagEmoji ? `${d.flagEmoji} ` : ""}
                      {d.countryKey}
                    </Link>
                    {d.region && <span className="mr-2 text-xs text-gray-400">({d.region})</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {["ar", "en", "tr", "zh"].map((l) => {
                        const has = d.translations.some((t) => t.locale === l);
                        return (
                          <span
                            key={l}
                            title={has ? "موجودة" : "ناقصة"}
                            className={`rounded px-1.5 py-0.5 text-xs ${
                              has ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {LOCALE_LABEL[l]}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="p-3 text-gray-600">{d._count.opportunities || "—"}</td>
                  <td className="p-3 text-gray-600">{d._count.crmLeads || "—"}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        d.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {d.isActive ? "مفعّلة" : "مخفية"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/destinations/${d.id}`} className="text-xs text-baraka hover:underline">
                        تحرير
                      </Link>
                      <form action={toggleActive}>
                        <input type="hidden" name="id" value={d.id} />
                        <input type="hidden" name="next" value={(!d.isActive).toString()} />
                        <button type="submit" className="text-xs text-gray-500 hover:text-baraka">
                          {d.isActive ? "إخفاء" : "تفعيل"}
                        </button>
                      </form>
                    </div>
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
