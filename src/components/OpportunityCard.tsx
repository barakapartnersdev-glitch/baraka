import Link from "next/link";
import Badge from "@/components/Badge";
import type { Locale } from "@/lib/i18n";

// تدرّجات لونية ثابتة (مكتوبة حرفيّاً ليتعرّف عليها Tailwind) — تُختار حسب القطاع.
const GRADIENTS = [
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-indigo-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-700",
];

function gradFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export interface OpportunityCardData {
  id: string;
  href: string;
  title: string;
  summary?: string | null;
  sector: string;
  country: string;
  range?: string | null;
  imageUrl?: string | null;
  statusBadge?: { label: string; tone: string } | null;
}

export default function OpportunityCard({
  data,
}: {
  data: OpportunityCardData;
  locale?: Locale;
}) {
  const grad = gradFor(data.sector || data.id);

  return (
    <Link
      href={data.href}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-baraka hover:shadow-md transition flex flex-col"
    >
      {/* الغلاف */}
      <div
        className={`relative h-32 ${data.imageUrl ? "bg-gray-200" : `bg-gradient-to-br ${grad}`}`}
        style={
          data.imageUrl
            ? {
                backgroundImage: `url(${data.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* زخرفة نموّ (رسم بياني صاعد) — للأغلفة المولّدة فقط */}
        {!data.imageUrl && (
          <svg
            className="absolute bottom-0 left-0 text-white opacity-20"
            width="160"
            height="96"
            viewBox="0 0 160 96"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 84h132" />
            <path d="M28 84V58M62 84V44M96 84V52M130 84V28" />
            <path d="M28 58l34-16 34 10 34-26" />
            <path d="M130 28h-14m14 0v14" />
          </svg>
        )}
        {data.imageUrl && <div className="absolute inset-0 bg-black/25" />}

        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <span className="bg-white/25 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">
              {data.sector}
            </span>
            {data.range && (
              <span className="bg-white/90 text-baraka-dark text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap">
                {data.range}
              </span>
            )}
          </div>
          <span className="text-white text-sm font-bold drop-shadow">{data.country}</span>
        </div>
      </div>

      {/* الجسم */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h2 className="font-bold leading-snug group-hover:text-baraka transition">
            {data.title}
          </h2>
          {data.statusBadge && <Badge {...data.statusBadge} />}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
          {data.summary || "—"}
        </p>
      </div>
    </Link>
  );
}
