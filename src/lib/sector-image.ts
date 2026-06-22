// مطابقة صورة تعبيرية للقطاع (بأربع لغات) — صور محايدة من public/destinations/sectors.
// تُستخدم لعرض «صور توضيحية» في صفحة الفرصة عند غياب معرض خاص بها.
// مصدر القواعد نفسه المستخدم في صفحات وجهات الاستثمار.

const SECTOR_IMAGES: Record<string, string> = {
  reconstruction: "/destinations/sectors/reconstruction.jpg",
  industry: "/destinations/sectors/industry.jpg",
  realestate: "/destinations/sectors/realestate.jpg",
  tourism: "/destinations/sectors/tourism.jpg",
  energy: "/destinations/sectors/energy.jpg",
  agriculture: "/destinations/sectors/agriculture.jpg",
  food: "/destinations/sectors/food.jpg",
  logistics: "/destinations/sectors/logistics.jpg",
  technology: "/destinations/sectors/technology.jpg",
  exports: "/destinations/sectors/exports.jpg",
  mining: "/destinations/sectors/mining.jpg",
  finance: "/destinations/sectors/finance.jpg",
  healthcare: "/destinations/sectors/healthcare.jpg",
  shipping: "/destinations/sectors/shipping.jpg",
  education: "/destinations/sectors/education.jpg",
  pharma: "/destinations/sectors/pharma.jpg",
  default: "/destinations/sectors/default.jpg",
};

// قواعد المطابقة: كلمات مفتاحية لكل قطاع (عربي/إنجليزي/تركي/صيني). الأكثر تحديداً أولاً.
const SECTOR_RULES: { key: string; kw: string[] }[] = [
  { key: "reconstruction", kw: ["إعمار", "reconstruction", "yeniden inşa", "inşa", "重建"] },
  { key: "pharma", kw: ["دوائ", "دواء", "أدوية", "pharma", "ilaç", "制药", "医药"] },
  { key: "mining", kw: ["تعدين", "مناجم", "مقالع", "رخام", "mining", "quarr", "marble", "madencilik", "采矿", "采石", "矿"] },
  { key: "finance", kw: ["مالي", "مصرف", "بنوك", "financ", "banking", "finansal", "金融"] },
  { key: "healthcare", kw: ["صحي", "صحة", "رعاية", "health", "medical", "sağlık", "医疗", "健康", "卫生"] },
  { key: "shipping", kw: ["شحن", "بحري", "ملاحة", "shipping", "maritime", "denizcilik", "航运", "海运"] },
  { key: "education", kw: ["تعليم", "تربية", "جامع", "مدرس", "education", "school", "eğitim", "教育"] },
  { key: "exports", kw: ["تصدير", "export", "ihracat", "出口"] },
  { key: "logistics", kw: ["لوجست", "إمداد", "نقل", "تخزين", "logistic", "lojistik", "物流"] },
  { key: "technology", kw: ["تكنولوج", "تقني", "technology", "tech", "teknoloji", "科技", "技术", "信息"] },
  { key: "energy", kw: ["طاقة", "energy", "enerji", "能源", "电力"] },
  { key: "agriculture", kw: ["زراع", "agricultur", "tarım", "tarim", "农业", "农"] },
  { key: "food", kw: ["غذاء", "أغذية", "حُمّص", "حمص", "مشروم", "food", "gıda", "gida", "食品", "食物"] },
  { key: "tourism", kw: ["سياح", "tourism", "turizm", "旅游"] },
  { key: "realestate", kw: ["عقار", "سكني", "ضاحية", "real estate", "real-estate", "residential", "gayrimenkul", "房地产", "地产"] },
  { key: "industry", kw: ["صناع", "تصنيع", "industr", "manufactur", "sanayi", "imalat", "工业", "制造"] },
];

// صور مكمّلة لكل قطاع لبناء صفّ تعبيري متنوّع (المطابق أولاً ثم صورتان مرتبطتان).
const RELATED: Record<string, string[]> = {
  reconstruction: ["reconstruction", "realestate", "industry"],
  pharma: ["pharma", "healthcare", "technology"],
  mining: ["mining", "industry", "exports"],
  finance: ["finance", "technology", "industry"],
  healthcare: ["healthcare", "pharma", "technology"],
  shipping: ["shipping", "logistics", "exports"],
  education: ["education", "technology", "realestate"],
  exports: ["exports", "logistics", "industry"],
  logistics: ["logistics", "shipping", "exports"],
  technology: ["technology", "finance", "industry"],
  energy: ["energy", "industry", "technology"],
  agriculture: ["agriculture", "food", "exports"],
  food: ["food", "agriculture", "exports"],
  tourism: ["tourism", "realestate", "food"],
  realestate: ["realestate", "reconstruction", "industry"],
  industry: ["industry", "logistics", "exports"],
  default: ["default", "industry", "exports"],
};

function normSector(x: string): string {
  return x.replace(/İ/g, "I").toLowerCase();
}

function matchKey(sector: string): string {
  const s = normSector(sector);
  for (const r of SECTOR_RULES) {
    if (r.kw.some((k) => s.includes(normSector(k)))) return r.key;
  }
  return "default";
}

// صورة قطاع واحدة (احتياطية).
export function sectorImage(sector: string): string {
  return SECTOR_IMAGES[matchKey(sector)] ?? SECTOR_IMAGES.default;
}

// مجموعة صور تعبيرية للقطاع (افتراضياً 3) — لعرض قسم صور خفيف عند غياب معرض الفرصة.
export function illustrativeImages(sector: string, count = 3): string[] {
  const key = matchKey(sector);
  const keys = RELATED[key] ?? RELATED.default;
  return keys.slice(0, count).map((k) => SECTOR_IMAGES[k] ?? SECTOR_IMAGES.default);
}
