"use client";
// محرّر قالب بريد واحد (مفتاح + لغة).
import { useActionState } from "react";
import type { Locale } from "@/lib/i18n";
import { ta } from "@/lib/ambassador-i18n";
import { saveAmbassadorTemplate, type ActionResult } from "../actions";

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";

export default function TemplateEditor({
  locale,
  templateKey,
  lang,
  subject,
  body,
  source,
}: {
  locale: Locale;
  templateKey: string;
  lang: string;
  subject: string;
  body: string;
  source: "db" | "builtin";
}) {
  const [state, action, pending] = useActionState(saveAmbassadorTemplate, { ok: false } as ActionResult);

  return (
    <form action={action} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2">
      <input type="hidden" name="templateKey" value={templateKey} />
      <input type="hidden" name="lang" value={lang} />
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-gray-500">{lang}</span>
        <span className={`text-[10px] rounded px-1.5 py-0.5 ${source === "db" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {source === "db" ? ta(locale, "tpl.source.db") : ta(locale, "tpl.source.builtin")}
        </span>
      </div>
      <input name="subject" defaultValue={subject} className={inputCls} placeholder={ta(locale, "tpl.subject")} dir={lang === "ar" ? "rtl" : "ltr"} />
      <textarea name="body" defaultValue={body} rows={5} className={inputCls} dir={lang === "ar" ? "rtl" : "ltr"} />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-baraka text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {ta(locale, "tpl.save")}
        </button>
        {state.ok && <span className="text-xs text-green-700">{ta(locale, "tpl.saved")}</span>}
        {state.error && <span className="text-xs text-red-700">{state.error}</span>}
      </div>
    </form>
  );
}
