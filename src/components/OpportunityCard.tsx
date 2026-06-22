import Link from "next/link";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

export interface OpportunityCardData {
  id: string;
  href: string;
  title: string;
  summary?: string | null;
  sector: string;
  country: string;
  city?: string | null;
  range?: string | null;
  imageUrl?: string | null; // غلاف أو صورة تعبيرية وثيقة الصلة (تُحسب في الصفحة)
  statusBadge?: { label: string; tone: string } | null;
}

type L = { status: string; view: string; rangeLabel: string };

const LABELS: Record<Locale, L> = {
  ar: { status: "منشورة", view: "اطّلع على الفرصة", rangeLabel: "نطاق الاستثمار" },
  en: { status: "Published", view: "View opportunity", rangeLabel: "Investment range" },
  tr: { status: "Yayında", view: "Fırsatı gör", rangeLabel: "Yatırım aralığı" },
  zh: { status: "已发布", view: "查看机会", rangeLabel: "投资区间" },
};

// بطاقة الفرصة الموحّدة بهوية الموقع (كحلي/ذهبي): رأس بصورة معبّرة دائماً + جسم بمعلومات
// مختصرة. تُستخدم في صفحة الفرص وصفحة الدولة والصفحة الرئيسية.
export default function OpportunityCard({
  data,
  locale = DEFAULT_LOCALE,
}: {
  data: OpportunityCardData;
  locale?: Locale;
}) {
  const L = LABELS[locale] ?? LABELS.ar;

  return (
    <Link
      href={data.href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#e6e9ef] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold-soft hover:shadow-[0_18px_44px_rgba(10,31,60,.12)]"
    >
      {/* رأس بصورة معبّرة */}
      <div
        className="relative h-44 bg-navy bg-cover bg-center"
        style={data.imageUrl ? { backgroundImage: `url(${data.imageUrl})` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-navy/25" />
        <span className="absolute end-4 top-4 rounded-full border border-gold/40 bg-gold/20 px-2.5 py-1 text-[11px] font-bold text-gold-soft backdrop-blur">
          {data.statusBadge?.label ?? L.status}
        </span>
        {data.range && (
          <span className="absolute start-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-navy whitespace-nowrap">
            {data.range.replace(" USD", " $")}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="mb-1.5 text-xs font-bold tracking-wide text-gold-soft">{data.sector}</div>
          <h3 className="text-lg font-extrabold leading-snug text-white drop-shadow line-clamp-2">
            {data.title}
          </h3>
        </div>
      </div>

      {/* الجسم */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-lg border border-[#e6e9ef] bg-[#f6f7f9] px-2.5 py-1 text-xs text-[#5c6b80]">
            <span aria-hidden="true">📍 </span>
            {data.country}
            {data.city ? ` · ${data.city}` : ""}
          </span>
          <span className="rounded-lg border border-[#e6e9ef] bg-[#f6f7f9] px-2.5 py-1 text-xs text-[#5c6b80]">
            {data.sector}
          </span>
        </div>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-[#5c6b80] line-clamp-3">
          {data.summary || "—"}
        </p>
        <div className="flex items-center justify-between border-t border-[#e6e9ef] pt-4">
          {data.range ? (
            <div className="font-black text-navy">
              {data.range.replace(" USD", " $")}
              <small className="block text-[11px] font-medium text-[#5c6b80]">{L.rangeLabel}</small>
            </div>
          ) : (
            <span />
          )}
          <span className="text-sm font-bold text-gold group-hover:underline">{L.view}</span>
        </div>
      </div>
    </Link>
  );
}
