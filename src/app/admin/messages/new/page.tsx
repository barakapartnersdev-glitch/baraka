// لوحة الإدارة: إنشاء رسالة داخلية جديدة لأيّ من الفئات الأربع.
import Link from "next/link";
import { requirePageCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { tm } from "@/lib/internal-msg";
import { resolveTemplatesMap, INTERNAL_TEMPLATE_KEYS } from "@/lib/internal-msg-server";
import ComposeForm from "./ComposeForm";

export const dynamic = "force-dynamic";

export default async function NewMessagePage() {
  await requirePageCapability("messages");
  const locale = await getLocale();

  const recipients = await prisma.user.findMany({
    where: { role: { in: ["AMBASSADOR", "ASSET_OWNER_AGENT", "PROJECT_OWNER", "INVESTOR"] } },
    select: { id: true, fullName: true, email: true, role: true },
    orderBy: { fullName: "asc" },
  });
  const templates = await resolveTemplatesMap();

  return (
    <div>
      <Link href="/admin/messages" className="text-sm text-gray-500 hover:text-gray-700">
        {tm(locale, "admin.title")}
      </Link>
      <h1 className="text-xl font-bold mt-2 mb-5">{tm(locale, "compose.title")}</h1>
      <ComposeForm locale={locale} recipients={recipients} templates={templates} templateKeys={INTERNAL_TEMPLATE_KEYS} />
    </div>
  );
}
