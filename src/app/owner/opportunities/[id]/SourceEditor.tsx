"use client";
import { useState, useTransition } from "react";
import { SOURCE_FIELDS, type SourceData } from "@/lib/opportunity";
import { saveSourceData, submitForReview } from "@/app/owner/actions";
import { t, type Locale } from "@/lib/i18n";

export interface SourceColumns {
  title: string;
  sector: string;
  country: string;
  investmentMin: string;
  investmentMax: string;
}

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-baraka";

export default function SourceEditor({
  id,
  canSubmit,
  initialColumns,
  initialSource,
  locale,
}: {
  id: string;
  canSubmit: boolean;
  initialColumns: SourceColumns;
  initialSource: SourceData;
  locale: Locale;
}) {
  const [cols, setCols] = useState<SourceColumns>(initialColumns);
  const [source, setSource] = useState<SourceData>(initialSource);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await saveSourceData(id, cols, source);
      setMsg(
        res.ok
          ? { ok: true, text: t(locale, "ownerEditor.saved") }
          : { ok: false, text: res.error ?? t(locale, "ownerEditor.saveFailed") }
      );
    });
  }

  function submit() {
    setMsg(null);
    startTransition(async () => {
      // نحفظ أولاً ثم نرسل لضمان وصول آخر التعديلات
      const saved = await saveSourceData(id, cols, source);
      if (!saved.ok) {
        setMsg({
          ok: false,
          text: saved.error ?? t(locale, "ownerEditor.saveBeforeSubmitFailed"),
        });
        return;
      }
      const res = await submitForReview(id);
      setMsg(
        res.ok
          ? { ok: true, text: t(locale, "ownerEditor.submitted") }
          : { ok: false, text: res.error ?? t(locale, "ownerEditor.submitFailed") }
      );
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            {t(locale, "ownerEditor.oppTitle")}
          </label>
          <input
            value={cols.title}
            onChange={(e) => setCols((s) => ({ ...s, title: e.target.value }))}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">{t(locale, "col.sector")}</label>
          <input
            value={cols.sector}
            onChange={(e) => setCols((s) => ({ ...s, sector: e.target.value }))}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">{t(locale, "col.country")}</label>
          <input
            value={cols.country}
            onChange={(e) => setCols((s) => ({ ...s, country: e.target.value }))}
            className={inputCls}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t(locale, "ownerEditor.fundFrom")}
            </label>
            <input
              value={cols.investmentMin}
              inputMode="numeric"
              onChange={(e) =>
                setCols((s) => ({ ...s, investmentMin: e.target.value }))
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t(locale, "ownerEditor.fundTo")}
            </label>
            <input
              value={cols.investmentMax}
              inputMode="numeric"
              onChange={(e) =>
                setCols((s) => ({ ...s, investmentMax: e.target.value }))
              }
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
        {SOURCE_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-sm text-gray-700 mb-1">
              {t(locale, `sfield.${f.key}`)}
            </label>
            {f.textarea ? (
              <textarea
                rows={3}
                value={source[f.key] ?? ""}
                onChange={(e) =>
                  setSource((s) => ({ ...s, [f.key]: e.target.value }))
                }
                className={inputCls}
              />
            ) : (
              <input
                value={source[f.key] ?? ""}
                onChange={(e) =>
                  setSource((s) => ({ ...s, [f.key]: e.target.value }))
                }
                className={inputCls}
              />
            )}
          </div>
        ))}
      </div>

      {msg && (
        <p
          className={`text-sm rounded-lg p-3 ${
            msg.ok
              ? "text-green-700 bg-green-50 border border-green-100"
              : "text-red-700 bg-red-50 border border-red-100"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={pending}
          className="text-sm border border-baraka text-baraka-dark px-5 py-2 rounded-lg hover:bg-baraka-light transition disabled:opacity-50"
        >
          {t(locale, "ownerEditor.save")}
        </button>
        {canSubmit && (
          <button
            onClick={submit}
            disabled={pending}
            className="text-sm bg-baraka text-white px-5 py-2 rounded-lg hover:bg-baraka-dark transition disabled:opacity-50"
          >
            {t(locale, "ownerEditor.submit")}
          </button>
        )}
      </div>
    </div>
  );
}
