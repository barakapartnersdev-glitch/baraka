"use client";
// زر مشاركة صفحة الفرصة عبر واتساب ووسائل التواصل + نسخ الرابط.
// يفتح قائمة بأزرار صريحة لكل منصّة، ويتيح أيضاً «المشاركة عبر النظام» (Web Share API)
// على الأجهزة الداعمة (الجوال) لتظهر صحيفة المشاركة الأصلية. متعدّد اللغات وRTL-aware.
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Labels = {
  share: string;
  via: string;
  copy: string;
  copied: string;
  more: string;
};

const LABELS: Record<Locale, Labels> = {
  ar: { share: "مشاركة", via: "مشاركة عبر", copy: "نسخ الرابط", copied: "تم النسخ ✓", more: "المزيد…" },
  en: { share: "Share", via: "Share via", copy: "Copy link", copied: "Copied ✓", more: "More…" },
  tr: { share: "Paylaş", via: "Şununla paylaş", copy: "Bağlantıyı kopyala", copied: "Kopyalandı ✓", more: "Daha fazla…" },
  zh: { share: "分享", via: "分享到", copy: "复制链接", copied: "已复制 ✓", more: "更多…" },
};

// أيقونات المنصّات (SVG مضمّنة) + لون العلامة.
const ICONS: Record<string, { color: string; path: React.ReactNode }> = {
  whatsapp: {
    color: "#25D366",
    path: (
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.83c2.16 0 4.18.84 5.71 2.37a8.03 8.03 0 0 1 2.37 5.71c0 4.46-3.63 8.08-8.09 8.08a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.03 8.03 0 0 1-1.27-4.32c0-4.46 3.63-8.08 8.09-8.08l.42.27Zm-2.56 4.4c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.97 2.63 1.11 2.81c.14.18 1.92 2.93 4.65 4.11.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.61-.66 1.84-1.29.23-.63.23-1.18.16-1.29-.07-.11-.25-.18-.52-.32-.27-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.72-1.35-1.6-1.5-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.02-.22-.53-.44-.46-.61-.46l-.52-.01Z" />
    ),
  },
  telegram: {
    color: "#229ED9",
    path: (
      <path d="M21.94 4.64a1.4 1.4 0 0 0-1.43-.2L3.4 11.1c-.94.38-.93.92-.16 1.16l4.52 1.41 1.7 5.36c.22.6.38.83.78.83.31 0 .49-.14.71-.36l2.18-2.12 4.53 3.35c.83.46 1.43.22 1.64-.77l2.96-13.96c.16-.74-.13-1.13-.32-1.32Zm-5.16 3.16-8.16 7.24-.32 3.42-1.55-4.86 9.34-5.88c.43-.27.83-.12.69.08Z" />
    ),
  },
  x: {
    color: "#000000",
    path: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
    ),
  },
  facebook: {
    color: "#1877F2",
    path: (
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    ),
  },
  linkedin: {
    color: "#0A66C2",
    path: (
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    ),
  },
};

function PlatformIcon({ name }: { name: string }) {
  const ic = ICONS[name];
  if (!ic) return null;
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
      style={{ backgroundColor: ic.color }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {ic.path}
      </svg>
    </span>
  );
}

export default function ShareButton({
  url,
  title,
  locale,
}: {
  url: string;
  title: string;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const L = LABELS[locale] ?? LABELS.ar;

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const u = encodeURIComponent(url);
  const txt = encodeURIComponent(title);

  const links = [
    { key: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${txt}%20${u}` },
    { key: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${txt}` },
    { key: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${txt}` },
    { key: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { key: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];

  async function nativeShare() {
    try {
      await navigator.share({ title, text: title, url });
      setOpen(false);
    } catch {
      /* المستخدم ألغى المشاركة — تجاهل */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* تعذّر النسخ */
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:border-baraka hover:text-baraka"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
        {L.share}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute z-30 mt-2 w-60 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
          style={{ insetInlineEnd: 0 }}
        >
          <p className="px-2 py-1 text-[11px] font-medium text-gray-400">{L.via}</p>

          {links.map((it) => (
            <a
              key={it.key}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <PlatformIcon name={it.key} />
              {it.label}
            </a>
          ))}

          <div className="my-1 border-t border-gray-100" />

          <button
            type="button"
            onClick={copyLink}
            role="menuitem"
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </span>
            <span className={copied ? "text-emerald-600" : ""}>{copied ? L.copied : L.copy}</span>
          </button>

          {canNativeShare && (
            <button
              type="button"
              onClick={nativeShare}
              role="menuitem"
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-baraka-light text-baraka-dark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <path d="M16 6l-4-4-4 4M12 2v13" />
                </svg>
              </span>
              {L.more}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
