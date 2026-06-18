"use client";
// يعلّم الطلب كمقروء تلقائياً عند فتح صفحته (مرّة واحدة) ويسجّل ذلك في النشاط.
import { useEffect, useRef } from "react";
import { markLeadRead } from "../actions";

export default function LeadReadOnMount({ leadId, alreadyRead }: { leadId: string; alreadyRead: boolean }) {
  const done = useRef(false);
  useEffect(() => {
    if (alreadyRead || done.current) return;
    done.current = true;
    markLeadRead(leadId, true).catch(() => {});
  }, [leadId, alreadyRead]);
  return null;
}
