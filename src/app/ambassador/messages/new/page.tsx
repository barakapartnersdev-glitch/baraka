// بوّابة السفير: محادثة جديدة.
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import NewMessageForm from "../NewMessageForm";

export default async function NewMessagePage() {
  await requireRole("AMBASSADOR");
  const locale = await getLocale();
  return (
    <div className="max-w-2xl">
      <Link href="/ambassador/messages" className="text-sm text-gray-500 hover:text-gray-700">
        {ta(locale, "msg.title")}
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-5">{ta(locale, "msg.new")}</h1>
      <NewMessageForm locale={locale} />
    </div>
  );
}
