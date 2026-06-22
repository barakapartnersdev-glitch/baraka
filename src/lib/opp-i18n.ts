// ترجمة محتوى بطاقات الفرص (القطاع، الدولة، العنوان، الوصف) للعروض التجريبية.
// تُستخدم في الصفحة الرئيسية وصفحة الفرص. لا تلمس قاعدة البيانات — الترجمات هنا.
import type { Locale } from "@/lib/i18n";
import type { VersionData } from "@/lib/opportunity";

type TriLang = { en: string; zh: string; tr: string };

export const SECTOR_I18N: Record<string, TriLang> = {
  "زراعة الفطر": { en: "Mushroom farming", zh: "蘑菇种植", tr: "Mantar yetiştiriciliği" },
  "تصنيع زيوت غذائية": { en: "Edible oil manufacturing", zh: "食用油加工", tr: "Yemeklik yağ üretimi" },
  "تصنيع أغذية جاهزة": { en: "Ready-to-eat food manufacturing", zh: "即食食品制造", tr: "Hazır gıda üretimi" },
  "طاقة متجددة": { en: "Renewable energy", zh: "可再生能源", tr: "Yenilenebilir enerji" },
  "رعاية صحية": { en: "Healthcare", zh: "医疗保健", tr: "Sağlık" },
  "تجارة إلكترونية": { en: "E-commerce", zh: "电子商务", tr: "E-ticaret" },
  "خدمات لوجستية": { en: "Logistics", zh: "物流", tr: "Lojistik" },
  "أزياء وتجزئة": { en: "Fashion & retail", zh: "时尚与零售", tr: "Moda ve perakende" },
  "سياحة وضيافة": { en: "Tourism & hospitality", zh: "旅游与酒店", tr: "Turizm ve konaklama" },
  "صناعة ومواد بناء": { en: "Industry & building materials", zh: "工业与建材", tr: "Sanayi ve yapı malzemeleri" },
  "مدن ومناطق صناعية": { en: "Industrial cities & zones", zh: "工业城与园区", tr: "Sanayi şehirleri ve bölgeleri" },
  "تعدين ومحاجر": { en: "Mining & quarrying", zh: "采矿与采石", tr: "Madencilik ve taş ocakçılığı" },
  "ثروة حيوانية": { en: "Livestock", zh: "畜牧业", tr: "Hayvancılık" },
  "زراعة ذكية": { en: "Smart agriculture", zh: "智慧农业", tr: "Akıllı tarım" },
  "تقنية حيوية": { en: "Biotechnology", zh: "生物技术", tr: "Biyoteknoloji" },
  "عقارات وتطوير": { en: "Real estate & development", zh: "房地产与开发", tr: "Gayrimenkul ve geliştirme" },
  "تعليم": { en: "Education", zh: "教育", tr: "Eğitim" },
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
  "رومانيا": { en: "Romania", zh: "罗马尼亚", tr: "Romanya" },
  "قبرص": { en: "Cyprus", zh: "塞浦路斯", tr: "Kıbrıs" },
  "سوريا": { en: "Syria", zh: "叙利亚", tr: "Suriye" },
};

type TitleSummary = {
  title: string;
  summary: string;
  highlights?: string;
  details?: string;
};

// مفتاح القاموس هو العنوان العربي (displayTitle) للعرض التجريبي.
const TITLE_I18N: Record<string, Record<"en" | "zh" | "tr", TitleSummary>> = {
  "شراكة تصنيع وتصدير حُمّص بالطحينة طويل الصلاحية — إسطنبول، تركيا": {
    en: {
      title:
        "Long Shelf-Life Hummus with Tahini — Manufacturing & Export Partnership, Istanbul, Türkiye",
      summary:
        "A 50% equity partnership in an operating food factory in Istanbul that produces hummus with tahini in sealed, ambient-stable retail packs with a shelf life of up to 18 months before opening — a decisive advantage that unlocks the export and modern-trade channels traditional fresh hummus cannot serve. The factory is fully operational and already exports to the European Union and the United Kingdom, yet runs at only about 16.6% of its monthly capacity due to a working-capital shortfall and the absence of a structured export function. The ask: USD 2 million in two annual tranches (USD 1 million each) for a 50% stake — to activate idle capacity, build the commercial arm, then double capacity in Year 2.",
      highlights: [
        "50% stake in a fully operating food factory (not a greenfield project)",
        "Shelf life up to 18 months at ambient temperature — a decisive export advantage (dry shipping, no refrigeration)",
        "Commercially proven product with active clients in the EU and the UK",
        "Private-label manufacturing experience for established Middle Eastern brands",
        "Current capacity utilization only ~16.6%: large idle capacity convertible to revenue with no new capex in Year 1",
        "Reported gross margin of 55%–60%",
        "Potential annual revenue at full capacity USD 5.76–6.48M (Year 1), rising to USD 11.52–12.96M after doubling capacity (Year 2)",
        "Documented R&D investment exceeding USD 1 million (formulation, pasteurization, packaging, shelf-life validation)",
        "Türkiye as a competitive manufacturing base: raw materials, EU-grade food-safety standards, and nearby maritime logistics",
      ].join("\n"),
      details:
        "This is not a turnaround or a product/technology problem, but a capital-and-commercialization gap that keeps an already-profitable industrial asset below its installed capability. Installed capacity is 12 containers per month (~192,000 kg) versus current sales of roughly 2 containers per month. Three retail SKUs (1 kg, 500 g, 200 g) are sold locally and for export through modern trade and HORECA channels. The first tranche activates existing capacity and funds raw materials, the receivables cycle, the export department, and entry into the Turkish domestic market; the second tranche doubles production lines to 24 containers per month and adds adjacent Levantine lines (mutabbal, baba ghanoush, foul, sauces) on the same shelf-life platform. Note: the information is preliminary and indicative and does not constitute an offer or legal or financial advice; all figures are subject to due diligence, and full details and the parties' identities are disclosed to approved investors per the platform's policy.",
    },
    zh: {
      title: "长保质期芝麻酱鹰嘴豆泥（Hummus）生产与出口合作机会 — 土耳其伊斯坦布尔",
      summary:
        "在伊斯坦布尔一家正在运营的食品厂中获得 50% 股权的合作机会：该厂生产芝麻酱鹰嘴豆泥，采用密封、常温稳定的零售包装，开封前保质期长达 18 个月——这一决定性优势可打开传统新鲜鹰嘴豆泥无法进入的出口与现代贸易渠道。工厂已全面运营，并已向欧盟和英国出口，但由于流动资金短缺、缺乏规范的出口部门，目前仅利用约 16.6% 的月产能。融资需求：200 万美元，分两年两期注入（每期 100 万美元），换取 50% 股权，用于激活闲置产能、组建商务团队，并在第二年将产能翻倍。",
      highlights: [
        "在全面运营的食品厂中持有 50% 股权（并非从零起步的项目）",
        "常温下保质期长达 18 个月——决定性的出口优势（干柜运输、无需冷藏）",
        "产品已通过商业验证，在欧盟和英国拥有实际客户",
        "为知名中东品牌提供自有品牌（Private Label）代工经验",
        "当前产能利用率仅约 16.6%：大量闲置产能可在第一年无需新增资本支出即转化为收入",
        "公布的毛利率为 55%–60%",
        "满产时潜在年收入 576 万–648 万美元（第一年），产能翻倍后可达 1,152 万–1,296 万美元（第二年）",
        "有据可查的研发投入超过 100 万美元（配方、巴氏杀菌、包装、保质期验证）",
        "土耳其作为具竞争力的制造基地：原材料、欧盟级食品安全标准及邻近的海运物流",
      ].join("\n"),
      details:
        "这并非困境扭转，也不是产品或技术问题，而是资金与商业化缺口，使一项本已盈利的工业资产无法达到其装机产能。装机产能为每月 12 个集装箱（约 192,000 公斤），而当前销售约为每月 2 个集装箱。三种零售规格（1 公斤、500 克、200 克）通过现代贸易及餐饮（HORECA）渠道在本地销售并出口。第一期资金用于激活现有产能，并为原材料、应收账款周期、出口部门以及进入土耳其本地市场提供资金；第二期资金将生产线翻倍至每月 24 个集装箱，并在同一保质期平台上增加相邻的黎凡特品类（mutabbal、baba ghanoush、ful、酱料）。注：以上信息为初步及介绍性内容，不构成要约或法律、财务建议；所有数字均须经尽职调查，完整细节及各方身份将按平台政策向经批准的投资者披露。",
    },
    tr: {
      title:
        "Uzun Raf Ömürlü Tahinli Humus — Üretim ve İhracat Ortaklığı, İstanbul, Türkiye",
      summary:
        "İstanbul'da faaliyet gösteren bir gıda fabrikasında %50 hisseli ortaklık fırsatı: fabrika, tahinli humusu kapalı, oda sıcaklığında stabil perakende ambalajlarda üretir ve açılmadan önce 18 aya varan raf ömrü sunar — bu, geleneksel taze humusun giremediği ihracat ve modern perakende kanallarını açan belirleyici bir avantajdır. Fabrika tam kapasiteyle faaldir ve halihazırda Avrupa Birliği ile Birleşik Krallık'a ihracat yapmaktadır; ancak işletme sermayesi eksikliği ve yapılandırılmış bir ihracat biriminin bulunmaması nedeniyle aylık kapasitesinin yalnızca ~%16,6'sını kullanmaktadır. Talep: %50 hisse karşılığında, iki yıllık dilim hâlinde (her biri 1 milyon dolar) 2 milyon dolar — atıl kapasiteyi devreye almak, ticari kolu kurmak ve ardından 2. yılda kapasiteyi ikiye katlamak için.",
      highlights: [
        "Tam faal bir gıda fabrikasında %50 hisse (sıfırdan bir proje değil)",
        "Oda sıcaklığında 18 aya varan raf ömrü — belirleyici bir ihracat avantajı (soğutmasız, kuru konteyner taşıma)",
        "Ticari olarak kanıtlanmış ürün; AB ve Birleşik Krallık'ta aktif müşteriler",
        "Tanınmış Orta Doğu markaları için özel etiket (Private Label) üretim deneyimi",
        "Mevcut kapasite kullanımı yalnızca ~%16,6: 1. yılda yeni yatırım gerektirmeden gelire dönüştürülebilecek büyük atıl kapasite",
        "Açıklanan brüt kâr marjı %55–60",
        "Tam kapasitede potansiyel yıllık gelir 5,76–6,48 milyon dolar (1. yıl), kapasite ikiye katlanınca 11,52–12,96 milyon dolara ulaşır (2. yıl)",
        "Belgelenmiş, 1 milyon doları aşan Ar-Ge yatırımı (formülasyon, pastörizasyon, ambalaj, raf ömrü doğrulaması)",
        "Rekabetçi bir üretim üssü olarak Türkiye: hammadde, AB düzeyinde gıda güvenliği standartları ve yakın deniz lojistiği",
      ].join("\n"),
      details:
        "Bu bir kurtarma vakası ya da ürün/teknoloji sorunu değil; halihazırda kârlı bir sınai varlığın kurulu kapasitesine ulaşmasını engelleyen bir sermaye ve ticarileştirme açığıdır. Kurulu kapasite ayda 12 konteyner (~192.000 kg) iken mevcut satışlar ayda yaklaşık 2 konteynerdir. Üç perakende ürün (1 kg, 500 g, 200 g) yerel olarak satılır ve modern perakende ile HORECA kanalları üzerinden ihraç edilir. İlk dilim mevcut kapasiteyi devreye alır; hammadde, alacak döngüsü, ihracat departmanı ve Türkiye iç pazarına giriş için finansman sağlar. İkinci dilim üretim hatlarını ayda 24 konteynere ikiye katlar ve aynı raf ömrü platformunda komşu Levanten ürünleri (mutabbal, baba ganuş, ful, soslar) ekler. Not: Bilgiler ön niteliktedir ve yalnızca bilgilendirme amaçlıdır; bir teklif ya da hukuki/mali danışmanlık teşkil etmez; tüm rakamlar durum tespitine tabidir ve tüm ayrıntılar ile tarafların kimlikleri platform politikasına göre onaylı yatırımcılara açıklanır.",
    },
  },
  "مصنع متكامل لعصر وتكرير وتعبئة زيت دوار الشمس وإنتاج الأعلاف — سوريا": {
    en: {
      title:
        "Integrated Sunflower Oil Crushing, Refining & Bottling Facility — Syria",
      summary:
        "An investment opportunity in Syria's food-industry sector: establishing an integrated facility for crushing sunflower seeds, refining and bottling the oil, plus producing sunflower meal (animal feed) as a high-value by-product. The project addresses a structural deficit in Syria's edible-oils market — currently met by importing more than 250,000 tons per year — and is positioned to capture import-substitution demand from the first year of commercial operation. The required capital is USD 20 million as the Investor's full cash contribution for a 60% stake in the Special Purpose Vehicle (SPV), while the Operating Partner contributes land, license, technical and operational know-how and the distribution network for 40%. Per the validated financial model: expected annual revenue of USD 63.35 million, EBITDA of USD 13.85 million and net profit of USD 10.5 million, with a 28%–32% IRR and a payback of about two years at the project level.",
      highlights: [
        "Structural market deficit: Syria imports over 250,000 tons of edible oil per year, with no integrated local refining capacity at this scale",
        "First-mover advantage: no comparable local competitor, in a non-discretionary food staple with stable, inelastic demand",
        "Expected annual revenue of USD 63.35 million at design capacity",
        "EBITDA of USD 13.85 million and net profit of USD 10.5 million per year",
        "28%–32% IRR with capital payback of ~2 years at the project level",
        "Profitable by-product: sunflower meal (~45,000 tons/yr) sold as animal feed, opening a second revenue stream",
        "Processing capacity of ~80,000 tons of seed and ~35,000 tons of refined oil per year",
        "Two ready sites owned by the Operating Partner (25 dunums each): an industrial zone near Damascus on the M5 corridor, and a Euphrates riverside site near the sunflower-farming belt",
        "Clear 60/40 partnership via an SPV with investor governance protections and milestone-linked capital tranches",
        "Future vertical-integration potential via contract farming to replace imported seed with domestic supply",
        "Commercial operation targeted within 18–24 months of financial close",
      ].join("\n"),
      details:
        "The project combines four integrated stages: (1) sunflower-seed crushing and oil extraction, (2) refining and filtration, (3) bottling and packaging, and (4) distribution into the local market through an established partner. Processing input is about 80,000 tons of seed per year, yielding ~35,000 tons of refined oil and ~45,000 tons of feed meal. The USD 20 million capital is deployed across production lines and machinery, civil works and infrastructure, silos and storage tanks, logistics and lab equipment, and working capital and commissioning, with a contingency reserve, drawn down in four milestone-linked tranches. Timeline: months 0–4 for incorporation and contracting, 4–16 for civil works, procurement and installation, and 16–24 for commissioning and a gradual ramp-up to design capacity. The structure is a partnership through a Special Purpose Vehicle (SPV) in which the Investor holds 60% in exchange for funding the entire capital in cash, and the Operating Partner holds 40% in exchange for an in-kind contribution (25-dunum land, license, technical and operational expertise, distribution network); profits are distributed pro rata (60/40), with a board majority, reserved matters and protection rights for the Investor. Note: the information is preliminary and indicative and does not constitute an offer or legal or financial advice; all figures are subject to due diligence, and full details, the feasibility documents and exact locations are disclosed to approved investors per the platform's policy.",
    },
    zh: {
      title: "葵花籽油压榨、精炼与灌装一体化工厂 — 叙利亚",
      summary:
        "叙利亚食品工业领域的投资机会：建设一座集葵花籽压榨、油脂精炼与灌装于一体的工厂，并生产高价值副产品——葵花籽粕（动物饲料）。该项目针对叙利亚食用油市场的结构性缺口——目前每年通过进口逾 25 万吨来满足需求——并定位于自商业运营第一年起即捕获进口替代需求。所需资本为 2,000 万美元，作为投资方为特殊目的公司（SPV）60% 股权而提供的全额现金出资；运营合伙人则以土地、牌照、技术与运营专长及分销网络出资，占 40%。根据经验证的财务模型：预计年收入 6,335 万美元、息税折旧摊销前利润（EBITDA）1,385 万美元、净利润 1,050 万美元，项目层面内部收益率（IRR）为 28%–32%，回收期约两年。",
      highlights: [
        "结构性市场缺口：叙利亚每年进口逾 25 万吨食用油，且没有此等规模的本地一体化精炼产能",
        "先发优势：在需求稳定且缺乏弹性的必需食品中，无同等规模的本地竞争对手",
        "设计产能下预计年收入 6,335 万美元",
        "年息税折旧摊销前利润（EBITDA）1,385 万美元，净利润 1,050 万美元",
        "项目层面内部收益率 28%–32%，资本回收期约 2 年",
        "可盈利副产品：葵花籽粕（约 45,000 吨/年）作为动物饲料销售，开辟第二条收入来源",
        "年加工能力约 80,000 吨籽与约 35,000 吨精炼油",
        "运营合伙人拥有两处现成地块（各 25 杜诺姆）：M5 走廊上靠近大马士革的工业区，以及靠近葵花种植带的幼发拉底河畔地块",
        "通过 SPV 的清晰 60/40 合伙结构，附投资方治理保护与按里程碑分批注资",
        "未来可通过订单农业实现纵向一体化，以本地供应替代进口籽",
        "目标在财务交割后 18–24 个月内投入商业运营",
      ].join("\n"),
      details:
        "该项目整合四个环节：（1）葵花籽压榨与提油，（2）精炼与过滤，（3）灌装与包装，（4）通过既有合作伙伴分销至本地市场。加工投入约为每年 80,000 吨籽，产出约 35,000 吨精炼油和约 45,000 吨饲料粕。2,000 万美元资本分配于生产线与机械、土建与基础设施、筒仓与储罐、物流与实验室设备、营运资金与试运行，并设应急储备，按四个与里程碑挂钩的批次拨付。时间表：第 0–4 个月用于设立与签约，第 4–16 个月用于土建、采购与安装，第 16–24 个月用于试运行并逐步提升至设计产能。结构为通过特殊目的公司（SPV）的合伙：投资方以全额现金出资换取 60% 股权，运营合伙人以实物出资（25 杜诺姆土地、牌照、技术与运营专长、分销网络）换取 40%；利润按比例（60/40）分配，投资方享有董事会多数席位、保留事项及保护性权利。注：以上信息为初步及介绍性内容，不构成要约或法律、财务建议；所有数字均需经尽职调查，完整细节、可行性文件及确切位置将按平台政策向经批准的投资者披露。",
    },
    tr: {
      title:
        "Entegre Ayçiçek Yağı Presleme, Rafinasyon ve Dolum Tesisi — Suriye",
      summary:
        "Suriye'nin gıda sanayii sektöründe bir yatırım fırsatı: ayçiçeği tohumunu presleyen, yağı rafine edip dolumunu yapan ve yüksek değerli yan ürün olarak ayçiçeği küspesi (hayvan yemi) üreten entegre bir tesisin kurulması. Proje, yılda 250.000 tonu aşan ithalatla karşılanan Suriye yemeklik yağ pazarındaki yapısal açığı hedefler ve ticari işletmenin ilk yılından itibaren ithal ikamesi talebini yakalamak üzere konumlanır. Gerekli sermaye, Özel Amaçlı Şirket'in (SPV) %60 hissesi karşılığında Yatırımcının tam nakdi katkısı olarak 20 milyon ABD dolarıdır; İşletme Ortağı ise arsa, lisans, teknik ve operasyonel uzmanlık ve dağıtım ağını %40 karşılığında sağlar. Onaylı finansal modele göre: yıllık 63,35 milyon dolar gelir, 13,85 milyon dolar FAVÖK (EBITDA) ve 10,5 milyon dolar net kâr beklenir; proje düzeyinde %28–%32 İç Verim Oranı (IRR) ve yaklaşık iki yıllık geri ödeme süresiyle.",
      highlights: [
        "Yapısal pazar açığı: Suriye yılda 250.000 tonu aşkın yemeklik yağ ithal ediyor ve bu ölçekte entegre yerel rafinasyon kapasitesi yok",
        "İlk hamle avantajı: bu büyüklükte benzer yerel rakip yok; talebi istikrarlı ve esnek olmayan temel bir gıda ürününde",
        "Tasarım kapasitesinde yıllık 63,35 milyon dolar beklenen gelir",
        "Yıllık 13,85 milyon dolar FAVÖK (EBITDA) ve 10,5 milyon dolar net kâr",
        "Proje düzeyinde %28–%32 IRR ve ~2 yıl sermaye geri ödemesi",
        "Kârlı yan ürün: ayçiçeği küspesi (~45.000 ton/yıl) hayvan yemi olarak satılır ve ikinci bir gelir akışı açar",
        "Yıllık ~80.000 ton tohum ve ~35.000 ton rafine yağ işleme kapasitesi",
        "İşletme Ortağına ait iki hazır arsa (her biri 25 dönüm): M5 koridorunda Şam yakınında bir sanayi bölgesi ve ayçiçeği tarım kuşağına yakın Fırat kıyısında bir arsa",
        "SPV üzerinden net %60/%40 ortaklık; yatırımcı yönetişim korumaları ve kilometre taşına bağlı sermaye dilimleri",
        "İthal tohumu yerli üretimle değiştirmek için sözleşmeli tarım yoluyla gelecekte dikey entegrasyon imkânı",
        "Finansal kapanıştan itibaren 18–24 ay içinde ticari işletme hedefi",
      ].join("\n"),
      details:
        "Proje dört entegre aşamayı birleştirir: (1) ayçiçeği tohumu presleme ve yağ ekstraksiyonu, (2) rafinasyon ve filtrasyon, (3) dolum ve paketleme, (4) yerleşik bir ortak aracılığıyla yerel pazara dağıtım. İşleme girdisi yılda yaklaşık 80.000 ton tohumdur; ~35.000 ton rafine yağ ve ~45.000 ton yem küspesi üretir. 20 milyon dolarlık sermaye; üretim hatları ve makineler, inşaat işleri ve altyapı, silolar ve depolama tankları, lojistik ve laboratuvar ekipmanı, işletme sermayesi ve devreye alma kalemlerine, bir de ihtiyat rezerviyle dağıtılır ve kilometre taşına bağlı dört dilimde kullanılır. Zaman çizelgesi: kuruluş ve sözleşme için 0–4 ay, inşaat, tedarik ve montaj için 4–16 ay, devreye alma ve tasarım kapasitesine kademeli çıkış için 16–24 ay. Yapı, Yatırımcının tüm sermayeyi nakit finanse etmesi karşılığında %60'a, İşletme Ortağının ise ayni katkı (25 dönüm arsa, lisans, teknik ve operasyonel uzmanlık, dağıtım ağı) karşılığında %40'a sahip olduğu bir Özel Amaçlı Şirket (SPV) aracılığıyla ortaklıktır; kârlar oransal (%60/%40) dağıtılır; Yatırımcı için yönetim kurulu çoğunluğu, saklı tutulan konular ve koruma hakları bulunur. Not: Bilgiler ön niteliktedir ve yalnızca bilgilendirme amaçlıdır; bir teklif veya hukuki ya da mali danışmanlık teşkil etmez; tüm rakamlar durum tespitine tabidir ve tüm ayrıntılar, fizibilite belgeleri ve kesin konumlar platform politikasına göre onaylı yatırımcıya açıklanır.",
    },
  },
  "إنتاج مشروم المحار الملكي وتصنيع المشروم المقرمش — اسطنبول": {
    en: {
      title:
        "Royal Oyster Mushroom Production & Crispy Mushroom Processing — Istanbul, Türkiye",
      summary:
        "A growth-capital opportunity in the food-agriculture sector in Istanbul, Türkiye: an established, fully-licensed company operating an integrated facility that produces Royal Oyster Mushrooms (Pleurotus) in a sterile, climate-controlled environment year-round, commercially active for more than six months with daily output approaching one tonne. The company is now seeking a strategic partner to fund a transformative expansion — a dedicated factory for ready-to-eat frozen 'Crispy Mushroom' snacks in four flavors — turning it from a single-line fresh-produce supplier into a multi-product food processor serving local retail, the HORECA sector, and exports to the Gulf and the European Union.",
      highlights: [
        "Operating, profitable, fully-licensed company — funding a defined expansion, not a greenfield startup",
        "Existing asset base independently valued at ~USD 2.96M, giving ~1.5× coverage of the capital sought",
        "Current output ~1,000 kg/day of fresh mushroom; licensed capacity ~377,731 kg/year across 14 climate-controlled chambers",
        "'Crispy Mushroom' product — a first-of-its-kind category with no direct competitor, in four flavors (spicy / cheese / chicken / seasoned)",
        "Vertical integration: raw material (mushroom) from the company's own farm — margin protection and cost stability",
        "Growth capital sought ~USD 1.96M: factory build-out + working capital + contingency reserve",
        "50/50 annual profit distribution • capital payback in ~2.9 years • cumulative ROI ~178.8% over three years",
        "Balanced target markets: Türkiye 50% • European Union 25% • Gulf & Arab world 25% (natively Halal products)",
        "Scalable capacity: 10,000 packs/day in Stage 1, self-funded doubling to 20,000 in Year 3",
      ].join("\n"),
      details:
        "The project combines an established facility cultivating Royal Oyster Mushrooms in a sterile, climate-controlled system (substrate preparation, inoculation, incubation and growth, fruiting and harvest, packing) across 14 insulated production chambers, with a new expansion into value-added food processing via a 'Crispy Mushroom' line (breaded, fried, frozen ready-to-eat mushroom pieces) compliant with HACCP and ISO 22000. Operations sit within Istanbul's commercial catchment in Türkiye, close to consumer markets, export ports, and European road corridors. The opportunity is structured as a clearly defined equity participation with a 50/50 annual profit distribution, quarterly reporting, annual audit, and structured governance. Note: figures are estimated and preliminary, based on an investment memorandum and documented operating performance, and do not replace technical, legal and financial due diligence; full details, the company's identity, and its exact location are disclosed to approved investors after a non-disclosure agreement is signed, per the platform's policy. Identity, brand, exact locations, and any sensitive identifying details have been intentionally omitted from this version.",
    },
    zh: {
      title: "皇家平菇生产与香脆蘑菇加工 — 土耳其伊斯坦布尔",
      summary:
        "位于土耳其伊斯坦布尔食品农业领域的成长资本投资机会：一家成熟且完全持牌的公司，经营一座综合设施，在无菌、气候受控的环境中全年生产皇家平菇（侧耳属），已商业运营六个多月，日产量接近一吨。公司现寻求战略合作伙伴，为一项转型升级提供资金——建设一座专门生产即食冷冻「香脆蘑菇」零食（四种口味）的工厂——从单一鲜品供应商转型为多产品食品加工商，服务本地零售、餐饮酒店（HORECA）行业，并出口至海湾地区和欧盟。",
      highlights: [
        "已运营、盈利且完全持牌的公司——投资于既定的扩张，而非从零起步的项目",
        "现有资产经独立评估约 296 万美元，为所需资本提供约 1.5 倍覆盖",
        "目前鲜菇日产量约 1,000 公斤；持牌产能约 377,731 公斤/年，分布于 14 间气候受控菇房",
        "「香脆蘑菇」产品——首创品类，无直接竞争对手，四种口味（香辣 / 奶酪 / 鸡肉 / 调味）",
        "垂直整合：原料（蘑菇）来自公司自有农场——保护利润率、稳定成本",
        "所需成长资本约 196 万美元：工厂建设 + 营运资金 + 应急储备",
        "利润按年 50/50 分配 • 约 2.9 年收回资本 • 三年累计投资回报率约 178.8%",
        "均衡的目标市场：土耳其 50% • 欧盟 25% • 海湾及阿拉伯地区 25%（产品原生清真）",
        "产能可扩展：第一阶段 10,000 包/日，第三年自筹资金翻倍至 20,000 包/日",
      ].join("\n"),
      details:
        "该项目将一座成熟设施（在无菌、气候受控系统中栽培皇家平菇：基质制备、接种、培养与生长、出菇与采收、包装，分布于 14 间隔热菇房）与一项面向增值食品加工的新扩张（「香脆蘑菇」生产线：裹粉、油炸、冷冻的即食蘑菇块，符合 HACCP 与 ISO 22000）相结合。运营地点位于土耳其伊斯坦布尔的商业辐射范围内，靠近消费市场、出口港口和欧洲公路走廊。该机会以清晰界定的股权参与方式架构，利润按 50/50 每年分配，并设有季度报告、年度审计和规范治理。注：以上数字为初步估算，基于一份投资备忘录和有据可查的运营业绩，不能替代技术、法律和财务尽职调查；完整细节、公司身份及其确切位置将在签署保密协议后，按平台政策向经批准的投资者披露。身份、品牌、确切位置及任何敏感识别信息已从本版本中有意省略。",
    },
    tr: {
      title:
        "Kraliyet İstiridye Mantarı Üretimi ve Çıtır Mantar İşleme — İstanbul, Türkiye",
      summary:
        "Türkiye, İstanbul'da gıda-tarım sektöründe bir büyüme sermayesi fırsatı: steril, iklim kontrollü bir ortamda yıl boyunca Kraliyet İstiridye Mantarı (Pleurotus) üreten entegre bir tesisi işleten, köklü ve tam lisanslı bir şirket; altı aydan uzun süredir ticari olarak faal ve günlük üretimi bir tona yaklaşıyor. Şirket şimdi dönüştürücü bir genişlemeyi finanse edecek stratejik bir ortak arıyor — yemeye hazır dondurulmuş «Çıtır Mantar» atıştırmalıkları için (dört çeşni) özel bir fabrika — böylece tek hatlı bir taze ürün tedarikçisinden; yerel perakendeye, HORECA sektörüne ve Körfez ile Avrupa Birliği'ne ihracata hizmet eden çok ürünlü bir gıda işleyicisine dönüşecek.",
      highlights: [
        "Faal, kârlı ve tam lisanslı şirket — sıfırdan bir proje değil, tanımlı bir genişleme finanse ediliyor",
        "Mevcut varlık tabanı bağımsız olarak ~2,96 milyon ABD doları değerinde; aranan sermayeye ~1,5× teminat sağlar",
        "Mevcut üretim ~1.000 kg/gün taze mantar; 14 iklim kontrollü odada ~377.731 kg/yıl lisanslı kapasite",
        "«Çıtır Mantar» ürünü — doğrudan rakibi olmayan, türünün ilki bir kategori; dört çeşni (acı / peynir / tavuk / baharatlı)",
        "Dikey entegrasyon: ham madde (mantar) şirketin kendi çiftliğinden — marj koruması ve maliyet istikrarı",
        "Aranan büyüme sermayesi ~1,96 milyon ABD doları: fabrika kurulumu + işletme sermayesi + acil durum rezervi",
        "Yıllık 50/50 kâr dağıtımı • ~2,9 yılda sermaye geri dönüşü • üç yılda ~%178,8 kümülatif getiri",
        "Dengeli hedef pazarlar: Türkiye %50 • Avrupa Birliği %25 • Körfez ve Arap dünyası %25 (doğal Helal ürünler)",
        "Ölçeklenebilir kapasite: 1. Aşamada 10.000 paket/gün, 3. Yılda kendi kaynağıyla 20.000'e iki katına çıkar",
      ].join("\n"),
      details:
        "Proje; Kraliyet İstiridye Mantarı'nı steril, iklim kontrollü bir sistemde (substrat hazırlama, aşılama, inkübasyon ve büyüme, hasat, paketleme) 14 yalıtımlı üretim odasında yetiştiren köklü bir tesisi; HACCP ve ISO 22000 ile uyumlu bir «Çıtır Mantar» hattı (kaplanmış, kızartılmış, dondurulmuş yemeye hazır mantar parçaları) aracılığıyla katma değerli gıda işlemeye yönelik yeni bir genişlemeyle birleştirir. Faaliyet, Türkiye'de İstanbul'un ticari etki alanı içinde; tüketim pazarlarına, ihracat limanlarına ve Avrupa kara yolu koridorlarına yakın konumdadır. Fırsat; yıllık 50/50 kâr dağıtımı, üç aylık raporlama, yıllık denetim ve yapılandırılmış yönetişim ile net tanımlı bir öz sermaye katılımı olarak kurgulanmıştır. Not: Rakamlar ön niteliktedir ve bir yatırım memorandumuna ve belgelenmiş operasyonel performansa dayalı tahminlerdir; teknik, hukuki ve mali durum tespitinin yerine geçmez; tüm ayrıntılar, şirketin kimliği ve kesin konumu, bir gizlilik sözleşmesi imzalandıktan sonra platform politikasına göre onaylı yatırımcıya açıklanır. Kimlik, marka, kesin konumlar ve hassas tanımlayıcı bilgiler bu sürümden bilinçli olarak çıkarılmıştır.",
    },
  },
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
  "مشروع أراضٍ سكنية بإطلالة بحرية بانورامية — منطقة بافوس، قبرص": {
    en: {
      title: "Sea-View Residential Land Development — Paphos Region, Cyprus",
      summary:
        "A residential land development on an elevated green hillside in one of Cyprus's most scenic coastal regions, with open panoramic Mediterranean sea views. The site is planned for division into serviced residential building plots, with an approved subdivision permit and a registered title — combining a premier EU location with a clear, de-risked legal foundation.",
      highlights: [
        "Open panoramic sea views from an elevated green hillside",
        "Approved permit to subdivide the land into residential building plots",
        "Registered title deed — a secure, transparent legal foundation",
        "Defined planning zone governing permitted use and building density",
        "Within the EU: stable legal framework and strong property rights",
        "Sought-after coastal region with sustained international demand for land and homes",
        "Multiple return paths: sell serviced plots • build villas for sale/rental • hold for capital growth",
      ].join("\n"),
      details:
        "The project lies within the EU in a coastal region of Cyprus, on an elevated green hillside with panoramic views over the sea and surrounding countryside. The site is planned for division into serviced residential building plots positioned to capture the open view. The essentials that typically delay projects are already resolved: ownership is registered, the subdivision permit is approved, and the planning zone is defined. The opportunity offers multiple return paths — developing and selling plots, building villas, or holding for capital appreciation as the region matures. Note: the information is preliminary and indicative and does not constitute an offer or legal or financial advice; full details (areas, figures, exact location and terms) are disclosed to approved investors per the platform's policy. Names, registration numbers and other sensitive details have been intentionally omitted from this version.",
    },
    zh: {
      title: "海景住宅用地开发项目 — 塞浦路斯帕福斯地区",
      summary:
        "位于塞浦路斯风景最为秀美的海岸地区之一、地势高耸的青翠山坡上的住宅用地开发项目，坐拥开阔的地中海全景海景。该地块已规划分割为配套完善的住宅建筑地块，持有经批准的分割许可并完成产权登记——将欧盟一流地段与清晰、降低风险的法律基础融为一体。",
      highlights: [
        "立于青翠高坡，坐拥开阔的全景海景",
        "已获批准将土地分割为住宅建筑地块的许可",
        "已登记的产权证——安全、透明的法律基础",
        "明确的规划分区，界定允许用途与建筑密度",
        "地处欧盟境内：法律框架稳定，产权保障有力",
        "热门海岸地区，土地与住宅持续吸引国际需求",
        "多元回报路径：出售配套地块 • 建造别墅出售/出租 • 持有以获取资本增值",
      ].join("\n"),
      details:
        "项目位于欧盟境内的塞浦路斯海岸地区，坐落于地势高耸的青翠山坡之上，可饱览大海与周边乡野的全景。地块已规划分割为配套完善的住宅建筑地块，并经精心定位以坐拥开阔海景。通常拖延项目的关键环节均已解决：产权已登记，分割许可已获批，规划分区已明确。该机会提供多元回报路径——开发并出售地块、建造别墅，或随区域成熟而持有以获取资本增值。注：以上信息为初步及介绍性内容，不构成要约或法律、财务建议；完整细节（面积、数字、确切位置及条款）将按平台政策向经批准的投资者披露。本版本已有意省略姓名、登记编号及其他敏感信息。",
    },
    tr: {
      title: "Deniz Manzaralı Konut Arsa Projesi — Baf Bölgesi, Kıbrıs",
      summary:
        "Kıbrıs'ın en güzel kıyı bölgelerinden birinde, yüksek ve yeşil bir yamaçta yer alan, açık panoramik Akdeniz deniz manzarasına sahip bir konut arsa projesi. Arazi, altyapısı hazır konut imar parsellerine bölünmek üzere planlanmıştır; onaylı ifraz izni ve tescilli tapusu mevcuttur — birinci sınıf bir AB konumunu açık ve riski azaltılmış bir hukuki temelle birleştirir.",
      highlights: [
        "Yüksek ve yeşil bir yamaçtan açık panoramik deniz manzarası",
        "Araziyi konut imar parsellerine bölmek için onaylı izin",
        "Tescilli tapu — güvenli ve şeffaf bir hukuki temel",
        "İzin verilen kullanımı ve yapılaşma yoğunluğunu belirleyen tanımlı imar bölgesi",
        "AB içinde: istikrarlı hukuki çerçeve ve güçlü mülkiyet hakları",
        "Arsa ve konutlara sürekli uluslararası talebin olduğu rağbet gören bir kıyı bölgesi",
        "Çoklu getiri yolu: altyapılı parsel satışı • satış/kiralama için villa inşası • değer artışı için elde tutma",
      ].join("\n"),
      details:
        "Proje, Kıbrıs'ın bir kıyı bölgesinde, AB sınırları içinde; deniz ve çevredeki kırsal alana panoramik manzaraya sahip, yüksek ve yeşil bir yamaçta yer alır. Arazi, açık manzarayı yakalayacak şekilde konumlandırılmış, altyapısı hazır konut imar parsellerine bölünmek üzere planlanmıştır. Projeleri genellikle geciktiren temel unsurlar zaten çözülmüştür: mülkiyet tescillidir, ifraz izni onaylıdır ve imar bölgesi tanımlıdır. Fırsat birden fazla getiri yolu sunar — parselleri geliştirip satmak, villa inşa etmek veya bölge geliştikçe sermaye değer artışı için elde tutmak. Not: Bilgiler ön niteliktedir ve yalnızca bilgilendirme amaçlıdır; bir teklif veya hukuki ya da mali danışmanlık teşkil etmez; tüm ayrıntılar (alanlar, rakamlar, kesin konum ve koşullar) platform politikasına göre onaylı yatırımcıya açıklanır. İsimler, kayıt numaraları ve diğer hassas bilgiler bu sürümden bilinçli olarak çıkarılmıştır.",
    },
  },
  "موقع تطوير استراتيجي متعدد الاستخدامات — منطقة كونستانتسا، رومانيا": {
    en: {
      title: "Strategic Mixed-Use Development Site — Constanța Region, Romania",
      summary:
        "A high-value, flexible-use development site in Romania's Greater Constanța region — a gateway to the EU and Schengen area. Scalable from 64,330 to 132,700 sqm, licensed for residential, commercial, hospitality, data centers, and logistics/industrial uses, at the nexus of the Middle Corridor and Pan-European Corridor IV.",
      highlights: [
        "Flexible, scalable area: 64,330 – 132,700 sqm",
        "Multiple licensed uses: residential • commercial • hospitality • data center / tech campus • logistics & industry • tourism",
        "Multimodal connectivity: Black Sea Port (Constanța) + inland waterways via the Danube + road & rail",
        "Data-center ready: electrical capacity from 20–60 up to 100–200+ MW near 400/110 kV substations",
        "Independent water source: deep well (135 m, 7,000 L/h) + water, gas & fiber-optic networks",
        "Digital hub: Constanța is a landing point for international submarine cables with low latency to European internet hubs",
        "Clean legal status: plots free of liens and encumbrances, with land-registry extracts ready for due diligence",
      ].join("\n"),
      details:
        "The site lies within the EU and Schengen area in Romania's northern Constanța region, enabling the integration of modern residential communities with commercial retail, upscale hospitality, and industrial/technology facilities on a single large site. It benefits from proximity to the Port of Constanța (the largest port on the Black Sea) and inland-waterway access via the Danube–Main–Rhine to the ports of Rotterdam, Antwerp, and Germany, alongside road and rail links. The electrical infrastructure supports power-intensive projects such as data centers, with an on-site independent water source and high-capacity connectivity. Approximate investment range: €3.25–5.85 million depending on the plot scope and deal type. Note: the information is preliminary and indicative and does not constitute legal or financial advice; full details are disclosed to approved investors per the platform's policy.",
    },
    zh: {
      title: "战略性混合用途开发用地 — 罗马尼亚康斯坦察地区",
      summary:
        "位于罗马尼亚大康斯坦察地区的高价值、灵活用途开发用地，是通往欧盟和申根区的门户。面积可从 64,330 平方米扩展至 132,700 平方米，可用于住宅、商业、酒店、数据中心及物流/工业，地处中间走廊与泛欧第四走廊交汇处。",
      highlights: [
        "灵活可扩展的用地：64,330 – 132,700 平方米",
        "多种许可用途：住宅 • 商业 • 酒店 • 数据中心/科技园区 • 物流与工业 • 旅游",
        "多式联运连接：黑海港口（康斯坦察）+ 经多瑙河的内河航道 + 公路与铁路",
        "数据中心就绪：邻近 400/110 kV 变电站，电力容量从 20–60 兆瓦可达 100–200+ 兆瓦",
        "独立水源：深水井（135 米，7,000 升/小时）+ 供水、燃气和光纤网络",
        "数字枢纽：康斯坦察是国际海底电缆的登陆点，到欧洲互联网枢纽延迟低",
        "法律状态清晰：地块无抵押和权利负担，土地登记摘录已备妥可供尽职调查",
      ].join("\n"),
      details:
        "该用地位于罗马尼亚北部康斯坦察地区，处于欧盟和申根区内，可在一个大型场地上将现代住宅社区与商业零售、高端酒店及工业/科技设施融为一体。它毗邻康斯坦察港（黑海最大港口），并可经多瑙河–美因河–莱茵河内河航道通往鹿特丹、安特卫普及德国各港口，另有公路和铁路连接。电力基础设施可支持数据中心等高耗能项目，场地内设有独立水源及高容量通信。投资区间约为 325 万–585 万欧元，视地块范围和交易方式而定。注：以上信息为初步及介绍性内容，不构成法律或财务建议；完整细节将按平台政策向经批准的投资者披露。",
    },
    tr: {
      title: "Stratejik Karma Kullanımlı Geliştirme Arazisi — Köstence Bölgesi, Romanya",
      summary:
        "Romanya'nın Büyük Köstence bölgesinde, AB ve Schengen'e açılan kapıda yüksek değerli, esnek kullanımlı bir geliştirme arazisi. 64.330–132.700 m² arası ölçeklenebilir; konut, ticaret, konaklama, veri merkezleri ve lojistik/sanayi için lisanslı; Orta Koridor ile Pan-Avrupa IV. Koridoru'nun kesişiminde.",
      highlights: [
        "Esnek, ölçeklenebilir alan: 64.330 – 132.700 m²",
        "Çoklu lisanslı kullanım: konut • ticari • konaklama • veri merkezi / teknoloji kampüsü • lojistik ve sanayi • turizm",
        "Çok modlu bağlantı: Karadeniz Limanı (Köstence) + Tuna üzerinden iç su yolları + kara ve demir yolu",
        "Veri merkezine hazır: 400/110 kV trafo merkezleri yakınında 20–60'tan 100–200+ MW'a elektrik kapasitesi",
        "Bağımsız su kaynağı: derin kuyu (135 m, 7.000 L/saat) + su, gaz ve fiber optik şebekeleri",
        "Dijital merkez: Köstence, Avrupa internet merkezlerine düşük gecikmeli uluslararası denizaltı kablolarının iniş noktasıdır",
        "Temiz hukuki durum: ipotek ve takyidattan ari parseller, durum tespiti için hazır tapu kaydı özetleri",
      ].join("\n"),
      details:
        "Saha, Romanya'nın kuzeyindeki Köstence bölgesinde AB ve Schengen alanı içinde yer alır; modern konut topluluklarını ticari perakende, üst düzey konaklama ve sanayi/teknoloji tesisleriyle tek bir geniş alanda birleştirmeye olanak tanır. Köstence Limanı'na (Karadeniz'in en büyük limanı) yakınlıktan ve Tuna–Main–Ren üzerinden Rotterdam, Anvers ve Almanya limanlarına iç su yolu erişiminden, ayrıca kara ve demir yolu bağlantılarından yararlanır. Elektrik altyapısı, veri merkezleri gibi enerji yoğun projeleri destekler; sahada bağımsız su kaynağı ve yüksek kapasiteli bağlantı bulunur. Yaklaşık yatırım aralığı: parsel kapsamına ve işlem türüne göre 3,25–5,85 milyon avro. Not: Bilgiler ön niteliktedir ve yalnızca bilgilendirme amaçlıdır; hukuki veya mali danışmanlık teşkil etmez; tüm ayrıntılar platform politikasına göre onaylı yatırımcıya açıklanır.",
    },
  },
  "مشروع مقالع وتصنيع رخام متكامل — الساحل السوري": {
    en: {
      title: "Integrated Marble Quarrying & Processing Project — Syrian Coast",
      summary:
        "An investment opportunity in Syria's marble sector: establishing an organized company that operates four marble quarries on and around the Syrian coast, combining the sale of raw blocks with the production of cut-and-polished slabs and tiles. The phase-one model ramps up the quarries gradually and uses nearby cutting workshops to reduce risk before building a large in-house facility, with each marble type clearly classified by color, quality and use — targeting the local market first (Damascus, then Homs, then Aleppo) before expanding.",
      highlights: [
        "Four marble quarries with full capacity of ~37,440 tons/year",
        "Multiple revenue streams: raw blocks • cut & polished slabs • finished tiles",
        "Attractive margin: low extraction cost versus much higher sale prices",
        "Low-risk phase one via external cutting workshops before an in-house plant",
        "Large, multi-channel local market: projects & contractors, workshops, wholesalers, showrooms",
        "~USD 2.0 million initial investment with a clear partnership structure (operator / financier / commercial coordinator)",
        "Scaling plan: estimated revenue growing from ~USD 4.97M to ~USD 11.9M over three years",
      ].join("\n"),
      details:
        "The project is built on operating four marble quarries on and around the Syrian coast within a limited-liability company based in Damascus, aiming to build an organized entity with greater production and marketing capacity than traditional workshops. Operations begin gradually, relying on nearby cutting workshops to mitigate the risk of building a large in-house plant before quality and market are tested, with each marble type classified by color, quality and use and a catalog of polished samples prepared. The model targets the local market first (Damascus, then Homs, then Aleppo) through multiple channels: projects and contractors, marble workshops, wholesalers and showrooms, with raw-block sales available when needed. Note: figures are estimated and preliminary, based on operational inputs and samples, and do not replace technical, legal and commercial due diligence; full details are disclosed to approved investors per the platform's policy. Exact locations and any sensitive identifying details have been intentionally omitted from this version.",
    },
    zh: {
      title: "大理石采石与加工一体化项目 — 叙利亚沿海地区",
      summary:
        "叙利亚大理石行业的投资机会：成立一家规范化公司，运营叙利亚沿海及周边的四座大理石矿场，将原石块销售与切割抛光后的板材和地砖生产相结合。第一阶段模式逐步提升矿场产能，并利用附近的切割工坊降低风险，待质量与市场验证后再建设大型自有加工厂；各类大理石按颜色、品质和用途明确分类，优先瞄准本地市场（先大马士革，再霍姆斯，后阿勒颇），随后再行扩张。",
      highlights: [
        "四座大理石矿场，满负荷产能约 37,440 吨/年",
        "多元收入来源：原石块 • 切割抛光板材 • 成品地砖",
        "可观利润：开采成本低，而销售价格高出许多",
        "低风险第一阶段：先用外部切割工坊，后建自有加工厂",
        "庞大且多渠道的本地市场：工程与承包商、工坊、批发商、展厅",
        "初始投资约 200 万美元，合伙结构清晰（运营方 / 出资方 / 商务协调方）",
        "增长规划：预计收入三年内从约 497 万美元增至约 1,190 万美元",
      ].join("\n"),
      details:
        "该项目以在叙利亚沿海及周边运营四座大理石矿场为基础，由一家总部位于大马士革的有限责任公司经营，旨在打造一个产能与营销能力均优于传统工坊的规范化实体。运营逐步展开，先依托附近的切割工坊，以降低在质量和市场得到验证之前就建设大型自有加工厂的风险；各类大理石按颜色、品质和用途分类，并备有抛光样品目录。该模式优先瞄准本地市场（先大马士革，再霍姆斯，后阿勒颇），通过多种渠道销售：工程与承包商、大理石工坊、批发商和展厅，并可在需要时销售原石块。注：以上数字为初步估算，基于运营输入与样品，不能替代技术、法律和商业尽职调查；完整细节将按平台政策向经批准的投资者披露。本版本已有意省略确切位置及任何敏感识别信息。",
    },
    tr: {
      title: "Entegre Mermer Ocakçılığı ve İşleme Projesi — Suriye Kıyısı",
      summary:
        "Suriye'nin mermer sektöründe bir yatırım fırsatı: Suriye kıyısında ve çevresinde dört mermer ocağını işleten, ham blok satışını kesilip parlatılmış plaka ve fayans üretimiyle birleştiren düzenli bir şirketin kurulması. Birinci aşama modeli, ocakları kademeli olarak devreye alır ve büyük bir kendi tesisini kurmadan önce riski azaltmak için yakındaki kesim atölyelerinden yararlanır; her mermer türü renk, kalite ve kullanıma göre net biçimde sınıflandırılır — önce yerel pazar (önce Şam, sonra Humus, sonra Halep) hedeflenir, ardından genişleme planlanır.",
      highlights: [
        "Tam kapasitesi ~37.440 ton/yıl olan dört mermer ocağı",
        "Çoklu gelir akışı: ham bloklar • kesilmiş ve parlatılmış plakalar • hazır fayanslar",
        "Cazip marj: düşük çıkarma maliyetine karşılık çok daha yüksek satış fiyatları",
        "Düşük riskli birinci aşama: kendi tesisinden önce dış kesim atölyeleri",
        "Geniş, çok kanallı yerel pazar: projeler ve müteahhitler, atölyeler, toptancılar, showroom'lar",
        "~2,0 milyon ABD doları başlangıç yatırımı ve net ortaklık yapısı (işletmeci / finansör / ticari koordinatör)",
        "Ölçeklenme planı: tahmini gelir üç yılda ~4,97 milyon dolardan ~11,9 milyon dolara yükselir",
      ].join("\n"),
      details:
        "Proje, Şam merkezli bir limited şirket bünyesinde, Suriye kıyısında ve çevresinde dört mermer ocağının işletilmesine dayanır; amacı geleneksel atölyelerden daha yüksek üretim ve pazarlama kapasitesine sahip düzenli bir kuruluş oluşturmaktır. Faaliyetler kademeli başlar; kalite ve pazar test edilmeden önce büyük bir kendi tesisini kurma riskini azaltmak için yakındaki kesim atölyelerine dayanılır; her mermer türü renk, kalite ve kullanıma göre sınıflandırılır ve parlatılmış numune kataloğu hazırlanır. Model önce yerel pazarı hedefler (önce Şam, sonra Humus, sonra Halep); projeler ve müteahhitler, mermer atölyeleri, toptancılar ve showroom'lar gibi birden fazla kanaldan satış yapılır, gerektiğinde ham blok satışı da mümkündür. Not: Rakamlar ön niteliktedir ve operasyonel girdilere ve numunelere dayalı tahminlerdir; teknik, hukuki ve ticari durum tespitinin yerine geçmez; tüm ayrıntılar platform politikasına göre onaylı yatırımcıya açıklanır. Kesin konumlar ve hassas tanımlayıcı bilgiler bu sürümden bilinçli olarak çıkarılmıştır.",
    },
  },
  "مشروع ضاحية سكنية متكاملة — قرب مطار دمشق الدولي": {
    en: {
      title: "Integrated Residential Suburb Development — Near Damascus International Airport",
      summary:
        "An opportunity to participate in developing an integrated residential suburb on a fully privately-owned 282-dunum (28.2-hectare) contiguous parcel near Damascus City and Damascus International Airport. The project is an organized urban community of 169 buildings and 5,408 apartments, with an internal road network, services, amenities, green areas and full infrastructure. It is structured through a Special Purpose Vehicle (SPV) registered under the new Investment Law to capture customs and tax exemptions, with an estimated total cost of ~USD 145–196 million against projected revenue of ~USD 260–324 million over a phased 5–7 year build-out.",
      highlights: [
        "Strategic location near the capital Damascus and its international airport, on major road corridors",
        "Fully privately-owned, contiguous 282-dunum (28.2-ha) parcel — a rare asset around Damascus",
        "Integrated suburb: 169 buildings, 5,408 apartments (120 m²) with full infrastructure, amenities and green space",
        "New Investment Law incentives: customs exemption on imported inputs, tax exemptions, and capital/profit repatriation guarantees",
        "Strong economics: ~USD 145–196M estimated total cost against ~USD 260–324M projected revenue",
        "Projected gross profit of USD 64–180M across scenarios (realistic average ~USD 120M)",
        "Phased delivery across four phases over 5–7 years, reducing financing and market-oversupply risk",
      ].join("\n"),
      details:
        "The project develops an integrated residential suburb — not merely a cluster of buildings — as an organized urban community comprising modern residential units of varied sizes, an internal road network with structured parking, green areas and public gardens, essential commercial, educational and healthcare facilities, and comprehensive infrastructure (water, electricity, sewage, telecommunications). The site spans 282 dunum with a 60% build ratio and 40% for roads, services and green areas, totaling 169 eight-floor buildings and 5,408 apartments of 120 m² each (net saleable area ~648,960 m²). A Special Purpose Vehicle (SPV) combining the landowner and the developer is registered under the new Investment Law to capture full customs exemption on imported inputs, tax exemptions, licensing facilitation, and guarantees for profit and capital repatriation. The proposed model grants the landowner a 20–25% share of net saleable area, delivered progressively in line with construction milestones. Execution is phased across four phases over 5–7 years, with no new phase launched before 50–60% of the previous one is sold, targeting Syrian expatriates, real-estate investors, corporate and NGO employees, airport-area workers, and families. Note: figures are preliminary and indicative, based on current market assumptions, and do not replace engineering, legal, regulatory and marketing due diligence; full details and the exact location are disclosed to approved investors per the platform's policy. The owner's identity, the exact location and any sensitive details have been intentionally omitted from this version.",
    },
    zh: {
      title: "综合住宅新区开发项目 — 大马士革国际机场附近",
      summary:
        "参与开发一座综合住宅新区的机会：项目位于一块完全私有、面积达 282 杜诺（28.2 公顷）的连片地块上，毗邻大马士革市及大马士革国际机场。项目为一个有组织的城市社区，包含 169 栋楼宇和 5,408 套公寓，配有内部道路网络、各类服务设施、配套设施、绿地及完善的基础设施。项目通过一家依据新《投资法》注册的特殊目的公司（SPV）运作，以获取关税和税收减免；预计总成本约 1.45–1.96 亿美元，预计收入约 2.60–3.24 亿美元，分期开发周期为 5–7 年。",
      highlights: [
        "战略区位：毗邻首都大马士革及其国际机场，地处主要道路走廊",
        "完全私有、连片的 282 杜诺（28.2 公顷）地块——在大马士革周边实属稀缺",
        "综合新区：169 栋楼宇、5,408 套公寓（120 平方米），配套完善的基础设施、设施与绿地",
        "新《投资法》激励：进口投入物关税减免 + 税收减免及利润与资本汇回保障",
        "经济性强：预计总成本约 1.45–1.96 亿美元，预计收入约 2.60–3.24 亿美元",
        "预计毛利润在 6,400 万至 1.80 亿美元之间（现实均值约 1.20 亿美元）",
        "分四期、于 5–7 年内交付，降低融资及市场供过于求风险",
      ].join("\n"),
      details:
        "项目开发的是一座综合住宅新区——而非仅仅一组楼宇——作为一个有组织的城市社区，包含规模多样的现代住宅单元、配有规整停车位的内部道路网络、绿地与公共花园、必要的商业、教育和医疗设施，以及完善的基础设施（供水、供电、排污、通信）。地块总面积 282 杜诺，建筑占比 60%，其余 40% 用于道路、服务设施和绿地；共计 169 栋 8 层楼宇、5,408 套每套 120 平方米的公寓（净可售面积约 648,960 平方米）。项目设立一家结合土地所有者与开发商的特殊目的公司（SPV），并依据新《投资法》注册，以获取进口投入物的全额关税减免、税收减免、许可便利以及利润和资本汇回保障。拟议模式给予土地所有者净可售面积 20–25% 的份额，并随施工进度分阶段交付。项目分四期、于 5–7 年内实施，在前一期售出 50–60% 之前不启动新一期，目标客群包括叙利亚侨民、房地产投资者、企业及非政府组织员工、机场周边从业者和家庭。注：以上数字为初步及指示性内容，基于当前市场假设，不能替代工程、法律、监管和营销尽职调查；完整细节及确切位置将按平台政策向经批准的投资者披露。本版本已有意省略所有者身份、确切位置及任何敏感信息。",
    },
    tr: {
      title: "Entegre Konut Banliyösü Geliştirme Projesi — Şam Uluslararası Havalimanı Yakını",
      summary:
        "Şam şehri ve Şam Uluslararası Havalimanı yakınında, tamamen özel mülkiyete ait, bitişik 282 dönümlük (28,2 hektar) bir parselde entegre bir konut banliyösü geliştirmeye katılım fırsatı. Proje; 169 bina ve 5.408 daireden oluşan, iç yol ağı, hizmetler, donatılar, yeşil alanlar ve eksiksiz altyapıya sahip düzenli bir kentsel topluluktur. Yeni Yatırım Kanunu kapsamında tescil edilen bir Özel Amaçlı Şirket (SPV) aracılığıyla yapılandırılır ve gümrük ile vergi muafiyetlerinden yararlanır. Tahmini toplam maliyet ~145–196 milyon ABD doları, öngörülen gelir ise ~260–324 milyon ABD doları olup, 5–7 yıla yayılan aşamalı bir inşa süreci öngörülür.",
      highlights: [
        "Başkent Şam'a ve uluslararası havalimanına yakın stratejik konum, ana yol koridorları üzerinde",
        "Tamamen özel mülkiyete ait, bitişik 282 dönümlük (28,2 ha) parsel — Şam çevresinde nadir bir varlık",
        "Entegre banliyö: 169 bina, 5.408 daire (120 m²); eksiksiz altyapı, donatılar ve yeşil alan",
        "Yeni Yatırım Kanunu teşvikleri: ithal girdilerde gümrük muafiyeti + vergi muafiyetleri ve kâr/sermaye transfer garantileri",
        "Güçlü ekonomi: ~145–196 milyon dolar tahmini toplam maliyete karşılık ~260–324 milyon dolar öngörülen gelir",
        "Senaryolara göre 64–180 milyon dolar öngörülen brüt kâr (gerçekçi ortalama ~120 milyon dolar)",
        "5–7 yılda dört aşamada teslim; finansman ve pazar arz fazlası riskini azaltır",
      ].join("\n"),
      details:
        "Proje, yalnızca bir bina kümesi değil, entegre bir konut banliyösü geliştirir; farklı büyüklüklerde modern konut birimleri, düzenli otoparklı bir iç yol ağı, yeşil alanlar ve kamusal bahçeler, temel ticari, eğitim ve sağlık donatıları ve kapsamlı altyapı (su, elektrik, kanalizasyon, telekomünikasyon) içeren düzenli bir kentsel topluluk olarak tasarlanır. Saha 282 dönümdür; %60 yapılaşma oranı ve %40 yol, hizmet ve yeşil alan ayrımıyla toplam 169 adet 8 katlı bina ve her biri 120 m² olan 5.408 daire (net satılabilir alan ~648.960 m²) bulunur. Arazi sahibi ile geliştiriciyi birleştiren bir Özel Amaçlı Şirket (SPV) kurulur ve yeni Yatırım Kanunu kapsamında tescil edilerek ithal girdilerde tam gümrük muafiyeti, vergi muafiyetleri, ruhsat kolaylıkları ve kâr ile sermaye transfer garantileri elde edilir. Önerilen model, arazi sahibine net satılabilir alanın %20–25'i oranında, inşaat aşamalarına paralel olarak kademeli teslim edilen bir pay verir. Uygulama 5–7 yıl içinde dört aşamada yapılır; önceki aşamanın %50–60'ı satılmadan yeni aşama başlatılmaz. Hedef kitle Suriyeli gurbetçiler, gayrimenkul yatırımcıları, şirket ve STK çalışanları, havalimanı çevresi çalışanları ve ailelerdir. Not: Rakamlar ön niteliktedir ve mevcut piyasa varsayımlarına dayanır; mühendislik, hukuki, düzenleyici ve pazarlama durum tespitinin yerine geçmez; tüm ayrıntılar ve kesin konum platform politikasına göre onaylı yatırımcıya açıklanır. Sahibin kimliği, kesin konum ve hassas bilgiler bu sürümden bilinçli olarak çıkarılmıştır.",
    },
  },
  "مدينة مرجان الصناعية — مدينة صناعية متكاملة في ريف دمشق": {
    en: {
      title:
        "Murjan Industrial City — An Integrated Industrial City in Rural Damascus, Syria",
      summary:
        "A strategic opportunity to establish a fully integrated industrial city spanning ~1.5 million m² (1,500 dunums) in the Murjan area of Rural Damascus, developed over six successive phases (~250,000 m² each). The city offers ready-to-operate industrial units and fully serviced land plots for direct sale or long-term lease, within international-standard infrastructure and a pivotal logistics location ~35 km from Damascus and close to the Daraa–Suwayda highways and the southern border crossings. The project addresses a severe gap in organized industrial supply (≈75% unmet demand), with a supportive legal framework expected under Syria's modern Investment Law (tax and customs exemptions).",
      highlights: [
        "Total area ~1.5 million m² (1,500 dunums) developed over 6 phases (~250,000 m² each)",
        "Ready-to-operate industrial units (100–300 m² workshops, 300–1,000 m² factories) and serviced plots of 3,000–5,000 m²",
        "Three flexible commercial models: long-term lease (5–25 yrs) • direct sale (~USD 100/m²) • build-to-suit",
        "Pivotal logistics location: ~35 km from Damascus, near the Daraa & Suwayda highways and southern crossings (cuts transport costs 20–30%)",
        "International-standard infrastructure: heavy-truck roads • high-capacity power (solar-ready) • water & drainage • fiber optics",
        "Hybrid revenue model: leases 50% • service fees 30% • land sales 20% — stable, scalable cash flows",
        "Phase 1: ~USD 25M investment, ~USD 4M expected annual income, ~USD 2.5M net profit, 10–12% ROI p.a. (7–9 year payback)",
        "Supportive modern Investment Law (tax & customs exemptions) • clean individual land title • balanced LLC partnership",
      ].join("\n"),
      details:
        "The opportunity is built on developing a fully integrated industrial city in the Murjan area of Rural Damascus that delivers a ready-to-operate environment from day one: pre-built industrial units, flexible plots for custom development, and centralized services, within a clear legal and regulatory framework. The city is developed over six successive phases, distributing risk and reinvesting operating profits to fund subsequent phases — reducing upfront capital and improving return efficiency. The proposed partnership — through a Limited Liability Company — brings together the landowner (in-kind land contribution), the strategic investor (capital), and a specialized industrial-city operating partner, with equity calibrated to each party's contribution and independent valuation before incorporation. The project is expected to be registered under Syria's modern Investment Law to benefit from tax and customs exemptions and profit-repatriation facilities, potentially lifting effective profitability by more than 20% in the early years. Note: figures are estimated and preliminary, subject to a detailed feasibility study and due diligence after signing an initial MoU, and do not constitute a binding offer or legal or financial advice; full details are disclosed to approved investors per the platform's policy. The owner's identity, the exact location and any sensitive details have been intentionally omitted from this version.",
    },
    zh: {
      title: "穆尔詹工业城 — 叙利亚大马士革乡村的综合工业城",
      summary:
        "一个战略性机会：在大马士革乡村（Rural Damascus）的穆尔詹（Murjan）地区建设一座占地约 150 万平方米（1,500 杜诺亩）的综合工业城，分六个连续阶段开发（每阶段约 25 万平方米）。工业城提供可即时投产的工业单元和配套完善的地块，可直接出售或长期租赁，配备国际标准基础设施，并拥有距大马士革约 35 公里、毗邻德拉（Daraa）与苏韦达（Suwayda）高速及南部边境口岸的关键物流区位。项目填补了有组织工业用地供给的严重缺口（约 75% 需求未被满足），并有望依据叙利亚现代《投资法》获得支持性法律框架（税收与关税减免）。",
      highlights: [
        "总面积约 150 万平方米（1,500 杜诺亩），分 6 个阶段开发（每阶段约 25 万平方米）",
        "可即时投产的工业单元（100–300 平方米作坊、300–1,000 平方米厂房）及 3,000–5,000 平方米配套地块",
        "三种灵活商业模式：长期租赁（5–25 年）• 直接出售（约 100 美元/平方米）• 按需定制建造（build-to-suit）",
        "关键物流区位：距大马士革约 35 公里，毗邻德拉与苏韦达高速及南部口岸（运输成本降低 20–30%）",
        "国际标准基础设施：重型卡车道路 • 高容量供电（可接入太阳能）• 供水与排水 • 光纤",
        "混合收入模式：租金 50% • 服务费 30% • 土地销售 20% — 现金流稳定且可扩展",
        "第一阶段：投资约 2,500 万美元，预计年收入约 400 万美元，净利润约 250 万美元，年回报率 10–12%（7–9 年回本）",
        "现代《投资法》提供支持（税收与关税减免）• 土地产权单一且清晰 • 有限责任公司（LLC）均衡合伙结构",
      ].join("\n"),
      details:
        "该机会以在大马士革乡村穆尔詹地区建设一座综合工业城为基础，从第一天起即提供可投产环境：预建工业单元、可按投资者需求定制开发的灵活地块，以及集中式服务，并置于清晰的法律与监管框架之下。工业城分六个连续阶段开发，可分散风险并将运营利润再投资于后续阶段，从而降低前期资本需求、提升回报效率。拟议的合伙——通过一家有限责任公司——汇集土地所有者（以土地作价出资）、战略投资者（资金）以及专业的工业城运营合伙人，各方股权按其贡献并在公司成立前经独立评估确定。项目预计依据叙利亚现代《投资法》注册，以享受税收与关税减免及利润汇回便利，初期有望使有效盈利能力提升逾 20%。注：数字为初步估算，须在签署初步谅解备忘录后经详细可行性研究与尽职调查核定，且不构成具约束力的要约或法律、财务建议；完整细节将按平台政策向经批准的投资者披露。本版本已有意省略所有者身份、确切位置及任何敏感信息。",
    },
    tr: {
      title:
        "Murjan Sanayi Şehri — Suriye, Şam Kırsalında Entegre Bir Sanayi Şehri",
      summary:
        "Şam kırsalındaki (Rural Damascus) Murjan bölgesinde ~1,5 milyon m² (1.500 dönüm) alana yayılan, altı ardışık aşamada (~250.000 m² her biri) geliştirilen tam entegre bir sanayi şehri kurmak için stratejik bir fırsat. Şehir; uluslararası standartta altyapı ve Şam'a ~35 km mesafede, Dera–Suveyda otoyollarına ve güney sınır kapılarına yakın kritik bir lojistik konum içinde, doğrudan satış veya uzun vadeli kiralama için kullanıma hazır sanayi üniteleri ve altyapısı tamamlanmış arsalar sunar. Proje, organize sanayi arzındaki ciddi açığı (≈%75 karşılanmayan talep) gidermeye yöneliktir ve Suriye'nin modern Yatırım Yasası kapsamında destekleyici bir hukuki çerçeve (vergi ve gümrük muafiyetleri) beklenmektedir.",
      highlights: [
        "Toplam alan ~1,5 milyon m² (1.500 dönüm), 6 aşamada geliştirilir (~250.000 m² her biri)",
        "Kullanıma hazır sanayi üniteleri (100–300 m² atölyeler, 300–1.000 m² fabrikalar) ve 3.000–5.000 m² altyapılı arsalar",
        "Üç esnek ticari model: uzun vadeli kiralama (5–25 yıl) • doğrudan satış (~100 USD/m²) • ısmarlama inşa (build-to-suit)",
        "Kritik lojistik konum: Şam'a ~35 km, Dera ve Suveyda otoyollarına ve güney kapılarına yakın (nakliye maliyetinde %20–30 azalma)",
        "Uluslararası standartta altyapı: ağır kamyon yolları • yüksek kapasiteli elektrik (güneşe hazır) • su ve drenaj • fiber optik",
        "Hibrit gelir modeli: kira %50 • hizmet ücretleri %30 • arsa satışı %20 — istikrarlı ve ölçeklenebilir nakit akışı",
        "1. Aşama: ~25 milyon USD yatırım, ~4 milyon USD beklenen yıllık gelir, ~2,5 milyon USD net kâr, yıllık %10–12 getiri (7–9 yıl geri ödeme)",
        "Destekleyici modern Yatırım Yasası (vergi ve gümrük muafiyetleri) • temiz bireysel tapu • dengeli LLC ortaklığı",
      ].join("\n"),
      details:
        "Fırsat, Şam kırsalındaki Murjan bölgesinde ilk günden kullanıma hazır bir ortam sunan tam entegre bir sanayi şehrinin geliştirilmesine dayanır: önceden inşa edilmiş sanayi üniteleri, yatırımcının ihtiyacına göre geliştirilebilen esnek arsalar ve merkezi hizmetler; tümü açık bir hukuki ve düzenleyici çerçeve içinde. Şehir altı ardışık aşamada geliştirilir; bu, riski dağıtır ve işletme kârlarının sonraki aşamaları finanse etmek üzere yeniden yatırılmasını sağlar — ön sermaye ihtiyacını azaltır ve getiri verimliliğini artırır. Önerilen ortaklık — bir limited şirket aracılığıyla — arazi sahibini (ayni arazi katkısı), stratejik yatırımcıyı (sermaye) ve sanayi şehri yönetiminde uzman bir işletme ortağını bir araya getirir; paylar her tarafın katkısına göre ve kuruluştan önce bağımsız değerleme ile belirlenir. Projenin, vergi ve gümrük muafiyetleri ile kâr transfer kolaylıklarından yararlanmak üzere Suriye'nin modern Yatırım Yasası kapsamında tescil edilmesi beklenmektedir; bu, ilk yıllarda etkin kârlılığı %20'den fazla artırabilir. Not: Rakamlar ön niteliktedir; bir ön mutabakat zaptının (MoU) imzalanmasının ardından ayrıntılı fizibilite çalışması ve durum tespiti ile kesinleşecektir ve bağlayıcı bir teklif ya da hukuki/mali danışmanlık teşkil etmez; tüm ayrıntılar platform politikasına göre onaylı yatırımcıya açıklanır. Sahibin kimliği, kesin konum ve hassas bilgiler bu sürümden bilinçli olarak çıkarılmıştır.",
    },
  },
  "مدرسة خاصة حديثة بطاقة 3000 طالب — جرمانا، ريف دمشق": {
    en: {
      title: "Modern Private School — 3,000-Student Capacity, Jaramana, Rural Damascus",
      summary:
        "An investment opportunity in Syria's private-education sector: developing a modern private school with capacity for up to 3,000 students in the Jaramana district of Rural Damascus, targeting middle- and upper-income families. The project is structured as a land-for-equity partnership with the owners of a licensed 21,500 m² plot, with a valid, renewable educational license and a licensed built-up area of approximately 14,000 m². A phased operating model starts at 500 students and grows annually toward full capacity, with USD-indexed annual tuition.",
      highlights: [
        "Capacity for up to 3,000 students on a 21,500 m² plot with ~14,000 m² of licensed built-up area",
        "Private-school license from the Ministry of Education — valid and renewable",
        "Land-for-equity partnership with the landowners — reducing the real-estate capital requirement",
        "Strategic location in Jaramana, Rural Damascus — a densely populated area",
        "Recurring-revenue model: USD-indexed annual tuition averaging ~USD 2,000 per student",
        "Phased growth from 500 students, adding ~700 students per year to full capacity",
        "Estimated ~USD 5 million build-and-fit-out over 18 months, with break-even expected in the second year of operation",
      ].join("\n"),
      details:
        "The project develops a modern private school in the Jaramana district of Rural Damascus through a partnership between the investor and the landowners on a land-for-equity basis: the licensed 21,500 m² plot is contributed to the project's capital in exchange for an ownership share, and the owners are willing to accept an independent valuation as part of the feasibility study. A renewable educational license from the Ministry of Education is in place, with a licensed built-up area of approximately 14,000 m² across multiple floors. Operations will run in partnership with a specialized educational operator to be selected later, with the curriculum and teaching language agreed jointly. The school opens with 500 students in Year 1 and grows by ~700 students per year toward a maximum capacity of 3,000, on USD-indexed annual tuition collected in four installments. Construction and fit-out are estimated at about USD 5 million over an 18-month build period, with break-even expected in the second year of operation and annual profit distributions thereafter. Note: figures are estimated and preliminary and do not replace technical, legal and financial due diligence; full details are disclosed to approved investors per the platform's policy. Sensitive identifying details (the owners' identity and the exact cadastral location) have been intentionally omitted from this version.",
    },
    zh: {
      title: "现代私立学校 — 3000 名学生容量，杰拉曼那，大马士革乡村省",
      summary:
        "叙利亚私立教育领域的投资机会：在大马士革乡村省杰拉曼那（Jaramana）地区开发一所容量达 3000 名学生的现代私立学校，面向中高收入家庭。项目采用与一块 21,500 平方米持牌土地的业主之间的「土地换股权」合伙结构，持有有效且可续期的教育许可证，以及约 14,000 平方米的持牌建筑面积。采用分阶段运营模式，从 500 名学生起步并逐年增长至满负荷，年学费以美元计价。",
      highlights: [
        "在 21,500 平方米地块上、约 14,000 平方米持牌建筑面积，可容纳多达 3000 名学生",
        "教育部颁发的私立学校许可证——有效且可续期",
        "与土地业主的「土地换股权」合伙——降低房地产资本需求",
        "地处大马士革乡村省杰拉曼那的战略位置——人口密集地区",
        "经常性收入模式：以美元计价的年学费，人均约 2,000 美元",
        "从 500 名学生分阶段增长，每年增加约 700 名学生至满负荷",
        "18 个月内建设与装修费用约 500 万美元，预计运营第二年实现盈亏平衡",
      ].join("\n"),
      details:
        "项目通过投资者与土地业主之间以「土地换股权」为基础的合伙，在大马士革乡村省杰拉曼那地区开发一所现代私立学校：持牌的 21,500 平方米地块以换取股权的方式注入项目资本，业主愿意在可行性研究中接受独立估值。项目持有教育部颁发的可续期教育许可证，并拥有约 14,000 平方米的多层持牌建筑面积。运营将与日后选定的专业教育运营方合作进行，课程与教学语言经协商共同确定。学校第一年招收 500 名学生，每年增加约 700 名学生，直至 3000 名学生的最大容量；年学费以美元计价，分四期收取。建设与装修预计在 18 个月的工期内约需 500 万美元，预计运营第二年实现盈亏平衡，此后按年分配利润。注：上述数字为初步估算，不能替代技术、法律和财务尽职调查；完整细节将按平台政策向经批准的投资者披露。本版本已有意省略敏感识别信息（业主身份及确切地籍位置）。",
    },
    tr: {
      title: "Modern Özel Okul — 3.000 Öğrenci Kapasiteli, Cermana, Şam Kırsalı",
      summary:
        "Suriye'nin özel eğitim sektöründe bir yatırım fırsatı: Şam Kırsalı'nın Cermana (Jaramana) bölgesinde 3.000 öğrenciye kadar kapasiteli modern bir özel okulun geliştirilmesi; orta ve üst gelir grubundaki aileleri hedefler. Proje, lisanslı 21.500 m²'lik bir arsanın sahipleriyle «arsa karşılığı hisse» ortaklığı olarak yapılandırılmıştır; geçerli ve yenilenebilir bir eğitim lisansı ve yaklaşık 14.000 m² ruhsatlı inşaat alanı bulunur. Kademeli işletme modeli 500 öğrenciyle başlar ve tam kapasiteye doğru her yıl büyür; yıllık ücretler ABD dolarına endekslidir.",
      highlights: [
        "21.500 m² arsa üzerinde ~14.000 m² ruhsatlı inşaat alanıyla 3.000 öğrenciye kadar kapasite",
        "Millî Eğitim Bakanlığı'ndan özel okul lisansı — geçerli ve yenilenebilir",
        "Arsa sahipleriyle «arsa karşılığı hisse» ortaklığı — gayrimenkul sermaye ihtiyacını azaltır",
        "Şam Kırsalı, Cermana'da stratejik konum — yoğun nüfuslu bir bölge",
        "Tekrarlayan gelir modeli: öğrenci başına ortalama ~2.000 ABD doları, USD'ye endeksli yıllık ücret",
        "500 öğrenciden kademeli büyüme; tam kapasiteye yılda ~700 öğrenci ekleme",
        "18 ayda ~5 milyon ABD doları inşaat ve donanım; işletmenin ikinci yılında başabaş beklentisi",
      ].join("\n"),
      details:
        "Proje, yatırımcı ile arsa sahipleri arasında «arsa karşılığı hisse» esasına dayalı bir ortaklıkla Şam Kırsalı'nın Cermana bölgesinde modern bir özel okul geliştirir: lisanslı 21.500 m²'lik arsa, bir mülkiyet payı karşılığında projenin sermayesine katılır ve sahipler, fizibilite çalışması kapsamında bağımsız bir değerlemeyi kabul etmeye hazırdır. Millî Eğitim Bakanlığı'ndan yenilenebilir bir eğitim lisansı mevcuttur; çok katlı olarak yaklaşık 14.000 m² ruhsatlı inşaat alanı bulunur. İşletme, daha sonra seçilecek uzman bir eğitim operatörüyle ortaklıkla yürütülür; müfredat ve eğitim dili birlikte kararlaştırılır. Okul, birinci yıl 500 öğrenciyle açılır ve 3.000 öğrencilik azami kapasiteye doğru yılda ~700 öğrenci artar; yıllık ücretler ABD dolarına endeksli olup dört taksitte tahsil edilir. İnşaat ve donanım, 18 aylık bir yapım süresinde yaklaşık 5 milyon ABD doları olarak tahmin edilmektedir; işletmenin ikinci yılında başabaş ve sonrasında yıllık kâr dağıtımı beklenir. Not: Rakamlar tahminî ve ön niteliktedir; teknik, hukuki ve malî durum tespitinin yerine geçmez; tüm ayrıntılar platform politikasına göre onaylı yatırımcıya açıklanır. Hassas tanımlayıcı bilgiler (sahiplerin kimliği ve kesin kadastral konum) bu sürümden bilinçli olarak çıkarılmıştır.",
    },
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
  if (!tr) return pv;
  return {
    ...pv,
    displayTitle: tr.title,
    summary: tr.summary,
    ...(tr.highlights ? { highlights: tr.highlights } : {}),
    ...(tr.details ? { details: tr.details } : {}),
  };
}
