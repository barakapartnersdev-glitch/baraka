"use client";
// نموذج إنشاء محادثة داخلية (الوكيل).
import { useActionState } from "react";
import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { tg } from "@/lib/agent-portal-i18n";
import { pick, AGENT_MESSAGE_TYPES } from "@/lib/agent";
import { createMessage, type MsgState } from "./actions";

const initial: MsgState = {};
const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka";

export default function NewMessageForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(createMessage, initial);
  const t = (k: string) => tg(locale, k);

  if (state.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-green-700 text-3xl mb-2">✓</div>
        <p className="text-sm text-green-700 mb-4">{t("msg.success")}</p>
        <Link href="/agent/messages" className="text-baraka hover:underline text-sm font-medium">{t("msg.title")}</Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="m-subject" className="block text-sm font-medium text-gray-700 mb-1">{t("msg.subject")}</label>
        <input id="m-subject" name="subject" type="text" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="m-type" className="block text-sm font-medium text-gray-700 mb-1">{t("msg.type")}</label>
        <select id="m-type" name="messageType" defaultValue="general" className={inputCls}>
          {AGENT_MESSAGE_TYPES.map((t2) => <option key={t2.code} value={t2.code}>{pick(t2.label, locale)}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="m-body" className="block text-sm font-medium text-gray-700 mb-1">{t("msg.body")}</label>
        <textarea id="m-body" name="body" rows={5} required className={inputCls} />
      </div>
      {state.error && <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{state.error}</p>}
      <div>
        <button type="submit" disabled={pending} className="bg-baraka text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-baraka-dark transition disabled:opacity-60">
          {t("msg.send")}
        </button>
      </div>
    </form>
  );
}
