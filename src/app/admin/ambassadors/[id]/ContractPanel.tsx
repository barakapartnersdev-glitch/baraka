"use client";
// لوحة العقد: تسجيل الإرسال، تغيير الحالة، رفع النسخة الموقّعة.
import { useActionState, useState, useTransition, useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { ta } from "@/lib/ambassador-i18n";
import { ALL_CONTRACT_STATUSES } from "@/lib/ambassador-form";
import {
  markContractSent,
  setContractStatus,
  uploadSignedContract,
  sendContractForSignature,
  type ActionResult,
} from "../actions";

const selCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-baraka disabled:opacity-60";

export default function ContractPanel({
  id,
  locale,
  status,
  sentAt,
  signedAt,
  esignConfigured,
}: {
  id: string;
  locale: Locale;
  status: string | null;
  sentAt: string | null;
  signedAt: string | null;
  esignConfigured: boolean;
}) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [upState, upAction, upPending] = useActionState(uploadSignedContract, { ok: false } as ActionResult);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (upState.ok) formRef.current?.reset();
  }, [upState]);

  function run(fn: () => Promise<ActionResult>) {
    setErr(null);
    start(async () => {
      const r = await fn();
      if (!r.ok) setErr(r.error ?? ta(locale, "common.actionFailed"));
    });
  }

  if (!status) {
    return (
      <div>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => markContractSent(id))}
          className="w-full bg-baraka text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {ta(locale, "contract.markSent")}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => sendContractForSignature(id))}
          className="mt-2 w-full border border-baraka text-baraka px-4 py-2 rounded-lg text-sm font-medium hover:bg-baraka-light transition disabled:opacity-60"
        >
          {ta(locale, "contract.sendForSignature")}
        </button>
        {!esignConfigured && <p className="text-xs text-gray-400 mt-2">{ta(locale, "contract.esignManualNote")}</p>}
        {err && <p className="text-xs text-red-700 mt-2">{err}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{ta(locale, "contract.status")}</label>
        <select
          className={selCls}
          value={status}
          disabled={pending}
          onChange={(e) => run(() => setContractStatus(id, e.target.value))}
        >
          {ALL_CONTRACT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ta(locale, `contractStatus.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {(sentAt || signedAt) && (
        <div className="text-xs text-gray-500 space-y-0.5">
          {sentAt && <p>{ta(locale, "contract.sentAt")}: <span dir="ltr">{sentAt}</span></p>}
          {signedAt && <p>{ta(locale, "contract.signedAt")}: <span dir="ltr">{signedAt}</span></p>}
        </div>
      )}

      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => sendContractForSignature(id))}
        className="w-full border border-baraka text-baraka px-4 py-2 rounded-lg text-sm font-medium hover:bg-baraka-light transition disabled:opacity-60"
      >
        {ta(locale, "contract.sendForSignature")}
      </button>
      {!esignConfigured && <p className="text-xs text-gray-400 -mt-1">{ta(locale, "contract.esignManualNote")}</p>}

      <form ref={formRef} action={upAction} className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        <input type="hidden" name="applicationId" value={id} />
        <label className="block text-xs font-medium text-gray-500">{ta(locale, "contract.uploadSigned")}</label>
        <input name="file" type="file" accept=".pdf,image/png,image/jpeg" required className="text-sm" />
        <div>
          <button
            type="submit"
            disabled={upPending}
            className="bg-baraka text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
          >
            {upPending ? ta(locale, "contract.uploading") : ta(locale, "contract.upload")}
          </button>
        </div>
        {upState.error && <p className="text-xs text-red-700">{upState.error}</p>}
        {upState.ok && <p className="text-xs text-green-700">{ta(locale, "contract.signedUploaded")}</p>}
      </form>
      <p className="text-xs text-gray-400">{ta(locale, "contract.signedHint")}</p>
      {err && <p className="text-xs text-red-700">{err}</p>}
    </div>
  );
}
