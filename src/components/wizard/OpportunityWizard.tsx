"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FORM_PAGES,
  type Ans,
  type Field,
  type FormPage,
} from "@/lib/opportunity-form";
import { COUNTRIES } from "@/lib/countries";
import {
  saveOpportunityDraft,
  submitForReview,
  uploadOwnerFile,
  deleteOwnerFile,
} from "@/app/owner/actions";

interface FileView { id: string; fileName: string }

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-baraka focus:outline-none focus:ring-1 focus:ring-baraka/30";

export default function OpportunityWizard({
  initialId,
  initialAnswers,
  files: initialFiles,
  canSubmit,
}: {
  initialId: string | null;
  initialAnswers: Ans;
  files: FileView[];
  canSubmit: boolean;
}) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(initialId);
  const [answers, setAnswers] = useState<Ans>(initialAnswers ?? {});
  const [step, setStep] = useState(0);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<FileView[]>(initialFiles ?? []);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalSteps = FORM_PAGES.length + 1; // +1 قسم الملفات والإرسال
  const filesStep = FORM_PAGES.length;
  const onFiles = step === filesStep;
  const page: FormPage | undefined = FORM_PAGES[step];

  function setVal(fid: string, v: string | string[]) {
    setAnswers((a) => ({ ...a, [fid]: v }));
    setErrs((e) => ({ ...e, [fid]: false }));
  }
  function toggle(fid: string, v: string) {
    setAnswers((a) => {
      const cur = Array.isArray(a[fid]) ? (a[fid] as string[]) : [];
      return { ...a, [fid]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
    setErrs((e) => ({ ...e, [fid]: false }));
  }
  const visible = (p: FormPage) => p.fields.filter((f) => !f.showIf || f.showIf(answers));

  function validate(p: FormPage): boolean {
    const e: Record<string, boolean> = {};
    for (const f of visible(p)) {
      if (f.kind === "info" || !f.required) continue;
      const x = answers[f.id];
      const empty = Array.isArray(x) ? x.length === 0 : !(x && String(x).trim());
      if (empty) e[f.id] = true;
    }
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  function save(): Promise<string | null> {
    return new Promise((resolve) => {
      start(async () => {
        const r = await saveOpportunityDraft(id, answers);
        if (r.ok && r.id) {
          setId(r.id);
          resolve(r.id);
        } else {
          setMsg({ t: "err", m: r.error ?? "تعذّر الحفظ." });
          resolve(null);
        }
      });
    });
  }

  async function saveExit() {
    const nid = await save();
    if (nid) router.push("/owner");
  }
  async function next() {
    if (page && !validate(page)) {
      setMsg({ t: "err", m: "يرجى تعبئة الحقول الإلزامية المميّزة بالأحمر." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setMsg(null);
    await save();
    setStep((s) => Math.min(s + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setMsg(null);
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function upload() {
    const f = fileRef.current?.files?.[0];
    if (!f) return;
    let oid = id;
    if (!oid) oid = await save();
    if (!oid) return;
    const fd = new FormData();
    fd.set("file", f);
    start(async () => {
      const r = await uploadOwnerFile(oid!, fd);
      if (r.ok && r.fileId) {
        setFiles((cur) => [...cur, { id: r.fileId!, fileName: r.fileName ?? f.name }]);
        if (fileRef.current) fileRef.current.value = "";
        setMsg(null);
      } else setMsg({ t: "err", m: r.error ?? "تعذّر رفع الملف." });
    });
  }
  function removeFile(fid: string) {
    start(async () => {
      const r = await deleteOwnerFile(fid);
      if (r.ok) setFiles((cur) => cur.filter((x) => x.id !== fid));
      else setMsg({ t: "err", m: r.error ?? "تعذّر الحذف." });
    });
  }

  async function submit() {
    // تحقّق من الموافقات الإلزامية في القسم الأخير
    if (!validate(FORM_PAGES[FORM_PAGES.length - 1])) {
      setMsg({ t: "err", m: "يرجى إكمال الموافقات والإقرار في قسم الخصوصية." });
      return;
    }
    const nid = await save();
    if (!nid) return;
    start(async () => {
      const r = await submitForReview(nid);
      if (r.ok) router.push(`/owner/opportunities/${nid}`);
      else setMsg({ t: "err", m: r.error ?? "تعذّر الإرسال." });
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* شريط التقدّم */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-bold text-navy">
            {onFiles ? "الملفات والإرسال" : page?.title}
          </span>
          <span className="text-gray-500">
            القسم {step + 1} من {totalSteps}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-l from-gold to-gold-soft transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
        {/* نقاط الأقسام */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => i <= step && setStep(i)}
              disabled={i > step}
              aria-label={`القسم ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                i === step ? "bg-gold ring-2 ring-gold/30" : i < step ? "bg-navy/60 cursor-pointer" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {msg && (
        <p
          className={`rounded-lg border p-3 text-sm ${
            msg.t === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {msg.m}
        </p>
      )}

      {/* محتوى القسم */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {!onFiles && page ? (
          <>
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
          </>
        ) : (
          <FilesStep
            files={files}
            pending={pending}
            fileRef={fileRef}
            onUpload={upload}
            onRemove={removeFile}
            canSubmit={canSubmit}
          />
        )}
      </div>

      {/* أزرار التنقّل */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || pending}
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
        >
          ← السابق
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={saveExit}
            disabled={pending}
            className="rounded-xl border border-baraka/40 px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-baraka-light disabled:opacity-50"
          >
            حفظ والعودة لاحقاً
          </button>
          {!onFiles ? (
            <button
              type="button"
              onClick={next}
              disabled={pending}
              className="rounded-xl bg-navy px-6 py-2.5 text-sm font-bold text-white transition hover:bg-navy-600 disabled:opacity-50"
            >
              {pending ? "جارٍ الحفظ..." : "التالي →"}
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={pending || !canSubmit}
              className="rounded-xl bg-gradient-to-br from-gold to-gold-soft px-6 py-2.5 text-sm font-bold text-navy shadow-sm transition hover:brightness-110 disabled:opacity-50"
            >
              {pending ? "جارٍ الإرسال..." : "إرسال الطلب للمراجعة"}
            </button>
          )}
        </div>
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
      <div
        className={`rounded-lg border p-3 text-sm leading-relaxed ${
          warn ? "border-amber-200 bg-amber-50 text-amber-800" : "border-baraka/20 bg-baraka-light text-navy"
        }`}
      >
        {f.note}
      </div>
    );
  }

  const labelEl = (
    <label className="mb-1.5 block text-sm font-semibold text-gray-800">
      {f.label}
      {f.required && <span className="text-red-500"> *</span>}
    </label>
  );
  const v = (value as string) ?? "";

  return (
    <div className={error ? "rounded-lg ring-1 ring-red-300 bg-red-50/30 p-2 -m-2" : ""}>
      {labelEl}
      {f.example && <p className="mb-1.5 text-xs text-gray-400">مثال: {f.example}</p>}

      {f.kind === "textarea" ? (
        <textarea rows={3} value={v} onChange={(e) => onText(e.target.value)} className={inputCls} placeholder={f.placeholder} />
      ) : f.kind === "country" ? (
        <input list="baraka-countries" value={v} onChange={(e) => onText(e.target.value)} className={inputCls} placeholder="اختر دولة..." />
      ) : f.kind === "radio" ? (
        <div className="flex flex-col gap-2">
          {f.options?.map((o) => {
            const sel = v === o.v;
            return (
              <button
                key={o.v}
                type="button"
                onClick={() => onText(o.v)}
                className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-start text-sm transition ${
                  sel ? "border-baraka bg-baraka-light font-semibold text-navy" : "border-gray-200 hover:border-baraka/40 hover:bg-gray-50"
                }`}
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
                className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-start text-sm transition ${
                  sel ? "border-baraka bg-baraka-light font-semibold text-navy" : "border-gray-200 hover:border-baraka/40 hover:bg-gray-50"
                }`}
              >
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${sel ? "border-baraka bg-baraka text-white" : "border-gray-300"}`}>
                  {sel && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                  )}
                </span>
                {o.l}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          type={f.kind === "email" ? "email" : f.kind === "tel" ? "tel" : f.kind === "url" ? "url" : "text"}
          inputMode={f.kind === "number" || f.kind === "percent" || f.kind === "money" ? "numeric" : undefined}
          value={v}
          onChange={(e) => onText(e.target.value)}
          className={inputCls}
          placeholder={f.placeholder ?? (f.kind === "percent" ? "%" : f.kind === "money" ? "USD" : undefined)}
        />
      )}

      {f.help && <p className="mt-1.5 text-xs text-gray-500">{f.help}</p>}
      <datalist id="baraka-countries">
        {COUNTRIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </div>
  );
}

// ===== قسم الملفات والإرسال =====
function FilesStep({
  files,
  pending,
  fileRef,
  onUpload,
  onRemove,
  canSubmit,
}: {
  files: FileView[];
  pending: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onUpload: () => void;
  onRemove: (id: string) => void;
  canSubmit: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-extrabold text-navy">رفع الملفات والوثائق</h2>
      <p className="text-sm text-gray-500">
        ارفع ملفات تعطي صورة كاملة عن المشروع: مستندات (PDF / Word)، صور، ومقاطع فيديو قصيرة. الحد الأقصى لكل ملف 50 ميغابايت.
        تبقى هذه الملفات سرّية لدى الإدارة ولا تُعرض للمستثمرين إلا بقرار إداري.
      </p>

      {files.length > 0 ? (
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3 p-3 text-sm">
              <a href={`/api/files/${f.id}`} target="_blank" rel="noreferrer" className="truncate text-navy hover:text-gold hover:underline">
                {f.fileName}
              </a>
              <button onClick={() => onRemove(f.id)} disabled={pending} className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50">
                حذف
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-400">
          لا ملفات بعد. أضف ملفاتك أدناه.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,image/*,video/mp4,video/quicktime,video/webm"
          className="flex-1 text-sm file:me-3 file:rounded-lg file:border-0 file:bg-baraka-light file:px-3 file:py-1.5 file:text-sm file:text-navy"
        />
        <button
          onClick={onUpload}
          disabled={pending}
          className="rounded-lg bg-navy px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-navy-600 disabled:opacity-50"
        >
          {pending ? "جارٍ الرفع..." : "رفع الملف"}
        </button>
      </div>

      {!canSubmit && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          لا يمكن الإرسال في الحالة الحالية للفرصة.
        </p>
      )}
      <p className="text-xs text-gray-400">
        بالضغط على «إرسال الطلب للمراجعة» تنتقل الفرصة إلى الإدارة لمراجعتها. يمكنك الحفظ والعودة لاحقاً في أي وقت قبل الإرسال.
      </p>
    </div>
  );
}
