// مكوّن خادمي لحقن بيانات Schema.org (JSON-LD) بأمان في الصفحة.
// يقبل كائناً واحداً أو مصفوفة كائنات. يستخدم jsonLdScript لتهريب الأحرف الخطرة.
import { jsonLdScript } from "@/lib/seo";

export default function JsonLd({ data }: { data: unknown | unknown[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(d) }}
        />
      ))}
    </>
  );
}
