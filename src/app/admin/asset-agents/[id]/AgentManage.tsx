"use client";
// لوحة الإدارة: فتح حساب الوكيل + عقد الوكالة (إرسال/حالة/رفع موقّع) + إيقاف.
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import { tg } from "@/lib/agent-portal-i18n";
import { AGENT_CONTRACT_STATUSES, agentContractStatusBadge } from "@/lib/agent";
import {
  createAgentAccount,
  sendAgentContract,
  setAgentContractStatus,
  uploadAgentSignedContract,
  suspendAgentAccount,
  type ActionState,
} from "../actions";

const selCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-baraka disabled:opacity-60";

export default function AgentManage({
  id,
  locale,
  hasAccount,
  accountActive,
  contractStatus,
  contractSentAt,
  contractSignedAt,
}: {
  id: string;
  locale: Locale;
  hasAccount: boolean;
  accountActive: boolean;
  contractStatus: string | null;
  contractSentAt: string | null;
  contractSignedAt: string | null;
}) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [created, setCreated] = useState<{ tempPassword: string; email: string } | null>(null);
  const [upState, upAction, upPending] = useActionState(uploadAgentSignedContract, { ok: false } as ActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (upState.ok) formRef.current?.reset();
  }, [upState]);

  function run(fn: () => Promise<ActionState>) {
    setErr(null);
    start(async () => {
      const r = await fn();
      if (!r.ok) setErr(r.error ?? tg(locale, "common.actionFailed"));
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* العقد */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
        <h3 className="font-bold text-baraka-dark text-sm">{tg(locale, "contract.title")}</h3>
        {!contractStatus ? (
          <button type="button" disabled={pending} onClick={() => run(() => sendAgentContract(id))} className="w-full bg-baraka text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60">
            {tg(locale, "contract.markSent")}
          </button>
        ) : (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{tg(locale, "contract.status")}</label>
              <select className={selCls} value={contractStatus} disabled={pending} onChange={(e) => run(() => setAgentContractStatus(id, e.target.value))}>
                {AGENT_CONTRACT_STATUSES.map((s) => (
                  <option key={s} value={s}>{agentContractStatusBadge(locale, s).label}</option>
                ))}
              </select>
            </div>
            {(contractSentAt || contractSignedAt) && (
              <div className="text-xs text-gray-500 space-y-0.5">
                {contractSentAt && <p>{tg(locale, "contract.sentAt")}: <span dir="ltr">{contractSentAt}</span></p>}
                {contractSignedAt && <p>{tg(locale, "contract.signedAt")}: <span dir="ltr">{contractSignedAt}</span></p>}
              </div>
            )}
            <form ref={formRef} action={upAction} className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <input type="hidden" name="applicationId" value={id} />
              <label className="block text-xs font-medium text-gray-500">{tg(locale, "contract.uploadSigned")}</label>
              <input name="file" type="file" accept=".pdf,image/png,image/jpeg" required className="text-sm" />
              <div>
                <button type="submit" disabled={upPending} className="bg-baraka text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60">
                  {upPending ? tg(locale, "contract.uploading") : tg(locale, "contract.upload")}
                </button>
              </div>
              {upState.ok && <p className="text-xs text-green-700">{tg(locale, "contract.signedUploaded")}</p>}
            </form>
          </>
        )}
      </div>

      {/* الحساب */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
        <h3 className="font-bold text-baraka-dark text-sm">{tg(locale, "admin.createAccount")}</h3>
        {created ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
            <p className="font-bold text-green-800 mb-2">{tg(locale, "admin.accountCreatedTitle")}</p>
            <p className="text-xs text-gray-500">{tg(locale, "admin.accountEmail")}</p>
            <p className="font-mono text-gray-800 mb-2" dir="ltr">{created.email}</p>
            <p className="text-xs text-gray-500">{tg(locale, "admin.tempPassword")}</p>
            <p className="font-mono text-base font-bold text-baraka-dark select-all" dir="ltr">{created.tempPassword}</p>
          </div>
        ) : hasAccount ? (
          <>
            <p className="text-sm text-green-700">{tg(locale, "admin.accountExists")}</p>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => suspendAgentAccount(id, accountActive))}
              className={`text-xs border rounded-lg px-3 py-1.5 disabled:opacity-60 ${accountActive ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "border-green-200 text-green-700 hover:bg-green-50"}`}
            >
              {accountActive ? tg(locale, "dash.acc.suspended") : tg(locale, "dash.acc.active")}
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!window.confirm(tg(locale, "admin.confirmCreate"))) return;
              setErr(null);
              start(async () => {
                const r = await createAgentAccount(id);
                if (!r.ok) setErr(r.error === "need_contracted" ? tg(locale, "admin.needContracted") : r.error ?? tg(locale, "common.actionFailed"));
                else setCreated({ tempPassword: r.tempPassword!, email: r.email! });
              });
            }}
            className="w-full bg-baraka text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
          >
            {tg(locale, "admin.createAccount")}
          </button>
        )}
      </div>

      {err && <p className="lg:col-span-2 text-xs text-red-700">{err}</p>}
    </div>
  );
}
