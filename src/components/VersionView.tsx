// عرض نسخة منشورة (عامة/مستثمر/ما بعد NCNDA) بحقول منظّمة.
// لا يعرض إلا الحقول التي تصوغها الإدارة — لا علاقة له ببيانات المصدر.
import { VERSION_FIELDS, type VersionData } from "@/lib/opportunity";
import { t, type Locale } from "@/lib/i18n";

export default function VersionView({
  data,
  locale = "ar",
}: {
  data: VersionData | null;
  locale?: Locale;
}) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-sm text-gray-400">{t(locale, "version.empty")}</p>;
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      {VERSION_FIELDS.map((f) =>
        data[f.key] ? (
          <div key={f.key}>
            <p className="text-xs text-gray-500 mb-0.5">{t(locale, `vfield.${f.key}`)}</p>
            <p className="text-gray-800 whitespace-pre-wrap">{data[f.key]}</p>
          </div>
        ) : null
      )}
    </div>
  );
}
