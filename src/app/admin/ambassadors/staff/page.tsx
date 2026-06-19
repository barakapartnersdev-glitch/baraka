// لوحة الإدارة: إدارة صلاحيات الموظفين (SUPER_ADMIN فقط).
import Link from "next/link";
import type { AdminRole } from "@prisma/client";
import { requirePageCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import StaffRoleSelect from "./StaffRoleSelect";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  await requirePageCapability("staff");
  const locale = await getLocale();
  const t = (k: string) => ta(locale, k);

  // قبل تطبيق هجرة adminRole قد يفشل الاستعلام — نعرض حينها قائمة فارغة بدل خطأ.
  const admins = await prisma.user
    .findMany({
      where: { role: "ADMIN" },
      select: { id: true, fullName: true, email: true, adminRole: true },
      orderBy: { createdAt: "asc" },
    })
    .catch(() => [] as { id: string; fullName: string; email: string; adminRole: AdminRole | null }[]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t("staff.title")}</h1>
          <p className="text-gray-500 text-sm">{t("staff.subtitle")}</p>
        </div>
        <Link href="/admin/ambassadors" className="text-sm text-gray-500 hover:text-gray-700">
          {t("nav.ambassadors")}
        </Link>
      </div>

      {admins.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">{t("staff.empty")}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-medium text-start">{t("staff.col.name")}</th>
                <th className="p-3 font-medium text-start">{t("staff.col.email")}</th>
                <th className="p-3 font-medium text-start">{t("staff.col.role")}</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-t border-gray-100">
                  <td className="p-3 font-medium text-gray-800">{a.fullName}</td>
                  <td className="p-3 text-gray-500" dir="ltr">{a.email}</td>
                  <td className="p-3">
                    <StaffRoleSelect userId={a.id} locale={locale} role={a.adminRole ?? "SUPER_ADMIN"} />
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
