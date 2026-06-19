// لوحة الإدارة: عرض محادثة سفير + الرد عليها.
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePageCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import AdminReplyForm from "./AdminReplyForm";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export default async function AdminThreadPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePageCapability("messages");
  const locale = await getLocale();
  const { id } = await params;
  const t = (k: string) => ta(locale, k);

  const msg = await prisma.ambassadorMessage.findUnique({
    where: { id },
    include: {
      ambassadorUser: { select: { fullName: true } },
      replies: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!msg) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/ambassadors/messages" className="text-sm text-gray-500 hover:text-gray-700">
        {t("admin.messages.title")}
      </Link>
      <h1 className="text-xl font-bold mt-2 mb-1">{msg.subject}</h1>
      <p className="text-xs text-gray-400 mb-5">
        {msg.ambassadorUser?.fullName} · {t(`msg.type.${msg.messageType}`)}
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {msg.replies.map((r) => {
          const fromAdmin = r.senderRole === "admin";
          return (
            <div
              key={r.id}
              className={`rounded-xl border p-3 text-sm ${
                fromAdmin ? "bg-baraka-light/50 border-baraka/20" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1 text-xs text-gray-400">
                <span className="font-medium text-gray-600">{fromAdmin ? t("msg.admin") : t("msg.ambassador")}</span>
                <span dir="ltr">{fmt(r.createdAt)}</span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{r.body}</p>
            </div>
          );
        })}
      </div>

      <AdminReplyForm messageId={msg.id} locale={locale} />
    </div>
  );
}
