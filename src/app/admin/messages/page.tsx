// لوحة الإدارة: مركز المراسلة الداخلي الموحّد — قائمة كل المحادثات مع تصفية.
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { requirePageCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { getLocale } from "@/lib/i18n-server";
import { tm, STATUS_TONE, RECIPIENT_ROLES, THREAD_STATUSES } from "@/lib/internal-msg";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

const selectCls = "border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-baraka";

export default async function AdminInternalMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; q?: string }>;
}) {
  await requirePageCapability("messages");
  const locale = await getLocale();
  const sp = await searchParams;
  const t = (k: string) => tm(locale, k);

  const where: Prisma.InternalThreadWhereInput = {};
  if (sp.type && (RECIPIENT_ROLES as string[]).includes(sp.type)) where.recipientRole = sp.type;
  if (sp.status && (THREAD_STATUSES as readonly string[]).includes(sp.status)) {
    where.status = sp.status as Prisma.EnumInternalThreadStatusFilter["equals"];
  }
  const q = (sp.q ?? "").trim();
  if (q) {
    where.OR = [
      { subject: { contains: q, mode: "insensitive" } },
      { recipientUser: { fullName: { contains: q, mode: "insensitive" } } },
    ];
  }

  const threads = await prisma.internalThread.findMany({
    where,
    orderBy: { lastMessageAt: "desc" },
    take: 300,
    include: { recipientUser: { select: { fullName: true } } },
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t("admin.title")}</h1>
          <p className="text-gray-500 text-sm">{t("admin.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/messages/templates" className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            {t("admin.templates")}
          </Link>
          <Link href="/admin/messages/new" className="rounded-lg bg-baraka text-white px-5 py-2.5 text-sm font-medium hover:bg-baraka-dark transition">
            {t("admin.new")}
          </Link>
        </div>
      </div>

      {/* تصفية */}
      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <select name="type" defaultValue={sp.type ?? ""} className={selectCls}>
          <option value="">{t("admin.filterAllTypes")}</option>
          {RECIPIENT_ROLES.map((r) => (
            <option key={r} value={r}>{tm(locale, `rolePlural.${r}`)}</option>
          ))}
        </select>
        <select name="status" defaultValue={sp.status ?? ""} className={selectCls}>
          <option value="">{t("admin.filterAllStatuses")}</option>
          {THREAD_STATUSES.map((s) => (
            <option key={s} value={s}>{tm(locale, `status.${s}`)}</option>
          ))}
        </select>
        <input name="q" defaultValue={sp.q ?? ""} placeholder={t("admin.search")} className={`${selectCls} flex-1 min-w-[180px]`} />
        <button type="submit" className="rounded-lg bg-gray-800 text-white px-4 py-2 text-sm hover:bg-gray-900 transition">
          {locale === "ar" ? "تصفية" : "Filter"}
        </button>
      </form>

      {threads.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-4">{t("admin.empty")}</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {threads.map((th) => (
            <Link key={th.id} href={`/admin/messages/${th.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-gray-50">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {th.adminUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-baraka" aria-hidden="true" />}
                  <span className="font-medium text-gray-800 truncate">{th.subject}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {th.recipientUser?.fullName ?? "—"} · {tm(locale, `role.${th.recipientRole}`)} · {tm(locale, `cat.${th.category}`)} · <span dir="ltr">{fmt(th.lastMessageAt)}</span>
                </div>
              </div>
              <Badge label={tm(locale, `status.${th.status}`)} tone={STATUS_TONE[th.status] ?? "gray"} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
