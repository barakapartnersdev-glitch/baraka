"use client";
// محرّر قالب مراسلة داخلية واحد (مفتاح + لغة).
import { useActionState } from "react";
import type { Locale } from "@/lib/i18n";
import { tm } from "@/lib/internal-msg";
import { saveTemplate, type ActionState } from "../actions";

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";

export default function TemplateEditor({
  locale,
  templateKey,
  lang,
  category,
  subject,
  body,
  source,
}: {
  locale: Locale;
  templateKey: string;
  lang: string;
  category: string;
  subject: string;
  body: string;
  source: "db" | "builtin";
}) {
  const [state, action, pending] = useActionState(saveTemplate, {} as ActionState);

  return (
    <form action={action} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2">
      <input type="hidden" name="templateKey" value={templateKey} />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="category" value={category} />
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-gray-500">{lang}</span>
        <span className={`text-[10px] rounded px-1.5 py-0.5 ${source === "db" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {source === "db" ? tm(locale, "tpl.sourceDb") : tm(locale, "tpl.sourceBuiltin")}
        </span>
      </div>
      <input name="subject" defaultValue={subject} className={inputCls} placeholder={tm(locale, "tpl.subject")} dir={lang === "ar" ? "rtl" : "ltr"} />
      <textarea name="body" defaultValue={body} rows={5} className={inputCls} dir={lang === "ar" ? "rtl" : "ltr"} />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-baraka text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {tm(locale, "tpl.save")}
        </button>
        {state.ok && <span className="text-xs text-green-700">{tm(locale, "tpl.saved")}</span>}
        {state.error && <span className="text-xs text-red-700">{state.error}</span>}
      </div>
    </form>
  );
}
