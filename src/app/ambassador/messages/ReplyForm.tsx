"use client";
// نموذج الرد على محادثة (السفير). يُفرَّغ تلقائياً بعد الإرسال الناجح.
import { useActionState, useEffect, useRef } from "react";
import { ta } from "@/lib/ambassador-i18n";
import { type Locale } from "@/lib/i18n";
import { replyMessage, type MsgState } from "./actions";

const initial: MsgState = {};

export default function ReplyForm({ messageId, locale }: { messageId: string; locale: Locale }) {
  const [state, action, pending] = useActionState(replyMessage, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-2">
      <input type="hidden" name="messageId" value={messageId} />
      <textarea
        name="body"
        rows={3}
        required
        placeholder={ta(locale, "msg.replyPlaceholder")}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka"
      />
      {state.error && <p className="text-xs text-red-700">{state.error}</p>}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-baraka text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {ta(locale, "msg.reply")}
        </button>
      </div>
    </form>
  );
}
