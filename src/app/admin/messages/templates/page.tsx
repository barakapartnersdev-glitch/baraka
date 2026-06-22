// لوحة الإدارة: محرّر قوالب المراسلة الداخلية (4 لغات لكل قالب) — يتجاوز المدمج.
import Link from "next/link";
import { requirePageCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { LOCALES } from "@/lib/i18n";
import { tm } from "@/lib/internal-msg";
import { INTERNAL_TEMPLATES, INTERNAL_TEMPLATE_KEYS } from "@/lib/internal-msg-server";
import TemplateEditor from "./TemplateEditor";

export const dynamic = "force-dynamic";

const KEY_CATEGORY: Record<string, string> = {
  welcome: "general",
  document_request: "documents",
  contract_followup: "contract",
  meeting_invite: "meeting",
  general_notice: "notice",
};

export default async function TemplatesPage() {
  await requirePageCapability("templates");
  const locale = await getLocale();

  const rows = await prisma.internalMessageTemplate.findMany({ where: { templateKey: { in: INTERNAL_TEMPLATE_KEYS } } });
  const dbMap = new Map(rows.map((r) => [`${r.templateKey}:${r.languageCode}`, r]));

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{tm(locale, "tpl.title")}</h1>
          <p className="text-gray-500 text-sm">{tm(locale, "tpl.subtitle")}</p>
        </div>
        <Link href="/admin/messages" className="text-sm text-gray-500 hover:text-gray-700">
          {tm(locale, "admin.title")}
        </Link>
      </div>

      <p className="text-xs text-gray-400 mb-5">{tm(locale, "tpl.varsHint")}</p>

      <div className="flex flex-col gap-8">
        {INTERNAL_TEMPLATE_KEYS.map((key) => (
          <section key={key}>
            <h2 className="font-bold text-baraka-dark mb-3">{tm(locale, `tpl.name.${key}`)}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {LOCALES.map((lang) => {
                const db = dbMap.get(`${key}:${lang}`);
                const builtin = INTERNAL_TEMPLATES[key][lang];
                return (
                  <TemplateEditor
                    key={lang}
                    locale={locale}
                    templateKey={key}
                    lang={lang}
                    category={KEY_CATEGORY[key] ?? "general"}
                    subject={db?.subject ?? builtin.subject}
                    body={db?.body ?? builtin.body}
                    source={db ? "db" : "builtin"}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
