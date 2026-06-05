"use client";
import { useState, useTransition } from "react";
import { generateAiReport } from "./ai-actions";

type EvalLang = "ar" | "en" | "tr" | "zh";
interface StoredReport { text: string; at: string; model?: string; lang?: EvalLang }
type EvalMode = "full" | "investor";

const LANGS: { v: EvalLang; label: string }[] = [
  { v: "ar", label: "العربية" },
  { v: "en", label: "English" },
  { v: "tr", label: "Türkçe" },
  { v: "zh", label: "中文" },
];
const LANG_LABEL: Record<EvalLang, string> = { ar: "العربية", en: "English", tr: "Türkçe", zh: "中文" };

export default function AiReport({
  opportunityId,
  initial,
  hasForm,
}: {
  opportunityId: string;
  initial: { full?: StoredReport; investor?: StoredReport };
  hasForm: boolean;
}) {
  const [reports, setReports] = useState(initial);
  const [lang, setLang] = useState<EvalLang>("ar");
  const [pending, startTransition] = useTransition();
  const [busyMode, setBusyMode] = useState<EvalMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(mode: EvalMode) {
    setError(null);
    setBusyMode(mode);
    startTransition(async () => {
      const r = await generateAiReport(opportunityId, mode, lang);
      setBusyMode(null);
      if (r.ok && r.text) {
        setReports((prev) => ({ ...prev, [mode]: { text: r.text!, at: r.at!, lang: r.lang } }));
      } else {
        setError(r.error ?? "تعذّر التوليد.");
      }
    });
  }

  if (!hasForm) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
        تتطلّب هذه الميزة فرصة مُقدّمة عبر نموذج التسجيل التفصيلي.
      </p>
    );
  }

  const cards: { mode: EvalMode; title: string; desc: string; gold?: boolean }[] = [
    { mode: "full", title: "تقرير الإدارة الكامل", desc: "تقييم شامل مع المخاطر والنواقص والتوصية." },
    { mode: "investor", title: "نسخة المستثمر", desc: "عرض تعريفي بلا معلومات حساسة.", gold: true },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* محدّد لغة التقرير */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5">
        <span className="text-sm font-semibold text-gray-600">لغة التقرير:</span>
        <div className="flex flex-wrap gap-1.5">
          {LANGS.map((l) => (
            <button
              key={l.v}
              type="button"
              onClick={() => setLang(l.v)}
              disabled={pending}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
                lang === l.v ? "bg-navy text-white" : "border border-gray-200 text-gray-600 hover:bg-baraka-light"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {cards.map((c) => {
        const rep = reports[c.mode];
        const busy = pending && busyMode === c.mode;
        const rtl = (rep?.lang ?? "ar") === "ar";
        return (
          <div key={c.mode} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-navy/[0.03] px-4 py-2.5">
              <div>
                <h3 className="text-sm font-bold text-navy">{c.title}</h3>
                <p className="text-xs text-gray-500">{c.desc}</p>
              </div>
              <button
                onClick={() => run(c.mode)}
                disabled={pending}
                className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
                  c.gold
                    ? "bg-gradient-to-br from-gold to-gold-soft text-navy hover:brightness-110"
                    : "bg-navy text-white hover:bg-navy-600"
                }`}
              >
                {busy ? "جارٍ التوليد..." : rep ? `إعادة التوليد (${LANG_LABEL[lang]})` : `ولّد التقرير (${LANG_LABEL[lang]})`}
              </button>
            </div>
            {rep ? (
              <div className="p-4">
                <p className="mb-2 text-[11px] text-gray-400">
                  {rep.lang ? `اللغة: ${LANG_LABEL[rep.lang]} · ` : ""}
                  وُلّد في {new Date(rep.at).toLocaleString("ar")}
                  {rep.model ? ` · ${rep.model}` : ""}
                </p>
                <div
                  dir={rtl ? "rtl" : "ltr"}
                  className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-800"
                >
                  {rep.text}
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(rep.text)}
                  className="mt-2 text-xs text-navy hover:text-gold"
                >
                  نسخ النص
                </button>
              </div>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-gray-400">
                {busy ? "جارٍ التوليد..." : "لم يُولَّد تقرير بعد."}
              </p>
            )}
          </div>
        );
      })}
      <p className="text-xs text-gray-400">
        التقارير مُولّدة آلياً بالذكاء الاصطناعي للاسترشاد فقط؛ راجِعها قبل الاعتماد عليها.
      </p>
    </div>
  );
}
