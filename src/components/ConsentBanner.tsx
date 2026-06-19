"use client";
// شريط موافقة على ملفّات تعريف الارتباط (Consent Mode). يظهر مرة واحدة ويحفظ الاختيار.
// نصوص ذاتية الاحتواء بأربع لغات لتجنّب لمس قاموس i18n المشترك.
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

const TXT: Record<Locale, { msg: string; accept: string; decline: string }> = {
  ar: {
    msg: "نستخدم ملفّات تعريف الارتباط لتحليل استخدام الموقع وتحسين تجربتك.",
    accept: "موافق",
    decline: "رفض",
  },
  en: {
    msg: "We use cookies to analyze site usage and improve your experience.",
    accept: "Accept",
    decline: "Decline",
  },
  tr: {
    msg: "Site kullanımını analiz etmek ve deneyiminizi iyileştirmek için çerez kullanıyoruz.",
    accept: "Kabul et",
    decline: "Reddet",
  },
  zh: {
    msg: "我们使用 Cookie 来分析网站使用情况并改善您的体验。",
    accept: "接受",
    decline: "拒绝",
  },
};

const KEY = "baraka_consent";

function updateConsent(granted: boolean) {
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  const v = granted ? "granted" : "denied";
  const payload = {
    ad_storage: v,
    analytics_storage: v,
    ad_user_data: v,
    ad_personalization: v,
  };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", payload);
  } else {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(["consent", "update", payload]);
  }
}

export default function ConsentBanner({ locale }: { locale: Locale }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {}
    if (stored === "granted") updateConsent(true);
    else if (stored === "denied") updateConsent(false);
    else setShow(true);
  }, []);

  if (!show) return null;
  const tx = TXT[locale] ?? TXT.en;

  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(KEY, granted ? "granted" : "denied");
    } catch {}
    updateConsent(granted);
    setShow(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-gold/30 bg-navy/95 px-5 py-4 text-sm text-[#dbe3ef] backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center sm:text-start">{tx.msg}</p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => choose(false)}
            className="rounded-lg border border-white/25 px-4 py-2 font-medium text-white transition hover:border-white/50"
          >
            {tx.decline}
          </button>
          <button
            onClick={() => choose(true)}
            className="rounded-lg bg-gradient-to-br from-gold to-gold-soft px-4 py-2 font-bold text-navy transition hover:brightness-110"
          >
            {tx.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
