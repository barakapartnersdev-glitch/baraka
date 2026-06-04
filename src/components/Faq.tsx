"use client";
import { useState } from "react";

export interface FaqItem {
  q: string;
  a: string;
}

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3.5">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-[#e6e9ef] bg-white"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start text-base font-bold text-navy transition-colors hover:bg-gray-50/60 sm:text-lg"
            >
              <span>{it.q}</span>
              <span
                className={`shrink-0 text-2xl text-gold transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 leading-relaxed text-[#5c6b80]">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
