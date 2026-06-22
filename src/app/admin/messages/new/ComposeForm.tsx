"use client";
// نموذج إنشاء رسالة داخلية — اختيار الفئة/المستلم/القالب وتعبئة الموضوع والنص.
import { useActionState, useMemo, useState } from "react";
import { LOCALES, type Locale } from "@/lib/i18n";
import { tm, RECIPIENT_ROLES, THREAD_CATEGORIES, type RecipientRole } from "@/lib/internal-msg";
import { createThread, type ActionState } from "../actions";

type Recipient = { id: string; fullName: string; email: string; role: string };
type TplMap = Record<string, Record<string, { subject: string; body: string }>>;

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";

export default function ComposeForm({
  locale,
  recipients,
  templates,
  templateKeys,
}: {
  locale: Locale;
  recipients: Recipient[];
  templates: TplMap;
  templateKeys: string[];
}) {
  const [state, action, pending] = useActionState(createThread, {} as ActionState);
  const [type, setType] = useState<RecipientRole>("AMBASSADOR");
  const [recipientId, setRecipientId] = useState("");
  const [lang, setLang] = useState<Locale>(locale);
  const [tpl, setTpl] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const filtered = useMemo(() => recipients.filter((r) => r.role === type), [recipients, type]);
  const recipientName = recipients.find((r) => r.id === recipientId)?.fullName ?? "";

  function applyTemplate(key: string, l: Locale, name: string) {
    if (!key) return;
    const tt = templates[key]?.[l];
    if (!tt) return;
    setSubject(tt.subject.replace(/\{\{fullName\}\}/g, name));
    setBody(tt.body.replace(/\{\{fullName\}\}/g, name));
  }

  const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

  return (
    <form action={action} className="flex flex-col gap-4 max-w-2xl">
      <input type="hidden" name="recipientUserId" value={recipientId} />
      <input type="hidden" name="languageCode" value={lang} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">{tm(locale, "compose.recipientType")}</span>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as RecipientRole);
              setRecipientId("");
            }}
            className={inputCls}
          >
            {RECIPIENT_ROLES.map((r) => (
              <option key={r} value={r}>{tm(locale, `rolePlural.${r}`)}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">{tm(locale, "compose.recipient")}</span>
          <select value={recipientId} onChange={(e) => setRecipientId(e.target.value)} className={inputCls}>
            <option value="">{tm(locale, "compose.recipientPlaceholder")}</option>
            {filtered.map((r) => (
              <option key={r.id} value={r.id}>{r.fullName} — {r.email}</option>
            ))}
          </select>
          {filtered.length === 0 && <span className="text-xs text-amber-700">{tm(locale, "compose.noRecipients")}</span>}
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">{tm(locale, "compose.category")}</span>
          <select name="category" defaultValue="general" className={inputCls}>
            {THREAD_CATEGORIES.map((c) => (
              <option key={c} value={c}>{tm(locale, `cat.${c}`)}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">{tm(locale, "compose.language")}</span>
          <select
            value={lang}
            onChange={(e) => {
              const l = e.target.value as Locale;
              setLang(l);
              applyTemplate(tpl, l, recipientName);
            }}
            className={inputCls}
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">{tm(locale, "compose.template")}</span>
          <select
            value={tpl}
            onChange={(e) => {
              setTpl(e.target.value);
              applyTemplate(e.target.value, lang, recipientName);
            }}
            className={inputCls}
          >
            <option value="">{tm(locale, "compose.templateNone")}</option>
            {templateKeys.map((k) => (
              <option key={k} value={k}>{tm(locale, `tpl.name.${k}`)}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">{tm(locale, "compose.subject")}</span>
        <input name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} dir={dirOf(lang)} required />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">{tm(locale, "compose.body")}</span>
        <textarea name="body" value={body} onChange={(e) => setBody(e.target.value)} rows={8} className={inputCls} dir={dirOf(lang)} required />
      </label>

      <label className="flex items-start gap-2">
        <input type="checkbox" name="emailCopy" defaultChecked className="mt-1" />
        <span className="text-sm text-gray-700">
          {tm(locale, "compose.emailCopy")}
          <br />
          <span className="text-xs text-gray-400">{tm(locale, "compose.emailCopyHint")}</span>
        </span>
      </label>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <div>
        <button
          type="submit"
          disabled={pending || !recipientId}
          className="bg-baraka text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {tm(locale, "compose.send")}
        </button>
      </div>
    </form>
  );
}
