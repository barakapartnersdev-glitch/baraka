// بذور قسم «وجهات الاستثمار»: 6 دول × 4 لغات (ar / en / tr / zh).
// محتوى أوّلي احترافي + SEO قابل للتعديل بالكامل من لوحة الإدارة.
// التشغيل: node prisma/seed-destinations.mjs   (أو: npm run db:seed:destinations)
// idempotent: يعتمد upsert على countryKey و(destinationId, locale).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===== حقول عامة مشتركة لكل لغة (يمكن للإدارة تخصيصها لاحقاً لكل دولة) =====
const COMMON = {
  ar: {
    whyInvestTitle: "لماذا الاستثمار في هذه الدولة؟",
    keySectorsTitle: "القطاعات الاستثمارية الواعدة",
    opportunityTypesTitle: "أنواع الفرص الاستثمارية المتاحة",
    opportunityTypesList: [
      "شراكات تشغيلية",
      "تمويل مشاريع قائمة",
      "شراء حصص",
      "تطوير أصول",
      "مشاريع إنتاجية",
      "مشاريع تصديرية",
      "فرص عقارية",
      "مشاريع خاصة",
    ],
    investorNotesTitle: "معلومات أولية للمستثمر",
    investorNotesPoints: [
      "الوضع القانوني للمشروع",
      "وثائق الملكية",
      "التراخيص اللازمة",
      "دراسة الجدوى",
      "الشريك المحلي",
      "الضرائب وتحويل الأرباح",
      "المخاطر السياسية والتجارية",
      "آلية الخروج من الاستثمار",
      "الضمانات المتاحة",
    ],
    disclaimerText:
      "المعلومات الواردة في هذه الصفحة هي معلومات عامة وأولية لأغراض تعريفية فقط، ولا تشكل استشارة قانونية أو مالية أو ضريبية. يجب على المستثمر الحصول على استشارة متخصصة قبل اتخاذ أي قرار استثماري.",
    ctaTitle: "هل ترغب بدراسة فرص استثمارية في هذه الدولة؟",
    ctaDescription:
      "اترك بياناتك وسيتواصل معك فريق البركة بارتنرز لمساعدتك في الوصول إلى فرص مناسبة.",
    ctaButtonText: "إرسال الطلب",
  },
  en: {
    whyInvestTitle: "Why invest in this country?",
    keySectorsTitle: "Promising investment sectors",
    opportunityTypesTitle: "Types of available opportunities",
    opportunityTypesList: [
      "Operating partnerships",
      "Financing existing projects",
      "Equity acquisition",
      "Asset development",
      "Productive projects",
      "Export-oriented projects",
      "Real-estate opportunities",
      "Private projects",
    ],
    investorNotesTitle: "Preliminary notes for investors",
    investorNotesPoints: [
      "The project's legal status",
      "Ownership documents",
      "Required licenses",
      "Feasibility study",
      "Local partner",
      "Taxes and profit repatriation",
      "Political and commercial risks",
      "Investment exit mechanism",
      "Available guarantees",
    ],
    disclaimerText:
      "The information on this page is general and preliminary, for informational purposes only, and does not constitute legal, financial, or tax advice. Investors should obtain specialized advice before making any investment decision.",
    ctaTitle: "Would you like to explore investment opportunities in this country?",
    ctaDescription:
      "Leave your details and the Baraka Partners team will contact you to help you reach suitable opportunities.",
    ctaButtonText: "Send request",
  },
  tr: {
    whyInvestTitle: "Bu ülkede neden yatırım yapmalı?",
    keySectorsTitle: "Gelecek vaat eden yatırım sektörleri",
    opportunityTypesTitle: "Mevcut fırsat türleri",
    opportunityTypesList: [
      "Operasyonel ortaklıklar",
      "Mevcut projelerin finansmanı",
      "Hisse alımı",
      "Varlık geliştirme",
      "Üretim projeleri",
      "İhracata yönelik projeler",
      "Gayrimenkul fırsatları",
      "Özel projeler",
    ],
    investorNotesTitle: "Yatırımcılar için ön notlar",
    investorNotesPoints: [
      "Projenin hukuki durumu",
      "Mülkiyet belgeleri",
      "Gerekli lisanslar",
      "Fizibilite çalışması",
      "Yerel ortak",
      "Vergiler ve kâr transferi",
      "Siyasi ve ticari riskler",
      "Yatırımdan çıkış mekanizması",
      "Mevcut teminatlar",
    ],
    disclaimerText:
      "Bu sayfadaki bilgiler genel ve ön niteliktedir, yalnızca bilgilendirme amaçlıdır ve hukuki, mali veya vergisel danışmanlık teşkil etmez. Yatırımcılar herhangi bir yatırım kararı vermeden önce uzman danışmanlık almalıdır.",
    ctaTitle: "Bu ülkede yatırım fırsatlarını değerlendirmek ister misiniz?",
    ctaDescription:
      "Bilgilerinizi bırakın, Baraka Partners ekibi uygun fırsatlara ulaşmanız için sizinle iletişime geçsin.",
    ctaButtonText: "Talebi gönder",
  },
  zh: {
    whyInvestTitle: "为什么在该国投资？",
    keySectorsTitle: "有前景的投资行业",
    opportunityTypesTitle: "可参与的机会类型",
    opportunityTypesList: [
      "运营合作",
      "现有项目融资",
      "股权收购",
      "资产开发",
      "生产型项目",
      "出口导向型项目",
      "房地产机会",
      "私人项目",
    ],
    investorNotesTitle: "投资者初步须知",
    investorNotesPoints: [
      "项目的法律状态",
      "产权文件",
      "所需许可证",
      "可行性研究",
      "当地合作伙伴",
      "税收与利润汇出",
      "政治与商业风险",
      "投资退出机制",
      "可用的担保",
    ],
    disclaimerText:
      "本页信息为一般性初步信息，仅供参考，不构成法律、财务或税务建议。投资者在做出任何投资决定前应寻求专业咨询。",
    ctaTitle: "您是否希望了解该国的投资机会？",
    ctaDescription:
      "留下您的联系方式，Baraka Partners 团队将与您联系，帮助您找到合适的机会。",
    ctaButtonText: "提交请求",
  },
};

const BRAND = { ar: "البركة بارتنرز", en: "Baraka Partners", tr: "Baraka Partners", zh: "Baraka Partners" };

// ===== الدول =====
const DESTINATIONS = [
  {
    countryKey: "turkey",
    region: "Middle East / Europe",
    flagEmoji: "🇹🇷",
    displayOrder: 1,
    tr: {
      ar: {
        countryName: "تركيا", slug: "invest-in-turkey", h1Title: "استثمر في تركيا",
        introText:
          "تُعد تركيا واحدة من الوجهات الاستثمارية المهمة في المنطقة، بفضل موقعها الجغرافي وتنوع قطاعاتها الاقتصادية وقربها من أسواق أوروبا والشرق الأوسط وآسيا الوسطى. توفر هذه الصفحة معلومات أولية للمستثمرين الراغبين في دراسة الفرص المتاحة في تركيا عبر منصة البركة بارتنرز.",
        whyInvestPoints: ["موقع جغرافي يربط أوروبا وآسيا", "سوق محلي كبير وقوة شرائية متنامية", "بنية تحتية ولوجستيات متطورة", "قاعدة صناعية وتصديرية واسعة", "حوافز استثمارية في عدة قطاعات", "توفر عمالة ماهرة"],
        keySectorsList: ["الصناعة", "العقارات", "السياحة", "الطاقة", "الزراعة والغذاء", "اللوجستيات", "التكنولوجيا", "التصدير"],
        seoTitle: "استثمر في تركيا | فرص ومعلومات أولية للمستثمرين | البركة بارتنرز",
        metaDescription: "تعرف على معلومات أولية حول الاستثمار في تركيا، القطاعات الواعدة، أنواع الفرص الاستثمارية، وكيف يمكن للبركة بارتنرز مساعدتك في الوصول إلى فرص مناسبة.",
        focusKeyword: "استثمر في تركيا",
        secondaryKeywords: ["الاستثمار في تركيا", "فرص استثمارية في تركيا", "مشاريع للاستثمار في تركيا", "بيئة الاستثمار في تركيا", "Invest in Turkey", "Investment opportunities in Turkey"],
        faq: [
          { q: "ما هي أهم القطاعات المناسبة للاستثمار في تركيا؟", a: "تشمل القطاعات الواعدة الصناعة والعقارات والسياحة والطاقة والزراعة والغذاء واللوجستيات والتكنولوجيا، وتختلف الجدوى حسب طبيعة المشروع وموقعه." },
          { q: "هل توفر البركة بارتنرز فرصاً استثمارية جاهزة في تركيا؟", a: "نعرض الفرص المنشورة والمتحقّق منها على المنصة، ويمكنك التواصل معنا لمعرفة الفرص قيد المراجعة." },
          { q: "هل المعلومات الموجودة في الصفحة تُعتبر استشارة قانونية؟", a: "لا، المعلومات أولية وتعريفية فقط، ويُنصح بالحصول على استشارة متخصصة قبل اتخاذ أي قرار." },
          { q: "كيف أبدأ دراسة فرصة استثمارية في تركيا؟", a: "املأ نموذج التواصل في هذه الصفحة وسيتواصل معك فريقنا لمساعدتك في الخطوات التالية." },
        ],
      },
      en: {
        countryName: "Turkey", slug: "invest-in-turkey", h1Title: "Invest in Turkey",
        introText:
          "Turkey is one of the region's important investment destinations, thanks to its geographic location, diverse economic sectors, and proximity to the markets of Europe, the Middle East, and Central Asia. This page provides preliminary information for investors looking to explore the opportunities available in Turkey through Baraka Partners.",
        whyInvestPoints: ["A location bridging Europe and Asia", "A large domestic market with growing purchasing power", "Advanced infrastructure and logistics", "A broad industrial and export base", "Investment incentives across several sectors", "Availability of skilled labor"],
        keySectorsList: ["Industry", "Real estate", "Tourism", "Energy", "Agriculture & food", "Logistics", "Technology", "Exports"],
        seoTitle: "Invest in Turkey | Opportunities & Preliminary Insights | Baraka Partners",
        metaDescription: "Discover preliminary insights about investing in Turkey: promising sectors, types of opportunities, and how Baraka Partners can help you reach suitable opportunities.",
        focusKeyword: "Invest in Turkey",
        secondaryKeywords: ["Investing in Turkey", "Investment opportunities in Turkey", "Projects to invest in Turkey", "Turkey investment environment", "Business in Turkey"],
        faq: [
          { q: "Which sectors are most suitable for investing in Turkey?", a: "Promising sectors include industry, real estate, tourism, energy, agriculture & food, logistics, and technology; feasibility varies by the nature and location of the project." },
          { q: "Does Baraka Partners offer ready opportunities in Turkey?", a: "We present published, verified opportunities on the platform, and you can contact us about opportunities under review." },
          { q: "Is the information on this page legal advice?", a: "No, it is preliminary and informational only; specialized advice is recommended before any decision." },
          { q: "How do I start exploring an opportunity in Turkey?", a: "Fill in the contact form on this page and our team will reach out to help with the next steps." },
        ],
      },
      tr: {
        countryName: "Türkiye", slug: "turkiyede-yatirim", h1Title: "Türkiye'de Yatırım",
        introText:
          "Türkiye; coğrafi konumu, çeşitli ekonomik sektörleri ve Avrupa, Orta Doğu ve Orta Asya pazarlarına yakınlığı sayesinde bölgenin önemli yatırım destinasyonlarından biridir. Bu sayfa, Baraka Partners aracılığıyla Türkiye'deki fırsatları değerlendirmek isteyen yatırımcılar için ön bilgiler sunar.",
        whyInvestPoints: ["Avrupa ve Asya'yı birbirine bağlayan konum", "Büyük iç pazar ve artan satın alma gücü", "Gelişmiş altyapı ve lojistik", "Geniş sanayi ve ihracat tabanı", "Çeşitli sektörlerde yatırım teşvikleri", "Nitelikli iş gücü"],
        keySectorsList: ["Sanayi", "Gayrimenkul", "Turizm", "Enerji", "Tarım ve gıda", "Lojistik", "Teknoloji", "İhracat"],
        seoTitle: "Türkiye'de Yatırım | Fırsatlar ve Ön Bilgiler | Baraka Partners",
        metaDescription: "Türkiye'de yatırım hakkında ön bilgiler: gelecek vaat eden sektörler, fırsat türleri ve Baraka Partners'ın uygun fırsatlara ulaşmanıza nasıl yardımcı olabileceği.",
        focusKeyword: "Türkiye'de yatırım",
        secondaryKeywords: ["Türkiye'de yatırım fırsatları", "Türkiye'ye yatırım", "Türkiye yatırım ortamı", "Invest in Turkey"],
        faq: [
          { q: "Türkiye'de yatırım için en uygun sektörler hangileri?", a: "Sanayi, gayrimenkul, turizm, enerji, tarım ve gıda, lojistik ve teknoloji öne çıkar; fizibilite projenin niteliğine ve konumuna göre değişir." },
          { q: "Baraka Partners Türkiye'de hazır fırsatlar sunuyor mu?", a: "Platformda yayınlanmış ve doğrulanmış fırsatları sunuyoruz; incelemedeki fırsatlar için bizimle iletişime geçebilirsiniz." },
          { q: "Bu sayfadaki bilgiler hukuki danışmanlık mıdır?", a: "Hayır, yalnızca ön ve bilgilendirme amaçlıdır; karar öncesi uzman danışmanlık önerilir." },
          { q: "Türkiye'de bir fırsatı değerlendirmeye nasıl başlarım?", a: "Bu sayfadaki iletişim formunu doldurun, ekibimiz sonraki adımlar için sizinle iletişime geçsin." },
        ],
      },
      zh: {
        countryName: "土耳其", slug: "invest-in-turkey", h1Title: "投资土耳其",
        introText:
          "凭借地理位置、多元的经济行业以及邻近欧洲、中东和中亚市场的优势，土耳其是该地区重要的投资目的地之一。本页面为希望通过 Baraka Partners 了解土耳其投资机会的投资者提供初步信息。",
        whyInvestPoints: ["连接欧洲与亚洲的地理位置", "庞大的国内市场与不断增长的购买力", "先进的基础设施与物流", "广泛的工业与出口基础", "多个行业的投资激励", "充足的熟练劳动力"],
        keySectorsList: ["工业", "房地产", "旅游", "能源", "农业与食品", "物流", "科技", "出口"],
        seoTitle: "投资土耳其 | 机会与初步信息 | Baraka Partners",
        metaDescription: "了解投资土耳其的初步信息：有前景的行业、机会类型，以及 Baraka Partners 如何帮助您找到合适的机会。",
        focusKeyword: "投资土耳其",
        secondaryKeywords: ["土耳其投资", "土耳其投资机会", "土耳其投资环境", "Invest in Turkey"],
        faq: [
          { q: "投资土耳其最合适的行业有哪些？", a: "有前景的行业包括工业、房地产、旅游、能源、农业与食品、物流和科技；可行性因项目性质和位置而异。" },
          { q: "Baraka Partners 是否提供土耳其的现成机会？", a: "我们在平台上展示已发布并经核实的机会，您也可以就审核中的机会与我们联系。" },
          { q: "本页信息是否构成法律建议？", a: "否，仅为初步信息，决策前建议咨询专业意见。" },
          { q: "如何开始了解土耳其的投资机会？", a: "填写本页的联系表单，我们的团队将与您联系并协助后续步骤。" },
        ],
      },
    },
  },
  {
    countryKey: "syria",
    region: "Middle East",
    flagEmoji: "🇸🇾",
    displayOrder: 2,
    tr: {
      ar: {
        countryName: "سوريا", slug: "invest-in-syria", h1Title: "استثمر في سوريا",
        introText:
          "تمثّل سوريا فرصة استثمارية واعدة في مرحلة إعادة البناء، بما تملكه من موارد وموقع وأسواق محتملة. توفر هذه الصفحة معلومات أولية حول القطاعات الممكنة ومتطلبات دراسة المشاريع وكيفية الوصول إلى فرص عبر منصة البركة بارتنرز.",
        whyInvestPoints: ["حاجة واسعة لإعادة الإعمار", "موارد زراعية وصناعية", "موقع يربط أسواق المنطقة", "أيدٍ عاملة متوفرة", "فرص في مشاريع إنتاجية وخدمية", "إمكانات تصديرية مستقبلية"],
        keySectorsList: ["إعادة الإعمار", "الصناعة", "الزراعة", "الطاقة", "العقارات", "الغذاء", "اللوجستيات", "التعدين والمقالع"],
        seoTitle: "استثمر في سوريا | فرص استثمارية ومشاريع واعدة | البركة بارتنرز",
        metaDescription: "صفحة تعريفية حول فرص الاستثمار في سوريا، القطاعات الممكنة، متطلبات دراسة المشاريع، وكيفية الوصول إلى فرص استثمارية عبر منصة البركة بارتنرز.",
        focusKeyword: "استثمر في سوريا",
        secondaryKeywords: ["الاستثمار في سوريا", "فرص استثمارية في سوريا", "مشاريع صناعية في سوريا", "مشاريع زراعية في سوريا", "إعادة الإعمار في سوريا", "Invest in Syria"],
        faq: [
          { q: "ما القطاعات الممكنة للاستثمار في سوريا؟", a: "تشمل إعادة الإعمار والصناعة والزراعة والطاقة والعقارات والغذاء، مع أهمية التحقق من الوضع القانوني لكل مشروع." },
          { q: "كيف أبدأ دراسة فرصة استثمارية في سوريا؟", a: "تواصل معنا عبر النموذج لتزويدك بالمعلومات الأولية وربطك بالفرص المتاحة أو قيد المراجعة." },
          { q: "هل المعلومات هنا استشارة قانونية؟", a: "لا، هي معلومات أولية فقط، ويلزم الحصول على استشارة متخصصة قبل أي قرار." },
          { q: "هل تتحقق المنصة من الفرص؟", a: "نعرض الفرص بعد التحقق منها قدر الإمكان، مع توضيح ما هو منشور وما هو قيد المراجعة." },
        ],
      },
      en: {
        countryName: "Syria", slug: "invest-in-syria", h1Title: "Invest in Syria",
        introText:
          "Syria represents a promising investment opportunity in a reconstruction phase, given its resources, location, and potential markets. This page provides preliminary information on possible sectors, project due-diligence requirements, and how to reach opportunities through Baraka Partners.",
        whyInvestPoints: ["A broad reconstruction need", "Agricultural and industrial resources", "A location connecting regional markets", "Available workforce", "Opportunities in productive and service projects", "Future export potential"],
        keySectorsList: ["Reconstruction", "Industry", "Agriculture", "Energy", "Real estate", "Food", "Logistics", "Mining & quarries"],
        seoTitle: "Invest in Syria | Investment Opportunities & Promising Projects | Baraka Partners",
        metaDescription: "An introductory page on investment opportunities in Syria: possible sectors, project study requirements, and how to reach opportunities through Baraka Partners.",
        focusKeyword: "Invest in Syria",
        secondaryKeywords: ["Investing in Syria", "Investment opportunities in Syria", "Industrial projects in Syria", "Agricultural projects in Syria", "Reconstruction in Syria"],
        faq: [
          { q: "Which sectors are possible for investing in Syria?", a: "They include reconstruction, industry, agriculture, energy, real estate, and food, with emphasis on verifying each project's legal status." },
          { q: "How do I start studying an opportunity in Syria?", a: "Contact us via the form so we can provide preliminary information and connect you with available or under-review opportunities." },
          { q: "Is the information here legal advice?", a: "No, it is preliminary only; specialized advice is required before any decision." },
          { q: "Does the platform verify opportunities?", a: "We present opportunities after verifying them as far as possible, clarifying what is published versus under review." },
        ],
      },
      tr: {
        countryName: "Suriye", slug: "suriyede-yatirim", h1Title: "Suriye'de Yatırım",
        introText:
          "Suriye; sahip olduğu kaynaklar, konum ve potansiyel pazarlar ile yeniden inşa aşamasında gelecek vaat eden bir yatırım fırsatı sunmaktadır. Bu sayfa, olası sektörler, proje inceleme gereklilikleri ve Baraka Partners aracılığıyla fırsatlara nasıl ulaşılacağı hakkında ön bilgiler verir.",
        whyInvestPoints: ["Geniş yeniden inşa ihtiyacı", "Tarımsal ve sınai kaynaklar", "Bölge pazarlarını bağlayan konum", "Mevcut iş gücü", "Üretim ve hizmet projelerinde fırsatlar", "Gelecekteki ihracat potansiyeli"],
        keySectorsList: ["Yeniden inşa", "Sanayi", "Tarım", "Enerji", "Gayrimenkul", "Gıda", "Lojistik", "Madencilik ve taş ocakları"],
        seoTitle: "Suriye'de Yatırım | Yatırım Fırsatları ve Projeler | Baraka Partners",
        metaDescription: "Suriye'deki yatırım fırsatları hakkında tanıtıcı bir sayfa: olası sektörler, proje inceleme gereklilikleri ve Baraka Partners ile fırsatlara erişim.",
        focusKeyword: "Suriye'de yatırım",
        secondaryKeywords: ["Suriye'de yatırım fırsatları", "Suriye'de sanayi projeleri", "Suriye'de tarım projeleri", "Suriye yeniden inşa", "Invest in Syria"],
        faq: [
          { q: "Suriye'de yatırım için olası sektörler hangileri?", a: "Yeniden inşa, sanayi, tarım, enerji, gayrimenkul ve gıda; her projenin hukuki durumunun doğrulanması önemlidir." },
          { q: "Suriye'de bir fırsatı incelemeye nasıl başlarım?", a: "Form aracılığıyla bizimle iletişime geçin; ön bilgi sağlayalım ve mevcut veya incelemedeki fırsatlarla sizi buluşturalım." },
          { q: "Buradaki bilgiler hukuki danışmanlık mı?", a: "Hayır, yalnızca ön bilgidir; karar öncesi uzman danışmanlık gereklidir." },
          { q: "Platform fırsatları doğruluyor mu?", a: "Fırsatları mümkün olduğunca doğrulayarak sunuyor, yayınlanan ile incelemede olanı ayırt ediyoruz." },
        ],
      },
      zh: {
        countryName: "叙利亚", slug: "invest-in-syria", h1Title: "投资叙利亚",
        introText:
          "凭借其资源、地理位置和潜在市场，叙利亚在重建阶段是一个有前景的投资机会。本页面提供关于可投资行业、项目尽职调查要求，以及如何通过 Baraka Partners 获得机会的初步信息。",
        whyInvestPoints: ["广泛的重建需求", "农业与工业资源", "连接区域市场的位置", "充足的劳动力", "生产型与服务型项目的机会", "未来的出口潜力"],
        keySectorsList: ["重建", "工业", "农业", "能源", "房地产", "食品", "物流", "采矿与采石"],
        seoTitle: "投资叙利亚 | 投资机会与项目 | Baraka Partners",
        metaDescription: "关于叙利亚投资机会的介绍页面：可投资行业、项目研究要求，以及如何通过 Baraka Partners 获得机会。",
        focusKeyword: "投资叙利亚",
        secondaryKeywords: ["叙利亚投资", "叙利亚投资机会", "叙利亚工业项目", "叙利亚重建", "Invest in Syria"],
        faq: [
          { q: "投资叙利亚有哪些可能的行业？", a: "包括重建、工业、农业、能源、房地产和食品，需重点核实每个项目的法律状态。" },
          { q: "如何开始研究叙利亚的投资机会？", a: "通过表单联系我们，我们将提供初步信息并为您对接可用或审核中的机会。" },
          { q: "本页信息是否为法律建议？", a: "否，仅为初步信息，决策前需咨询专业意见。" },
          { q: "平台是否核实机会？", a: "我们尽可能核实后再展示机会，并区分已发布与审核中的机会。" },
        ],
      },
    },
  },
  {
    countryKey: "european-union",
    region: "Europe",
    flagEmoji: "🇪🇺",
    displayOrder: 3,
    tr: {
      ar: {
        countryName: "الاتحاد الأوروبي", slug: "invest-in-european-union", h1Title: "استثمر في الاتحاد الأوروبي",
        introText:
          "يوفر الاتحاد الأوروبي بيئة استثمارية مستقرة وسوقاً موحّدة كبيرة وأطراً تنظيمية واضحة. توفر هذه الصفحة معلومات أولية للمستثمرين الراغبين في دراسة الفرص ضمن دول الاتحاد عبر منصة البركة بارتنرز.",
        whyInvestPoints: ["سوق موحّدة ضخمة", "استقرار اقتصادي وتنظيمي", "حماية قوية للملكية", "بنية تحتية وتقنية متقدمة", "وصول إلى تمويل وشراكات", "بيئة ابتكار وبحث"],
        keySectorsList: ["التكنولوجيا", "الطاقة المتجددة", "الصناعة المتقدمة", "العقارات", "الخدمات المالية", "اللوجستيات", "الرعاية الصحية", "الغذاء"],
        seoTitle: "استثمر في الاتحاد الأوروبي | فرص ومعلومات أولية | البركة بارتنرز",
        metaDescription: "معلومات أولية حول الاستثمار في الاتحاد الأوروبي: القطاعات الواعدة وأنواع الفرص وكيف تساعدك البركة بارتنرز في الوصول إلى فرص مناسبة.",
        focusKeyword: "استثمر في الاتحاد الأوروبي",
        secondaryKeywords: ["الاستثمار في أوروبا", "فرص استثمارية في الاتحاد الأوروبي", "مشاريع في أوروبا", "Invest in European Union", "Invest in Europe"],
        faq: [
          { q: "ما مزايا الاستثمار في الاتحاد الأوروبي؟", a: "سوق موحّدة كبيرة واستقرار تنظيمي وحماية للملكية ووصول إلى التمويل والشراكات." },
          { q: "هل تختلف القوانين بين دول الاتحاد؟", a: "نعم، توجد أطر مشتركة إلى جانب قوانين محلية لكل دولة، ويُنصح بدراسة كل سوق على حدة." },
          { q: "هل المعلومات هنا استشارة قانونية؟", a: "لا، هي معلومات أولية فقط، ويلزم استشارة متخصصة قبل أي قرار." },
          { q: "كيف أصل إلى فرص في أوروبا؟", a: "تواصل معنا عبر النموذج وسنساعدك في تحديد الأسواق والفرص المناسبة." },
        ],
      },
      en: {
        countryName: "European Union", slug: "invest-in-european-union", h1Title: "Invest in the European Union",
        introText:
          "The European Union offers a stable investment environment, a large single market, and clear regulatory frameworks. This page provides preliminary information for investors looking to explore opportunities within EU countries through Baraka Partners.",
        whyInvestPoints: ["A vast single market", "Economic and regulatory stability", "Strong property protection", "Advanced infrastructure and technology", "Access to financing and partnerships", "An innovation and research environment"],
        keySectorsList: ["Technology", "Renewable energy", "Advanced manufacturing", "Real estate", "Financial services", "Logistics", "Healthcare", "Food"],
        seoTitle: "Invest in the European Union | Opportunities & Insights | Baraka Partners",
        metaDescription: "Preliminary insights about investing in the European Union: promising sectors, types of opportunities, and how Baraka Partners helps you reach suitable opportunities.",
        focusKeyword: "Invest in the European Union",
        secondaryKeywords: ["Investing in Europe", "Investment opportunities in the European Union", "Projects in Europe", "Invest in Europe"],
        faq: [
          { q: "What are the advantages of investing in the EU?", a: "A large single market, regulatory stability, property protection, and access to financing and partnerships." },
          { q: "Do laws differ between EU countries?", a: "Yes, there are common frameworks alongside each country's local laws; studying each market individually is recommended." },
          { q: "Is the information here legal advice?", a: "No, it is preliminary only; specialized advice is required before any decision." },
          { q: "How do I reach opportunities in Europe?", a: "Contact us via the form and we'll help identify suitable markets and opportunities." },
        ],
      },
      tr: {
        countryName: "Avrupa Birliği", slug: "avrupa-birliginde-yatirim", h1Title: "Avrupa Birliği'nde Yatırım",
        introText:
          "Avrupa Birliği; istikrarlı bir yatırım ortamı, büyük bir tek pazar ve net düzenleyici çerçeveler sunar. Bu sayfa, Baraka Partners aracılığıyla AB ülkelerinde fırsatları değerlendirmek isteyen yatırımcılar için ön bilgiler sağlar.",
        whyInvestPoints: ["Geniş tek pazar", "Ekonomik ve düzenleyici istikrar", "Güçlü mülkiyet koruması", "Gelişmiş altyapı ve teknoloji", "Finansman ve ortaklıklara erişim", "İnovasyon ve araştırma ortamı"],
        keySectorsList: ["Teknoloji", "Yenilenebilir enerji", "İleri imalat", "Gayrimenkul", "Finansal hizmetler", "Lojistik", "Sağlık", "Gıda"],
        seoTitle: "Avrupa Birliği'nde Yatırım | Fırsatlar ve Bilgiler | Baraka Partners",
        metaDescription: "Avrupa Birliği'nde yatırım hakkında ön bilgiler: gelecek vaat eden sektörler, fırsat türleri ve Baraka Partners'ın yardımı.",
        focusKeyword: "Avrupa Birliği'nde yatırım",
        secondaryKeywords: ["Avrupa'da yatırım", "Avrupa Birliği yatırım fırsatları", "Avrupa'da projeler", "Invest in Europe"],
        faq: [
          { q: "AB'de yatırımın avantajları neler?", a: "Büyük tek pazar, düzenleyici istikrar, mülkiyet koruması ve finansman ile ortaklıklara erişim." },
          { q: "AB ülkeleri arasında yasalar farklı mı?", a: "Evet, ortak çerçevelerin yanı sıra her ülkenin yerel yasaları vardır; her pazarı ayrı incelemek önerilir." },
          { q: "Buradaki bilgiler hukuki danışmanlık mı?", a: "Hayır, yalnızca ön bilgidir; karar öncesi uzman danışmanlık gereklidir." },
          { q: "Avrupa'da fırsatlara nasıl ulaşırım?", a: "Form aracılığıyla bizimle iletişime geçin; uygun pazar ve fırsatları belirlemenize yardımcı olalım." },
        ],
      },
      zh: {
        countryName: "欧盟", slug: "invest-in-european-union", h1Title: "投资欧盟",
        introText:
          "欧盟提供稳定的投资环境、庞大的统一市场和清晰的监管框架。本页面为希望通过 Baraka Partners 在欧盟国家了解投资机会的投资者提供初步信息。",
        whyInvestPoints: ["庞大的统一市场", "经济与监管的稳定性", "强有力的产权保护", "先进的基础设施与技术", "融资与合作机会", "创新与研究环境"],
        keySectorsList: ["科技", "可再生能源", "先进制造", "房地产", "金融服务", "物流", "医疗健康", "食品"],
        seoTitle: "投资欧盟 | 机会与信息 | Baraka Partners",
        metaDescription: "关于投资欧盟的初步信息：有前景的行业、机会类型，以及 Baraka Partners 如何提供帮助。",
        focusKeyword: "投资欧盟",
        secondaryKeywords: ["欧洲投资", "欧盟投资机会", "欧洲项目", "Invest in Europe"],
        faq: [
          { q: "投资欧盟有哪些优势？", a: "庞大的统一市场、监管稳定、产权保护以及融资和合作机会。" },
          { q: "欧盟各国法律是否不同？", a: "是的，既有共同框架，也有各国本地法律，建议逐一研究每个市场。" },
          { q: "本页信息是否为法律建议？", a: "否，仅为初步信息，决策前需咨询专业意见。" },
          { q: "如何获得欧洲的投资机会？", a: "通过表单联系我们，我们将帮助确定合适的市场和机会。" },
        ],
      },
    },
  },
  {
    countryKey: "cyprus",
    region: "Europe / Mediterranean",
    flagEmoji: "🇨🇾",
    displayOrder: 4,
    tr: {
      ar: {
        countryName: "قبرص", slug: "invest-in-cyprus", h1Title: "استثمر في قبرص",
        introText:
          "تتمتع قبرص بموقع متوسطي استراتيجي وعضوية في الاتحاد الأوروبي وبيئة أعمال منفتحة. توفر هذه الصفحة معلومات أولية حول فرص الاستثمار في قبرص عبر منصة البركة بارتنرز.",
        whyInvestPoints: ["موقع متوسطي استراتيجي", "عضوية في الاتحاد الأوروبي", "بيئة أعمال وخدمات مالية متطورة", "قطاع سياحي وعقاري نشط", "نظام ضريبي تنافسي", "سهولة الوصول لأسواق المنطقة"],
        keySectorsList: ["العقارات", "السياحة", "الخدمات المالية", "التكنولوجيا", "الطاقة", "الشحن البحري", "التعليم", "الغذاء"],
        seoTitle: "استثمر في قبرص | فرص ومعلومات أولية للمستثمرين | البركة بارتنرز",
        metaDescription: "معلومات أولية حول الاستثمار في قبرص: القطاعات الواعدة وأنواع الفرص وكيف تساعدك البركة بارتنرز في الوصول إلى فرص مناسبة.",
        focusKeyword: "استثمر في قبرص",
        secondaryKeywords: ["الاستثمار في قبرص", "فرص استثمارية في قبرص", "مشاريع في قبرص", "Invest in Cyprus", "Investment opportunities in Cyprus"],
        faq: [
          { q: "ما أبرز قطاعات الاستثمار في قبرص؟", a: "العقارات والسياحة والخدمات المالية والتكنولوجيا والشحن البحري من أبرز القطاعات." },
          { q: "هل قبرص عضو في الاتحاد الأوروبي؟", a: "نعم، ما يتيح وصولاً إلى السوق الأوروبية ضمن أطر تنظيمية واضحة." },
          { q: "هل المعلومات هنا استشارة قانونية؟", a: "لا، هي معلومات أولية فقط، ويلزم استشارة متخصصة قبل أي قرار." },
          { q: "كيف أبدأ بدراسة فرصة في قبرص؟", a: "املأ نموذج التواصل وسيتواصل معك فريقنا بالخطوات التالية." },
        ],
      },
      en: {
        countryName: "Cyprus", slug: "invest-in-cyprus", h1Title: "Invest in Cyprus",
        introText:
          "Cyprus enjoys a strategic Mediterranean location, EU membership, and an open business environment. This page provides preliminary information about investment opportunities in Cyprus through Baraka Partners.",
        whyInvestPoints: ["A strategic Mediterranean location", "EU membership", "An advanced business and financial-services environment", "An active tourism and real-estate sector", "A competitive tax system", "Easy access to regional markets"],
        keySectorsList: ["Real estate", "Tourism", "Financial services", "Technology", "Energy", "Shipping", "Education", "Food"],
        seoTitle: "Invest in Cyprus | Opportunities & Preliminary Insights | Baraka Partners",
        metaDescription: "Preliminary insights about investing in Cyprus: promising sectors, types of opportunities, and how Baraka Partners helps you reach suitable opportunities.",
        focusKeyword: "Invest in Cyprus",
        secondaryKeywords: ["Investing in Cyprus", "Investment opportunities in Cyprus", "Projects in Cyprus", "Business in Cyprus"],
        faq: [
          { q: "What are the key investment sectors in Cyprus?", a: "Real estate, tourism, financial services, technology, and shipping are among the key sectors." },
          { q: "Is Cyprus an EU member?", a: "Yes, providing access to the European market within clear regulatory frameworks." },
          { q: "Is the information here legal advice?", a: "No, it is preliminary only; specialized advice is required before any decision." },
          { q: "How do I start studying an opportunity in Cyprus?", a: "Fill in the contact form and our team will reach out with the next steps." },
        ],
      },
      tr: {
        countryName: "Kıbrıs", slug: "kibrista-yatirim", h1Title: "Kıbrıs'ta Yatırım",
        introText:
          "Kıbrıs; stratejik Akdeniz konumu, AB üyeliği ve açık iş ortamı ile öne çıkar. Bu sayfa, Baraka Partners aracılığıyla Kıbrıs'taki yatırım fırsatları hakkında ön bilgiler sunar.",
        whyInvestPoints: ["Stratejik Akdeniz konumu", "AB üyeliği", "Gelişmiş iş ve finansal hizmetler ortamı", "Aktif turizm ve gayrimenkul sektörü", "Rekabetçi vergi sistemi", "Bölge pazarlarına kolay erişim"],
        keySectorsList: ["Gayrimenkul", "Turizm", "Finansal hizmetler", "Teknoloji", "Enerji", "Denizcilik", "Eğitim", "Gıda"],
        seoTitle: "Kıbrıs'ta Yatırım | Fırsatlar ve Ön Bilgiler | Baraka Partners",
        metaDescription: "Kıbrıs'ta yatırım hakkında ön bilgiler: gelecek vaat eden sektörler, fırsat türleri ve Baraka Partners'ın yardımı.",
        focusKeyword: "Kıbrıs'ta yatırım",
        secondaryKeywords: ["Kıbrıs'ta yatırım fırsatları", "Kıbrıs'a yatırım", "Kıbrıs'ta projeler", "Invest in Cyprus"],
        faq: [
          { q: "Kıbrıs'ta öne çıkan yatırım sektörleri neler?", a: "Gayrimenkul, turizm, finansal hizmetler, teknoloji ve denizcilik başlıca sektörlerdendir." },
          { q: "Kıbrıs AB üyesi mi?", a: "Evet, net düzenleyici çerçeveler içinde Avrupa pazarına erişim sağlar." },
          { q: "Buradaki bilgiler hukuki danışmanlık mı?", a: "Hayır, yalnızca ön bilgidir; karar öncesi uzman danışmanlık gereklidir." },
          { q: "Kıbrıs'ta bir fırsatı incelemeye nasıl başlarım?", a: "İletişim formunu doldurun, ekibimiz sonraki adımlar için sizinle iletişime geçsin." },
        ],
      },
      zh: {
        countryName: "塞浦路斯", slug: "invest-in-cyprus", h1Title: "投资塞浦路斯",
        introText:
          "塞浦路斯拥有战略性的地中海位置、欧盟成员国身份和开放的营商环境。本页面提供关于通过 Baraka Partners 在塞浦路斯投资机会的初步信息。",
        whyInvestPoints: ["战略性的地中海位置", "欧盟成员国身份", "先进的营商与金融服务环境", "活跃的旅游与房地产行业", "有竞争力的税收制度", "便捷进入区域市场"],
        keySectorsList: ["房地产", "旅游", "金融服务", "科技", "能源", "航运", "教育", "食品"],
        seoTitle: "投资塞浦路斯 | 机会与初步信息 | Baraka Partners",
        metaDescription: "关于投资塞浦路斯的初步信息：有前景的行业、机会类型，以及 Baraka Partners 如何提供帮助。",
        focusKeyword: "投资塞浦路斯",
        secondaryKeywords: ["塞浦路斯投资", "塞浦路斯投资机会", "塞浦路斯项目", "Invest in Cyprus"],
        faq: [
          { q: "塞浦路斯的主要投资行业有哪些？", a: "房地产、旅游、金融服务、科技和航运是主要行业。" },
          { q: "塞浦路斯是欧盟成员国吗？", a: "是的，可在清晰的监管框架内进入欧洲市场。" },
          { q: "本页信息是否为法律建议？", a: "否，仅为初步信息，决策前需咨询专业意见。" },
          { q: "如何开始研究塞浦路斯的投资机会？", a: "填写联系表单，我们的团队将与您联系并协助后续步骤。" },
        ],
      },
    },
  },
  {
    countryKey: "egypt",
    region: "Middle East / Africa",
    flagEmoji: "🇪🇬",
    displayOrder: 5,
    tr: {
      ar: {
        countryName: "مصر", slug: "invest-in-egypt", h1Title: "استثمر في مصر",
        introText:
          "تمتلك مصر سوقاً كبيرة وموقعاً استراتيجياً يربط القارات وبنية تحتية متنامية. توفر هذه الصفحة معلومات أولية حول فرص الاستثمار في مصر عبر منصة البركة بارتنرز.",
        whyInvestPoints: ["سوق استهلاكية كبيرة", "موقع استراتيجي يربط آسيا وأفريقيا وأوروبا", "قناة السويس ومحاورها اللوجستية", "مشاريع بنية تحتية كبرى", "قطاع طاقة متنامٍ", "عمالة متوفرة"],
        keySectorsList: ["العقارات", "الطاقة المتجددة", "الصناعة", "الزراعة", "السياحة", "اللوجستيات", "التكنولوجيا", "الغذاء"],
        seoTitle: "استثمر في مصر | فرص ومعلومات أولية للمستثمرين | البركة بارتنرز",
        metaDescription: "معلومات أولية حول الاستثمار في مصر: القطاعات الواعدة وأنواع الفرص وكيف تساعدك البركة بارتنرز في الوصول إلى فرص مناسبة في السوق المصري.",
        focusKeyword: "استثمر في مصر",
        secondaryKeywords: ["الاستثمار في مصر", "فرص استثمارية في مصر", "مشاريع في مصر", "السوق المصري", "Invest in Egypt", "Investment opportunities in Egypt"],
        faq: [
          { q: "ما أبرز قطاعات الاستثمار في مصر؟", a: "العقارات والطاقة المتجددة والصناعة والزراعة والسياحة واللوجستيات من أبرز القطاعات." },
          { q: "ما ميزة موقع مصر للاستثمار؟", a: "موقع يربط آسيا وأفريقيا وأوروبا مع محاور لوجستية مثل قناة السويس." },
          { q: "هل المعلومات هنا استشارة قانونية؟", a: "لا، هي معلومات أولية فقط، ويلزم استشارة متخصصة قبل أي قرار." },
          { q: "كيف أبدأ بدراسة فرصة في مصر؟", a: "املأ نموذج التواصل وسيتواصل معك فريقنا بالخطوات التالية." },
        ],
      },
      en: {
        countryName: "Egypt", slug: "invest-in-egypt", h1Title: "Invest in Egypt",
        introText:
          "Egypt has a large market, a strategic location connecting continents, and growing infrastructure. This page provides preliminary information about investment opportunities in Egypt through Baraka Partners.",
        whyInvestPoints: ["A large consumer market", "A strategic location linking Asia, Africa, and Europe", "The Suez Canal and its logistics hubs", "Major infrastructure projects", "A growing energy sector", "Available workforce"],
        keySectorsList: ["Real estate", "Renewable energy", "Industry", "Agriculture", "Tourism", "Logistics", "Technology", "Food"],
        seoTitle: "Invest in Egypt | Opportunities & Preliminary Insights | Baraka Partners",
        metaDescription: "Preliminary insights about investing in Egypt: promising sectors, types of opportunities, and how Baraka Partners helps you reach suitable opportunities in the Egyptian market.",
        focusKeyword: "Invest in Egypt",
        secondaryKeywords: ["Investing in Egypt", "Investment opportunities in Egypt", "Projects in Egypt", "Egyptian market"],
        faq: [
          { q: "What are the key investment sectors in Egypt?", a: "Real estate, renewable energy, industry, agriculture, tourism, and logistics are among the key sectors." },
          { q: "What is the advantage of Egypt's location?", a: "A location linking Asia, Africa, and Europe with logistics hubs such as the Suez Canal." },
          { q: "Is the information here legal advice?", a: "No, it is preliminary only; specialized advice is required before any decision." },
          { q: "How do I start studying an opportunity in Egypt?", a: "Fill in the contact form and our team will reach out with the next steps." },
        ],
      },
      tr: {
        countryName: "Mısır", slug: "misirda-yatirim", h1Title: "Mısır'da Yatırım",
        introText:
          "Mısır; büyük bir pazara, kıtaları birbirine bağlayan stratejik bir konuma ve gelişen bir altyapıya sahiptir. Bu sayfa, Baraka Partners aracılığıyla Mısır'daki yatırım fırsatları hakkında ön bilgiler sunar.",
        whyInvestPoints: ["Büyük tüketici pazarı", "Asya, Afrika ve Avrupa'yı bağlayan stratejik konum", "Süveyş Kanalı ve lojistik merkezleri", "Büyük altyapı projeleri", "Büyüyen enerji sektörü", "Mevcut iş gücü"],
        keySectorsList: ["Gayrimenkul", "Yenilenebilir enerji", "Sanayi", "Tarım", "Turizm", "Lojistik", "Teknoloji", "Gıda"],
        seoTitle: "Mısır'da Yatırım | Fırsatlar ve Ön Bilgiler | Baraka Partners",
        metaDescription: "Mısır'da yatırım hakkında ön bilgiler: gelecek vaat eden sektörler, fırsat türleri ve Baraka Partners'ın Mısır pazarındaki yardımı.",
        focusKeyword: "Mısır'da yatırım",
        secondaryKeywords: ["Mısır'da yatırım fırsatları", "Mısır'a yatırım", "Mısır'da projeler", "Invest in Egypt"],
        faq: [
          { q: "Mısır'da öne çıkan yatırım sektörleri neler?", a: "Gayrimenkul, yenilenebilir enerji, sanayi, tarım, turizm ve lojistik başlıca sektörlerdendir." },
          { q: "Mısır'ın konumunun avantajı nedir?", a: "Süveyş Kanalı gibi lojistik merkezlerle Asya, Afrika ve Avrupa'yı bağlayan konum." },
          { q: "Buradaki bilgiler hukuki danışmanlık mı?", a: "Hayır, yalnızca ön bilgidir; karar öncesi uzman danışmanlık gereklidir." },
          { q: "Mısır'da bir fırsatı incelemeye nasıl başlarım?", a: "İletişim formunu doldurun, ekibimiz sonraki adımlar için sizinle iletişime geçsin." },
        ],
      },
      zh: {
        countryName: "埃及", slug: "invest-in-egypt", h1Title: "投资埃及",
        introText:
          "埃及拥有庞大的市场、连接各大洲的战略位置以及不断发展的基础设施。本页面提供关于通过 Baraka Partners 在埃及投资机会的初步信息。",
        whyInvestPoints: ["庞大的消费市场", "连接亚洲、非洲与欧洲的战略位置", "苏伊士运河及其物流枢纽", "大型基础设施项目", "不断增长的能源行业", "充足的劳动力"],
        keySectorsList: ["房地产", "可再生能源", "工业", "农业", "旅游", "物流", "科技", "食品"],
        seoTitle: "投资埃及 | 机会与初步信息 | Baraka Partners",
        metaDescription: "关于投资埃及的初步信息：有前景的行业、机会类型，以及 Baraka Partners 如何帮助您在埃及市场找到合适的机会。",
        focusKeyword: "投资埃及",
        secondaryKeywords: ["埃及投资", "埃及投资机会", "埃及项目", "埃及市场", "Invest in Egypt"],
        faq: [
          { q: "埃及的主要投资行业有哪些？", a: "房地产、可再生能源、工业、农业、旅游和物流是主要行业。" },
          { q: "埃及的区位优势是什么？", a: "连接亚洲、非洲和欧洲，并拥有苏伊士运河等物流枢纽。" },
          { q: "本页信息是否为法律建议？", a: "否，仅为初步信息，决策前需咨询专业意见。" },
          { q: "如何开始研究埃及的投资机会？", a: "填写联系表单，我们的团队将与您联系并协助后续步骤。" },
        ],
      },
    },
  },
  {
    countryKey: "jordan",
    region: "Middle East",
    flagEmoji: "🇯🇴",
    displayOrder: 6,
    tr: {
      ar: {
        countryName: "الأردن", slug: "invest-in-jordan", h1Title: "استثمر في الأردن",
        introText:
          "يتمتع الأردن باستقرار نسبي وموقع يربط أسواق المنطقة وكوادر بشرية مؤهلة. توفر هذه الصفحة معلومات أولية حول فرص الاستثمار في الأردن عبر منصة البركة بارتنرز.",
        whyInvestPoints: ["استقرار نسبي وبيئة أعمال منظمة", "موقع يربط أسواق المنطقة", "كوادر بشرية مؤهلة", "قطاع طاقة متجددة نامٍ", "موارد تعدينية (الفوسفات والبوتاس)", "اتفاقيات تجارية متعددة"],
        keySectorsList: ["الطاقة المتجددة", "التعدين", "السياحة", "التكنولوجيا", "الصناعات الدوائية", "الزراعة", "العقارات", "اللوجستيات"],
        seoTitle: "استثمر في الأردن | فرص ومعلومات أولية للمستثمرين | البركة بارتنرز",
        metaDescription: "معلومات أولية حول الاستثمار في الأردن: القطاعات الواعدة وأنواع الفرص وكيف تساعدك البركة بارتنرز في الوصول إلى فرص مناسبة.",
        focusKeyword: "استثمر في الأردن",
        secondaryKeywords: ["الاستثمار في الأردن", "فرص استثمارية في الأردن", "مشاريع في الأردن", "Invest in Jordan", "Investment opportunities in Jordan"],
        faq: [
          { q: "ما أبرز قطاعات الاستثمار في الأردن؟", a: "الطاقة المتجددة والتعدين والسياحة والتكنولوجيا والصناعات الدوائية من أبرز القطاعات." },
          { q: "ما ميزة الأردن للاستثمار؟", a: "استقرار نسبي وموقع يربط أسواق المنطقة وكوادر مؤهلة واتفاقيات تجارية متعددة." },
          { q: "هل المعلومات هنا استشارة قانونية؟", a: "لا، هي معلومات أولية فقط، ويلزم استشارة متخصصة قبل أي قرار." },
          { q: "كيف أبدأ بدراسة فرصة في الأردن؟", a: "املأ نموذج التواصل وسيتواصل معك فريقنا بالخطوات التالية." },
        ],
      },
      en: {
        countryName: "Jordan", slug: "invest-in-jordan", h1Title: "Invest in Jordan",
        introText:
          "Jordan enjoys relative stability, a location connecting regional markets, and a qualified workforce. This page provides preliminary information about investment opportunities in Jordan through Baraka Partners.",
        whyInvestPoints: ["Relative stability and an organized business environment", "A location connecting regional markets", "A qualified workforce", "A growing renewable-energy sector", "Mining resources (phosphate and potash)", "Multiple trade agreements"],
        keySectorsList: ["Renewable energy", "Mining", "Tourism", "Technology", "Pharmaceuticals", "Agriculture", "Real estate", "Logistics"],
        seoTitle: "Invest in Jordan | Opportunities & Preliminary Insights | Baraka Partners",
        metaDescription: "Preliminary insights about investing in Jordan: promising sectors, types of opportunities, and how Baraka Partners helps you reach suitable opportunities.",
        focusKeyword: "Invest in Jordan",
        secondaryKeywords: ["Investing in Jordan", "Investment opportunities in Jordan", "Projects in Jordan", "Business in Jordan"],
        faq: [
          { q: "What are the key investment sectors in Jordan?", a: "Renewable energy, mining, tourism, technology, and pharmaceuticals are among the key sectors." },
          { q: "What is Jordan's advantage for investment?", a: "Relative stability, a location connecting regional markets, a qualified workforce, and multiple trade agreements." },
          { q: "Is the information here legal advice?", a: "No, it is preliminary only; specialized advice is required before any decision." },
          { q: "How do I start studying an opportunity in Jordan?", a: "Fill in the contact form and our team will reach out with the next steps." },
        ],
      },
      tr: {
        countryName: "Ürdün", slug: "urdunde-yatirim", h1Title: "Ürdün'de Yatırım",
        introText:
          "Ürdün; göreceli istikrarı, bölge pazarlarını bağlayan konumu ve nitelikli iş gücü ile öne çıkar. Bu sayfa, Baraka Partners aracılığıyla Ürdün'deki yatırım fırsatları hakkında ön bilgiler sunar.",
        whyInvestPoints: ["Göreceli istikrar ve düzenli iş ortamı", "Bölge pazarlarını bağlayan konum", "Nitelikli iş gücü", "Büyüyen yenilenebilir enerji sektörü", "Madencilik kaynakları (fosfat ve potas)", "Çok sayıda ticaret anlaşması"],
        keySectorsList: ["Yenilenebilir enerji", "Madencilik", "Turizm", "Teknoloji", "İlaç sanayii", "Tarım", "Gayrimenkul", "Lojistik"],
        seoTitle: "Ürdün'de Yatırım | Fırsatlar ve Ön Bilgiler | Baraka Partners",
        metaDescription: "Ürdün'de yatırım hakkında ön bilgiler: gelecek vaat eden sektörler, fırsat türleri ve Baraka Partners'ın yardımı.",
        focusKeyword: "Ürdün'de yatırım",
        secondaryKeywords: ["Ürdün'de yatırım fırsatları", "Ürdün'e yatırım", "Ürdün'de projeler", "Invest in Jordan"],
        faq: [
          { q: "Ürdün'de öne çıkan yatırım sektörleri neler?", a: "Yenilenebilir enerji, madencilik, turizm, teknoloji ve ilaç sanayii başlıca sektörlerdendir." },
          { q: "Ürdün'ün yatırım avantajı nedir?", a: "Göreceli istikrar, bölge pazarlarını bağlayan konum, nitelikli iş gücü ve çok sayıda ticaret anlaşması." },
          { q: "Buradaki bilgiler hukuki danışmanlık mı?", a: "Hayır, yalnızca ön bilgidir; karar öncesi uzman danışmanlık gereklidir." },
          { q: "Ürdün'de bir fırsatı incelemeye nasıl başlarım?", a: "İletişim formunu doldurun, ekibimiz sonraki adımlar için sizinle iletişime geçsin." },
        ],
      },
      zh: {
        countryName: "约旦", slug: "invest-in-jordan", h1Title: "投资约旦",
        introText:
          "约旦拥有相对稳定的环境、连接区域市场的位置以及高素质的劳动力。本页面提供关于通过 Baraka Partners 在约旦投资机会的初步信息。",
        whyInvestPoints: ["相对稳定且规范的营商环境", "连接区域市场的位置", "高素质的劳动力", "不断增长的可再生能源行业", "矿产资源（磷酸盐与钾盐）", "多项贸易协定"],
        keySectorsList: ["可再生能源", "采矿", "旅游", "科技", "制药", "农业", "房地产", "物流"],
        seoTitle: "投资约旦 | 机会与初步信息 | Baraka Partners",
        metaDescription: "关于投资约旦的初步信息：有前景的行业、机会类型，以及 Baraka Partners 如何提供帮助。",
        focusKeyword: "投资约旦",
        secondaryKeywords: ["约旦投资", "约旦投资机会", "约旦项目", "Invest in Jordan"],
        faq: [
          { q: "约旦的主要投资行业有哪些？", a: "可再生能源、采矿、旅游、科技和制药是主要行业。" },
          { q: "约旦的投资优势是什么？", a: "相对稳定、连接区域市场的位置、高素质劳动力以及多项贸易协定。" },
          { q: "本页信息是否为法律建议？", a: "否，仅为初步信息，决策前需咨询专业意见。" },
          { q: "如何开始研究约旦的投资机会？", a: "填写联系表单，我们的团队将与您联系并协助后续步骤。" },
        ],
      },
    },
  },
];

function buildTranslation(locale, country, c) {
  const common = COMMON[locale];
  return {
    locale,
    slug: c.slug,
    countryName: c.countryName,
    h1Title: c.h1Title,
    pageTitle: `${c.h1Title} | ${BRAND[locale]}`,
    introText: c.introText,
    whyInvestTitle: common.whyInvestTitle,
    whyInvestPoints: c.whyInvestPoints,
    keySectorsTitle: common.keySectorsTitle,
    keySectorsList: c.keySectorsList,
    opportunityTypesTitle: common.opportunityTypesTitle,
    opportunityTypesList: common.opportunityTypesList,
    investorNotesTitle: common.investorNotesTitle,
    investorNotesPoints: common.investorNotesPoints,
    disclaimerText: common.disclaimerText,
    ctaTitle: common.ctaTitle,
    ctaDescription: common.ctaDescription,
    ctaButtonText: common.ctaButtonText,
    faq: c.faq,
    seoTitle: c.seoTitle,
    metaDescription: c.metaDescription,
    focusKeyword: c.focusKeyword,
    secondaryKeywords: c.secondaryKeywords,
    ogTitle: c.seoTitle,
    ogDescription: c.metaDescription,
    robotsIndex: true,
    robotsFollow: true,
    sitemapPriority: country.displayOrder <= 2 ? 0.8 : 0.7,
    sitemapChangefreq: "monthly",
  };
}

async function main() {
  for (const country of DESTINATIONS) {
    const dest = await prisma.destination.upsert({
      where: { countryKey: country.countryKey },
      update: {
        region: country.region,
        flagEmoji: country.flagEmoji,
        displayOrder: country.displayOrder,
      },
      create: {
        countryKey: country.countryKey,
        region: country.region,
        flagEmoji: country.flagEmoji,
        displayOrder: country.displayOrder,
        isActive: true,
        showInMenu: true,
        showInFooter: true,
        inSitemap: true,
      },
    });

    for (const locale of ["ar", "en", "tr", "zh"]) {
      const c = country.tr[locale];
      const data = buildTranslation(locale, country, c);
      await prisma.destinationTranslation.upsert({
        where: { destinationId_locale: { destinationId: dest.id, locale } },
        update: data,
        create: { destinationId: dest.id, ...data },
      });
    }
    console.log(`✔ ${country.countryKey} (4 لغات)`);
  }
  console.log("تم زرع وجهات الاستثمار بنجاح.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
