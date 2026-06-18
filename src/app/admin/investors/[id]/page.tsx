import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import Badge from "@/components/Badge";
import { acctBadge } from "@/lib/states";
import UserActions from "../UserActions";
import { buildInvestorSections, profileSummary, type Ans } from "@/lib/investor-form";
import { getLocale } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

function asAns(v: unknown): Ans {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Ans) : {};
}

export default async function AdminInvestorDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const locale = await getLocale();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      investorEntities: { orderBy: { createdAt: "asc" } },
      interests: { select: { id: true, status: true } },
    },
  });
  if (!user || user.role !== "INVESTOR") notFound();

  const entity = user.investorEntities[0];
  const answers = asAns(entity?.profile);
  const sections = buildInvestorSections(answers);
  const summary = profileSummary(answers);
  const submitted = !!entity?.profileSubmittedAt;

  return (
    <div>
      <Link href="/admin/investors" className="text-sm text-baraka hover:underline">
        ← قائمة المستخدمين
      </Link>

      <div className="mb-6 mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">{user.fullName}</h1>
          <p className="mt-1 text-sm text-gray-500" dir="ltr">
            {user.email}
            {user.phone ? ` · ${user.phone}` : ""}
          </p>
          {summary && <p className="mt-1 text-sm text-gray-600">{summary}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge {...acctBadge(locale, user.accountStatus)} />
          <UserActions userId={user.id} status={user.accountStatus} locale={locale} />
        </div>
      </div>

      {/* حالة التوثيق */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-3 text-sm">
        <span className="text-gray-500">حالة ملف التوثيق: </span>
        {sections.length === 0 ? (
          <span className="font-semibold text-amber-700">لم يبدأ المستثمر تعبئة ملفه بعد.</span>
        ) : submitted ? (
          <span className="font-semibold text-emerald-700">مُرسَل ومكتمل — جاهز للمراجعة.</span>
        ) : (
          <span className="font-semibold text-blue-700">قيد التعبئة (لم يُرسَل بعد).</span>
        )}
      </div>

      {/* الملف المنظّم */}
      {sections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          لا توجد بيانات ملف بعد.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {sections.map((s) => (
            <section key={s.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <h2 className="border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-bold text-navy">
                {s.title}
              </h2>
              <table className="w-full text-sm">
                <tbody>
                  {s.fields.map((f, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <th className="w-2/5 bg-gray-50/50 px-4 py-2.5 text-start font-medium text-gray-600 align-top">
                        {f.label}
                      </th>
                      <td className="px-4 py-2.5 text-gray-800 whitespace-pre-wrap">{f.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-gray-400">
        بيانات هذا الملف سرّية للإدارة فقط ولا تُكشف لأصحاب المشاريع.
      </p>
    </div>
  );
}
