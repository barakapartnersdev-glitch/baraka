"use client";
// لوحة الردّ الجاهز: اختيار قالب → استبدال العناصر النائبة → تعديل → نسخ / فتح في البريد.
import { useState } from "react";
import { tr } from "@/lib/reply-i18n";
import type { Locale } from "@/lib/i18n";

type Template = { templateKey: string; subject: string; body: string };

function fill(text: string, name: string, opp: string): string {
  return text
    .replaceAll("{{name}}", name || "")
    .replaceAll("{{opportunity}}", opp || "");
}

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-baraka";

export default function LeadReplyPanel({
  locale,
  templates,
  email,
  leadName,
  oppTitle,
}: {
  locale: Locale;
  templates: Template[];
  email: string;
  leadName: string;
  oppTitle: string;
}) {
  const [key, setKey] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  if (templates.length === 0) {
    return <p className="text-sm text-gray-400">{tr(locale, "noTemplates")}</p>;
  }

  function pick(k: string) {
    setKey(k);
    setCopied(false);
    const t = templates.find((x) => x.templateKey === k);
    if (t) {
      setSubject(fill(t.subject, leadName, oppTitle));
      setBody(fill(t.body, leadName, oppTitle));
    } else {
      setSubject("");
      setBody("");
    }
  }

  async function copy() {
    const text = `${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* المتصفّح منع الحافظة — يبقى النص ظاهراً للنسخ اليدوي */
    }
  }

  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <div className="flex flex-col gap-3">
      <select value={key} onChange={(e) => pick(e.target.value)} className={inputCls} dir="auto">
        <option value="">{tr(locale, "chooseTemplate")}</option>
        {templates.map((t) => (
          <option key={t.templateKey} value={t.templateKey}>
            {t.subject}
          </option>
        ))}
      </select>

      {key && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{tr(locale, "subject")}</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} dir="auto" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{tr(locale, "body")}</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className={inputCls} dir="auto" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copy}
              className="text-sm bg-baraka text-white rounded-lg px-4 py-2 hover:bg-baraka-dark transition"
            >
              {copied ? tr(locale, "copied") : tr(locale, "copy")}
            </button>
            <a
              href={mailto}
              className="text-sm bg-baraka-light text-baraka-dark border border-baraka/20 rounded-lg px-4 py-2 hover:bg-baraka-light/70 transition"
            >
              {tr(locale, "openEmail")}
            </a>
          </div>
        </>
      )}
    </div>
  );
}
