import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import UserActions from "./UserActions";
import { acctBadge } from "@/lib/states";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function InvestorsPage() {
  const locale = await getLocale();

  const users = await prisma.user.findMany({
    where: { role: { in: ["INVESTOR", "PROJECT_OWNER"] } },
    orderBy: { createdAt: "desc" },
  });

  const pendingCount = users.filter(
    (u) => u.accountStatus === "PENDING_REVIEW"
  ).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{t(locale, "usersList.title")}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {t(locale, "usersList.sub")}
        {pendingCount > 0 && (
          <span className="text-amber-700">
            {" "}
            — {pendingCount} {t(locale, "usersList.pendingSuffix")}
          </span>
        )}
      </p>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-right">
            <tr>
              <th className="p-3 font-medium">{t(locale, "col.name")}</th>
              <th className="p-3 font-medium">{t(locale, "col.role")}</th>
              <th className="p-3 font-medium">{t(locale, "col.email")}</th>
              <th className="p-3 font-medium">{t(locale, "col.acct")}</th>
              <th className="p-3 font-medium">{t(locale, "col.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-medium">
                  {u.role === "INVESTOR" ? (
                    <Link href={`/admin/investors/${u.id}`} className="text-navy hover:text-gold hover:underline">
                      {u.fullName}
                    </Link>
                  ) : (
                    u.fullName
                  )}
                </td>
                <td className="p-3 text-gray-600">
                  {u.role === "INVESTOR" ? t(locale, "role.investor") : t(locale, "role.owner")}
                </td>
                <td className="p-3 text-gray-500 text-xs">{u.email}</td>
                <td className="p-3"><Badge {...acctBadge(locale, u.accountStatus)} /></td>
                <td className="p-3">
                  <UserActions userId={u.id} status={u.accountStatus} locale={locale} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
