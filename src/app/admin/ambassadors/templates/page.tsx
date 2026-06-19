// لوحة الإدارة: محرّر قوالب بريد السفراء (يتجاوز القوالب المدمجة).
import Link from "next/link";
import { requirePageCapability } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { LOCALES } from "@/lib/i18n";
import { AMBASSADOR_TEMPLATES } from "@/lib/ambassador-email";
import TemplateEditor from "./TemplateEditor";

export const dynamic = "force-dynamic";

const KEYS = Object.keys(AMBASSADOR_TEMPLATES);

export default async function TemplatesPage() {
  await requirePageCapability("templates");
  const locale = await getLocale();
  const t = (k: string) => ta(locale, k);

  const rows = await prisma.crmEmailTemplate.findMany({ where: { templateKey: { in: KEYS } } });
  const dbMap = new Map(rows.map((r) => [`${r.templateKey}:${r.languageCode}`, r]));

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t("tpl.title")}</h1>
          <p className="text-gray-500 text-sm">{t("tpl.subtitle")}</p>
        </div>
        <Link href="/admin/ambassadors" className="text-sm text-gray-500 hover:text-gray-700">
          {t("nav.ambassadors")}
        </Link>
      </div>

      <p className="text-xs text-gray-400 mb-5">{t("tpl.varsHint")}</p>

      <div className="flex flex-col gap-8">
        {KEYS.map((key) => (
          <section key={key}>
            <h2 className="font-bold text-baraka-dark mb-3">{t(`tpl.name.${key}`)}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {LOCALES.map((lang) => {
                const db = dbMap.get(`${key}:${lang}`);
                const builtin = AMBASSADOR_TEMPLATES[key][lang];
                return (
                  <TemplateEditor
                    key={lang}
                    locale={locale}
                    templateKey={key}
                    lang={lang}
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
