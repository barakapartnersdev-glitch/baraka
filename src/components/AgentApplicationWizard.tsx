"use client";
// محرّك نموذج تسجيل «وكيل صاحب الأصل» — 5 أقسام، متعدّد اللغات، إرسال دفعة واحدة.
// نموذج عام (بلا حساب): يجمع الإجابات والملفات في المتصفّح ويرسلها مرة واحدة إلى
// submitAgentApplication التي تنشئ السجل وتخزّن الملفات وتُشعر الإدارة.
import { useMemo, useRef, useState, useTransition } from "react";
import { agentFormPages, type Ans, type Field, type FormPage } from "@/lib/agent-form";
import { agentUi } from "@/lib/agent-i18n";
import type { Locale } from "@/lib/i18n";
import { submitAgentApplication } from "@/app/[locale]/asset-owner-agents/actions";

const MAX_FILE_MB = 10;
const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-baraka focus:outline-none focus:ring-1 focus:ring-baraka/30";

export default function AgentApplicationWizard({ locale }: { locale: Locale }) {
  const ui = agentUi(locale);
  const pages = useMemo(() => agentFormPages(locale), [locale]);
  const [answers, setAnswers] = useState<Ans>({});
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const hp = useRef<HTMLInputElement>(null); // مصيدة سبام

  const total = pages.length;
  const page: FormPage = pages[step];
  const visible = (p: FormPage) => p.fields.filter((f) => !f.showIf || f.showIf(answers));

  function setVal(id: string, v: string | string[]) {
    setAnswers((a) => ({ ...a, [id]: v }));
    setErrs((e) => ({ ...e, [id]: false }));
  }
  function toggle(id: string, v: string) {
    setAnswers((a) => {
      const cur = Array.isArray(a[id]) ? (a[id] as string[]) : [];
      return { ...a, [id]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
    setErrs((e) => ({ ...e, [id]: false }));
  }

  function validate(p: FormPage): boolean {
    const e: Record<string, boolean> = {};
    for (const f of visible(p)) {
      if (f.kind === "info" || !f.required) continue;
      const x = answers[f.id];
      const empty =
        f.kind === "consent"
          ? x !== "yes"
          : Array.isArray(x)
            ? x.length === 0
            : !(x && String(x).trim());
      if (empty) e[f.id] = true;
    }
    setErrs((prev) => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(page)) {
      setMsg(ui.requiredError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setMsg(null);
    setStep((s) => Math.min(s + 1, total - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setMsg(null);
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addFiles() {
    const list = fileRef.current?.files;
    if (!list || list.length === 0) return;
    const next: File[] = [];
    for (const f of Array.from(list)) {
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setMsg(`${f.name}: > ${MAX_FILE_MB}MB`);
        continue;
      }
      next.push(f);
    }
    setFiles((cur) => [...cur, ...next]);
    if (fileRef.current) fileRef.current.value = "";
  }
  function removeFile(i: number) {
    setFiles((cur) => cur.filter((_, idx) => idx !== i));
  }

  function submit() {
    // تحقّق من كل الأقسام؛ اقفز لأول قسم ناقص
    for (let i = 0; i < pages.length; i++) {
      if (!validate(pages[i])) {
        setStep(i);
        setMsg(i === pages.length - 1 ? ui.consentError : ui.requiredError);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }
    const fd = new FormData();
    fd.set("locale", locale);
    fd.set("answers", JSON.stringify(answers));
    fd.set("website", hp.current?.value ?? ""); // مصيدة سبام
    files.forEach((f) => fd.append("files", f));

    start(async () => {
      const r = await submitAgentApplication(fd);
      if (r.ok) {
        setDone(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setMsg(r.error ?? ui.genericError);
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h3 className="mb-1 text-lg font-extrabold text-emerald-900">{ui.successTitle}</h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-emerald-800">{ui.successBody}</p>
      </div>
    );
  }

  const onFiles = !!page.filesStep;

  return (
    <div className="flex flex-col gap-6">
      {/* شريط التقدّم */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-bold text-navy">{page.title}</span>
          <span className="text-gray-500">
            {ui.sectionWord} {step + 1} {ui.ofWord} {total}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-l from-gold to-gold-soft transition-all duration-300"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {msg && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{msg}</p>
      )}

      {/* محتوى القسم */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-navy">{page.title}</h2>
        {page.subtitle && <p className="mt-1 mb-5 text-sm text-gray-500">{page.subtitle}</p>}
        <div className="flex flex-col gap-5">
          {visible(page).map((f) => (
            <FieldView
              key={f.id}
              f={f}
              value={answers[f.id]}
              error={!!errs[f.id]}
              onText={(v) => setVal(f.id, v)}
              onToggle={(v) => toggle(f.id, v)}
            />
          ))}
        </div>

        {onFiles && (
          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="mb-2 text-sm text-gray-500">{ui.filesOptional}</p>
            {files.length > 0 && (
              <ul className="mb-3 divide-y divide-gray-100 rounded-xl border border-gray-200">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 p-3 text-sm">
                    <span className="truncate text-navy">{f.name}</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-xs text-red-600 hover:text-red-700">
                      {ui.remove}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={addFiles}
                className="flex-1 text-sm file:me-3 file:rounded-lg file:border-0 file:bg-baraka-light file:px-3 file:py-1.5 file:text-sm file:text-navy"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">{ui.filesHint}</p>
          </div>
        )}
      </div>

      {/* مصيدة سبام مخفية */}
      <input ref={hp} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0" />

      {/* أزرار التنقّل */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || pending}
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
        >
          {ui.back}
        </button>
        {step < total - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={pending}
            className="rounded-xl bg-navy px-6 py-2.5 text-sm font-bold text-white transition hover:bg-navy-600 disabled:opacity-50"
          >
            {ui.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="rounded-xl bg-gradient-to-br from-gold to-gold-soft px-6 py-2.5 text-sm font-bold text-navy shadow-sm transition hover:brightness-110 disabled:opacity-50"
          >
            {pending ? ui.submitting : ui.submit}
          </button>
        )}
      </div>
    </div>
  );
}

// ===== عرض حقل واحد =====
function FieldView({
  f,
  value,
  error,
  onText,
  onToggle,
}: {
  f: Field;
  value: string | string[] | undefined;
  error: boolean;
  onText: (v: string) => void;
  onToggle: (v: string) => void;
}) {
  if (f.kind === "info") {
    const warn = f.noteTone === "warn";
    return (
      <div className={`rounded-lg border p-3 text-sm leading-relaxed ${warn ? "border-amber-200 bg-amber-50 text-amber-800" : "border-baraka/20 bg-baraka-light text-navy"}`}>
        {f.note}
      </div>
    );
  }

  if (f.kind === "consent") {
    const checked = value === "yes";
    return (
      <button
        type="button"
        onClick={() => onText(checked ? "" : "yes")}
        className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-start text-sm transition ${
          error ? "border-red-300 bg-red-50/40" : checked ? "border-baraka bg-baraka-light text-navy" : "border-gray-200 hover:border-baraka/40 hover:bg-gray-50"
        }`}
      >
        <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${checked ? "border-baraka bg-baraka text-white" : "border-gray-300"}`}>
          {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>}
        </span>
        <span className="leading-relaxed">
          {f.label}
          <span className="text-red-500"> *</span>
        </span>
      </button>
    );
  }

  const v = (value as string) ?? "";
  return (
    <div className={error ? "rounded-lg bg-red-50/30 p-2 -m-2 ring-1 ring-red-300" : ""}>
      <label className="mb-1.5 block text-sm font-semibold text-gray-800">
        {f.label}
        {f.required && <span className="text-red-500"> *</span>}
      </label>

      {f.kind === "textarea" ? (
        <textarea rows={3} value={v} onChange={(e) => onText(e.target.value)} className={inputCls} placeholder={f.placeholder} />
      ) : f.kind === "radio" ? (
        <div className="flex flex-col gap-2">
          {f.options?.map((o) => {
            const sel = v === o.v;
            return (
              <button
                key={o.v}
                type="button"
                onClick={() => onText(o.v)}
                className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-start text-sm transition ${sel ? "border-baraka bg-baraka-light font-semibold text-navy" : "border-gray-200 hover:border-baraka/40 hover:bg-gray-50"}`}
              >
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${sel ? "border-baraka" : "border-gray-300"}`}>
                  {sel && <span className="h-2 w-2 rounded-full bg-baraka" />}
                </span>
                {o.l}
              </button>
            );
          })}
        </div>
      ) : f.kind === "checkbox" ? (
        <div className="flex flex-col gap-2">
          {f.options?.map((o) => {
            const sel = Array.isArray(value) && value.includes(o.v);
            return (
              <button
                key={o.v}
                type="button"
                onClick={() => onToggle(o.v)}
                className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-start text-sm transition ${sel ? "border-baraka bg-baraka-light font-semibold text-navy" : "border-gray-200 hover:border-baraka/40 hover:bg-gray-50"}`}
              >
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${sel ? "border-baraka bg-baraka text-white" : "border-gray-300"}`}>
                  {sel && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>}
                </span>
                {o.l}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          type={f.kind === "email" ? "email" : f.kind === "tel" ? "tel" : f.kind === "url" ? "url" : "text"}
          value={v}
          onChange={(e) => onText(e.target.value)}
          className={inputCls}
          placeholder={f.placeholder}
          dir={f.kind === "email" || f.kind === "tel" || f.kind === "url" ? "ltr" : undefined}
        />
      )}

      {f.help && <p className="mt-1.5 text-xs text-gray-500">{f.help}</p>}
    </div>
  );
}
