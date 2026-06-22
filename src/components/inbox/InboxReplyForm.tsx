"use client";
// رد المستلم على مراسلة الإدارة (مكوّن مشترك للبوّابات).
import { useActionState, useEffect, useRef } from "react";
import { type Locale } from "@/lib/i18n";
import { tm } from "@/lib/internal-msg";
import { replyToThread, type InboxActionState } from "@/lib/inbox-actions";

export default function InboxReplyForm({ threadId, locale }: { threadId: string; locale: Locale }) {
  const [state, action, pending] = useActionState(replyToThread, {} as InboxActionState);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-2">
      <input type="hidden" name="threadId" value={threadId} />
      <textarea
        name="body"
        rows={3}
        required
        placeholder={tm(locale, "portal.replyPlaceholder")}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-start focus:outline-none focus:border-baraka"
      />
      {state.error && <p className="text-xs text-red-700">{state.error}</p>}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-baraka text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-baraka-dark transition disabled:opacity-60"
        >
          {tm(locale, "portal.reply")}
        </button>
      </div>
    </form>
  );
}
