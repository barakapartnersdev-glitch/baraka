"use client";
import { useState, useTransition } from "react";
import {
  VERSION_KEYS,
  VERSION_FIELDS,
  type VersionData,
  type VersionKey,
} from "@/lib/opportunity";
import { saveVersion } from "./actions";
import { t, type Locale } from "@/lib/i18n";

type VersionsMap = Record<VersionKey, VersionData | null>;

function VersionCard({
  id,
  versionKey,
  initial,
  locale,
}: {
  id: string;
  versionKey: VersionKey;
  initial: VersionData | null;
  locale: Locale;
}) {
  const [form, setForm] = useState<VersionData>(initial ?? {});
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const hasContent = Object.values(form).some((v) => String(v ?? "").trim());

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await saveVersion(id, versionKey, form);
      setMsg(
        res.ok
          ? { ok: true, text: t(locale, "version.saved") }
          : { ok: false, text: res.error ?? t(locale, "version.saveFailed") }
      );
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="font-medium text-sm">{t(locale, `vmeta.${versionKey}.title`)}</p>
          <span
            className={`text-xs px-2 py-0.5 rounded-md ${
              hasContent ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {hasContent ? t(locale, "version.ready") : t(locale, "version.notReady")}
          </span>
        </div>
        <p className="text-xs text-gray-500">{t(locale, `vmeta.${versionKey}.note`)}</p>
      </div>

      {VERSION_FIELDS.map((f) => (
        <div key={f.key}>
          <label className="block text-xs text-gray-600 mb-1">{t(locale, `vfield.${f.key}`)}</label>
          {f.textarea ? (
            <textarea
              rows={3}
              value={form[f.key] ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-baraka"
            />
          ) : (
            <input
              type="text"
              value={form[f.key] ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-baraka"
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={pending}
          className="text-sm bg-baraka text-white px-4 py-1.5 rounded-lg hover:bg-baraka-dark transition disabled:opacity-50"
        >
          {pending ? t(locale, "version.saving") : t(locale, "version.saveBtn")}
        </button>
        {msg && (
          <span className={`text-xs ${msg.ok ? "text-green-700" : "text-red-700"}`}>
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}

export default function VersionsEditor({
  id,
  versions,
  locale,
}: {
  id: string;
  versions: VersionsMap;
  locale: Locale;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {VERSION_KEYS.map((key) => (
        <VersionCard
          key={key}
          id={id}
          versionKey={key}
          initial={versions[key]}
          locale={locale}
        />
      ))}
    </div>
  );
}
