"use client";
// رد الإدارة على رسالة وكيل.
import { useActionState, useEffect, useRef } from "react";
import { type Locale } from "@/lib/i18n";
import { tg } from "@/lib/agent-portal-i18n";
import { adminReplyAgentMessage, type AgentMsgState } from "../../actions";

const initial: AgentMsgState = {};

export default function AdminReplyForm({ messageId, locale }: { messageId: string; locale: Locale }) {
  const [state, action, pending] = useActionState(adminReplyAgentMessage, initial);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-2">
      <input type="hidden" name="messageId" value={messageId} />
      <textarea name="body" rows={3} required placeholder={tg(locale, "msg.replyPlaceholder")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka" />
      {state.error && <p className="text-xs text-red-700">{state.error}</p>}
      <div>
        <button type="submit" disabled={pending} className="bg-baraka text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60">
          {tg(locale, "msg.reply")}
        </button>
      </div>
    </form>
  );
}
