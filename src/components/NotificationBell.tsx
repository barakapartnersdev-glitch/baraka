"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { markMyNotificationsRead } from "@/app/_notif/actions";

interface BellItem {
  id: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell({
  count,
  items,
}: {
  count: number;
  items: BellItem[];
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !open;
    setOpen(next);
    // عند الفتح: ضع غير المقروء "مقروءاً"
    if (next && count > 0) {
      startTransition(() => {
        markMyNotificationsRead();
      });
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        aria-label="الإشعارات"
        className="relative p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] leading-none min-w-[1rem] h-4 px-1 rounded-full flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-80 max-h-96 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-2">
            <p className="text-xs text-gray-400 px-2 py-1.5">الإشعارات</p>
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">لا إشعارات بعد.</p>
            ) : (
              items.map((n) => {
                const inner = (
                  <div
                    className={`px-2 py-2 rounded-lg ${
                      n.read ? "" : "bg-baraka-light"
                    }`}
                  >
                    <p className="text-sm text-gray-700 leading-snug">
                      {n.message}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleString("ar")}
                    </p>
                  </div>
                );
                return n.link ? (
                  <Link
                    key={n.id}
                    href={n.link}
                    onClick={() => setOpen(false)}
                    className="block hover:bg-gray-50 rounded-lg"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={n.id}>{inner}</div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
