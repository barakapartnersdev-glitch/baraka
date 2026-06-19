// بوّابة الوكيل: محادثة جديدة.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";
import NewMessageForm from "../NewMessageForm";

export default async function NewAgentMessagePage() {
  await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  return (
    <div className="max-w-2xl">
      <Link href="/agent/messages" className="text-sm text-gray-500 hover:text-gray-700">{tg(locale, "msg.title")}</Link>
      <h1 className="text-2xl font-bold mt-2 mb-5">{tg(locale, "msg.new")}</h1>
      <NewMessageForm locale={locale} />
    </div>
  );
}
