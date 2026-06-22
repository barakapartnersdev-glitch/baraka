// معرض صور الفرصة — صور معبّرة محايدة لغوياً تُعرض في الصفحة العامة.
// خادمي بالكامل (بدون JS)، متجاوب، وبنص بديل مترجم. لا يكشف الموقع الدقيق ولا الهوية.
export default function OpportunityGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  if (!images || images.length === 0) return null;
  const [hero, ...rest] = images;

  return (
    <div className="mb-6">
      <div className="overflow-hidden rounded-xl border border-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero}
          alt={alt}
          className="w-full h-56 md:h-80 object-cover"
          loading="eager"
        />
      </div>
      {rest.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {rest.map((src, i) => (
            <div
              key={src}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} — ${i + 2}`}
                className="w-full h-20 md:h-28 object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
