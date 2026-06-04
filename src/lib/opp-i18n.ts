// ترجمة محتوى بطاقات الفرص (القطاع، الدولة، العنوان، الوصف) للعروض التجريبية.
// تُستخدم في الصفحة الرئيسية وصفحة الفرص. لا تلمس قاعدة البيانات — الترجمات هنا.
import type { Locale } from "@/lib/i18n";
import type { VersionData } from "@/lib/opportunity";

type TriLang = { en: string; zh: string; tr: string };

export const SECTOR_I18N: Record<string, TriLang> = {
  "طاقة متجددة": { en: "Renewable energy", zh: "可再生能源", tr: "Yenilenebilir enerji" },
  "رعاية صحية": { en: "Healthcare", zh: "医疗保健", tr: "Sağlık" },
  "تجارة إلكترونية": { en: "E-commerce", zh: "电子商务", tr: "E-ticaret" },
  "خدمات لوجستية": { en: "Logistics", zh: "物流", tr: "Lojistik" },
  "أزياء وتجزئة": { en: "Fashion & retail", zh: "时尚与零售", tr: "Moda ve perakende" },
  "سياحة وضيافة": { en: "Tourism & hospitality", zh: "旅游与酒店", tr: "Turizm ve konaklama" },
  "صناعة ومواد بناء": { en: "Industry & building materials", zh: "工业与建材", tr: "Sanayi ve yapı malzemeleri" },
  "ثروة حيوانية": { en: "Livestock", zh: "畜牧业", tr: "Hayvancılık" },
  "زراعة ذكية": { en: "Smart agriculture", zh: "智慧农业", tr: "Akıllı tarım" },
  "تقنية حيوية": { en: "Biotechnology", zh: "生物技术", tr: "Biyoteknoloji" },
};

export const COUNTRY_I18N: Record<string, TriLang> = {
  "الأردن": { en: "Jordan", zh: "约旦", tr: "Ürdün" },
  "السعودية": { en: "Saudi Arabia", zh: "沙特阿拉伯", tr: "Suudi Arabistan" },
  "الإمارات": { en: "UAE", zh: "阿联酋", tr: "BAE" },
  "البحرين": { en: "Bahrain", zh: "巴林", tr: "Bahreyn" },
  "الكويت": { en: "Kuwait", zh: "科威特", tr: "Kuveyt" },
  "المغرب": { en: "Morocco", zh: "摩洛哥", tr: "Fas" },
  "قطر": { en: "Qatar", zh: "卡塔尔", tr: "Katar" },
  "مصر": { en: "Egypt", zh: "埃及", tr: "Mısır" },
  "عُمان": { en: "Oman", zh: "阿曼", tr: "Umman" },
  "تركيا": { en: "Turkey", zh: "土耳其", tr: "Türkiye" },
};

type TitleSummary = { title: string; summary: string };

// مفتاح القاموس هو العنوان العربي (displayTitle) للعرض التجريبي.
const TITLE_I18N: Record<string, Record<"en" | "zh" | "tr", TitleSummary>> = {
  "محطة طاقة شمسية بقدرة 12 ميغاواط": {
    en: { title: "12 MW solar power plant", summary: "A mid-scale solar generation project with a long-term power purchase agreement and stable returns." },
    zh: { title: "12兆瓦太阳能发电站", summary: "中等规模的太阳能发电项目，拥有长期购电协议和稳定回报。" },
    tr: { title: "12 MW güneş enerjisi santrali", summary: "Uzun vadeli elektrik satın alma anlaşması ve istikrarlı getirisi olan orta ölçekli bir güneş enerjisi projesi." },
  },
  "سلسلة عيادات أسنان متخصّصة": {
    en: { title: "Specialized dental clinic chain", summary: "Expanding a profitable, established dental chain with three new branches in major cities." },
    zh: { title: "专业牙科诊所连锁", summary: "扩展一家盈利且成熟的牙科连锁，在主要城市新增三家分店。" },
    tr: { title: "Uzman diş kliniği zinciri", summary: "Kârlı ve köklü bir diş zincirini büyük şehirlerde üç yeni şubeyle genişletme." },
  },
  "منصة تجزئة إلكترونية متعددة البائعين": {
    en: { title: "Multi-vendor e-commerce platform", summary: "An e-commerce platform with accelerating monthly growth seeking an expansion round in the Gulf market." },
    zh: { title: "多商户电子商务平台", summary: "月增长加速的电商平台，寻求在海湾市场进行扩张融资。" },
    tr: { title: "Çok satıcılı e-ticaret platformu", summary: "Aylık büyümesi hızlanan, Körfez pazarında genişleme turu arayan bir e-ticaret platformu." },
  },
  "مركز تخزين وتوزيع ذكي": {
    en: { title: "Smart storage & distribution hub", summary: "A modern distribution warehouse serving retailers and e-commerce with automated inventory systems." },
    zh: { title: "智能仓储与配送中心", summary: "现代化配送仓库，配备自动化库存系统，服务零售商与电商。" },
    tr: { title: "Akıllı depolama ve dağıtım merkezi", summary: "Perakendecilere ve e-ticarete otomatik stok sistemleriyle hizmet veren modern dağıtım deposu." },
  },
  "علامة أزياء محتشمة عصرية": {
    en: { title: "Modern modest-fashion brand", summary: "A modest-fashion brand with a strong identity and digital presence, targeting retail expansion and export." },
    zh: { title: "现代端庄时尚品牌", summary: "拥有鲜明形象和数字影响力的端庄时尚品牌，瞄准零售扩张与出口。" },
    tr: { title: "Modern tesettür moda markası", summary: "Güçlü kimliği ve dijital varlığı olan, perakende genişleme ve ihracatı hedefleyen tesettür moda markası." },
  },
  "منتجع سياحي بيئي متكامل": {
    en: { title: "Integrated eco-tourism resort", summary: "Developing an eco resort in a rising tourist destination with high expected year-round occupancy." },
    zh: { title: "综合生态旅游度假村", summary: "在新兴旅游目的地开发生态度假村，预计全年入住率高。" },
    tr: { title: "Entegre eko-turizm tesisi", summary: "Yükselen bir turizm destinasyonunda, yıl boyu yüksek doluluk beklenen bir eko tesis geliştirme." },
  },
  "مصنع مواد بناء مستدامة": {
    en: { title: "Sustainable building-materials factory", summary: "A factory producing eco-friendly building materials serving the region's growing construction sector." },
    zh: { title: "可持续建材工厂", summary: "生产环保建材的工厂，服务于本地区不断增长的建筑业。" },
    tr: { title: "Sürdürülebilir yapı malzemeleri fabrikası", summary: "Bölgenin büyüyen inşaat sektörüne hizmet eden çevre dostu yapı malzemeleri fabrikası." },
  },
  "مزرعة دواجن متكاملة": {
    en: { title: "Integrated poultry farm", summary: "An integrated poultry farm from breeding to packaging, targeting local self-sufficiency and growth." },
    zh: { title: "一体化家禽养殖场", summary: "从养殖到包装的一体化家禽养殖场，瞄准本地自给与增长。" },
    tr: { title: "Entegre kümes hayvancılığı çiftliği", summary: "Yetiştirmeden paketlemeye entegre kümes çiftliği; yerel kendi kendine yeterlilik ve büyümeyi hedefler." },
  },
  "مشروع زراعة محاصيل ذكية": {
    en: { title: "Smart-crop farming project", summary: "A crop farm using smart irrigation and precision agriculture to boost yield and save water." },
    zh: { title: "智能作物种植项目", summary: "采用智能灌溉与精准农业的作物农场，提高产量并节约用水。" },
    tr: { title: "Akıllı mahsul tarımı projesi", summary: "Verimi artırmak ve su tasarrufu için akıllı sulama ve hassas tarım kullanan mahsul çiftliği." },
  },
  "مختبر تقنية حيوية وأبحاث": {
    en: { title: "Biotech research laboratory", summary: "A biotech R&D center with a specialized scientific team and products under registration." },
    zh: { title: "生物技术研究实验室", summary: "拥有专业科研团队、产品注册中的生物技术研发中心。" },
    tr: { title: "Biyoteknoloji araştırma laboratuvarı", summary: "Uzman bilimsel ekibe ve tescil aşamasındaki ürünlere sahip biyoteknoloji Ar-Ge merkezi." },
  },
};

// ترجمة مصطلح (قطاع/دولة) — تبقى العربية كما هي، وغيرها من الخريطة إن وُجد.
export function localizeTerm(
  map: Record<string, TriLang>,
  value: string,
  locale: Locale
): string {
  if (locale === "ar") return value;
  return map[value]?.[locale] ?? value;
}

// ترجمة النسخة العامة (العنوان/الملخّص) حسب اللغة، اعتماداً على العنوان العربي.
export function localizeVersion(
  pv: VersionData | null,
  locale: Locale
): VersionData | null {
  if (!pv || locale === "ar") return pv;
  const tr = pv.displayTitle ? TITLE_I18N[pv.displayTitle]?.[locale] : undefined;
  return tr ? { ...pv, displayTitle: tr.title, summary: tr.summary } : pv;
}
