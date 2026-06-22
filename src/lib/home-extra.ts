// نصوص إضافية لإعادة تصميم الصفحة الرئيسية (أقسام جديدة) بأربع لغات.
// تكمّل كائن المحتوى C الموجود في صفحة الرئيسية.
import type { Locale } from "@/lib/i18n";

export interface HomeExtra {
  valueKicker: string;
  valueTitle1: string;
  valueTitle2: string;
  valuePara1: string;
  valuePara2: string;
  valueBtnAbout: string;
  valueBtnHow: string;
  valueCardTitle: string;
  valueCardText: string;
  destKicker: string;
  destTitle: string;
  destSub: string;
  destBtn: string;
  destCardSub: string;
  contactKicker: string;
  contactTitle: string;
  contactSub: string;
  contactChips: string[];
  govTitle1: string;
  govTitle2: string;
  govCardTitle: string;
  govCardText: string;
}

const ar: HomeExtra = {
  valueKicker: "منصة لا تكتفي بالعرض",
  valueTitle1: "نرتب الصفقة من أول الفكرة",
  valueTitle2: "حتى تصبح قابلة للتفاوض والتنفيذ",
  valuePara1:
    "البركة بارتنرز ليست لوحة إعلانات للفرص. نحن نعمل على تنظيم الفرصة، مراجعة جديتها، تجهيز عرضها، مطابقتها مع المستثمر المناسب، ثم مرافقة العلاقة ضمن مسار واضح يحمي جميع الأطراف.",
  valuePara2:
    "وعند الحاجة، يمكن أن يمتد دور عهد البركة إلى الإدارة أو التشغيل أو التطوير من خلال فرق عمل مؤهلة وشبكة علاقات مع أصحاب أعمال ومصانع ومشغلين قادرين على نقل خبراتهم إلى أسواق ومواقع جديدة.",
  valueBtnAbout: "تعرف على البركة بارتنرز",
  valueBtnHow: "كيف تعمل المنصة؟",
  valueCardTitle: "تنظيم، استقطاب، تشغيل",
  valueCardText: "قيمة عملية تتجاوز الوساطة التقليدية وتدخل في بناء نموذج الصفقة.",
  destKicker: "وجهات الاستثمار",
  destTitle: "استكشف فرصًا في عدة دول وأسواق",
  destSub:
    "معلومات أولية ومنظمة تساعد المستثمر على فهم بيئة الاستثمار والفرص المتاحة عبر منصة البركة بارتنرز.",
  destBtn: "استكشف وجهات الاستثمار",
  destCardSub: "فرص، مستثمرون، وشراكات قابلة للدراسة.",
  contactKicker: "ابدأ رحلتك",
  contactTitle: "هل أنت مستثمر أم صاحب فرصة؟",
  contactSub:
    "اترك بياناتك ونوع اهتمامك، وسيعاود فريق البركة بارتنرز التواصل معك لمتابعة المسار المناسب.",
  contactChips: ["أبحث عن فرصة استثمارية", "أملك فرصة أو أصلًا استثماريًا", "أرغب في التعاون كشركة تشغيل أو إدارة"],
  govTitle1: "نحن لا نعرض فرصًا فقط.",
  govTitle2: "نحن ندير علاقة قائمة على الثقة.",
  govCardTitle: "السرية ليست خيارًا",
  govCardText: "عرض متدرج للمعلومات يحمي صاحب المشروع والمستثمر معًا.",
};

const en: HomeExtra = {
  valueKicker: "More than a listing platform",
  valueTitle1: "We arrange the deal from the very idea",
  valueTitle2: "until it's ready for negotiation and execution",
  valuePara1:
    "Baraka Partners is not a billboard for opportunities. We structure the opportunity, review its seriousness, prepare its presentation, match it with the right investor, then accompany the relationship within a clear path that protects all parties.",
  valuePara2:
    "And when needed, Ahd Al-Baraka's role can extend to management, operation or development through qualified teams and a network of business owners, factories and operators able to transfer their expertise to new markets and locations.",
  valueBtnAbout: "About Baraka Partners",
  valueBtnHow: "How the platform works?",
  valueCardTitle: "Structuring, sourcing, operating",
  valueCardText: "Practical value that goes beyond traditional brokerage and into building the deal model.",
  destKicker: "Investment destinations",
  destTitle: "Explore opportunities across several countries and markets",
  destSub:
    "Preliminary, organized information that helps the investor understand the investment environment and the opportunities available through Baraka Partners.",
  destBtn: "Explore investment destinations",
  destCardSub: "Opportunities, investors, and partnerships open to study.",
  contactKicker: "Start your journey",
  contactTitle: "Are you an investor or an opportunity owner?",
  contactSub:
    "Leave your details and the type of your interest, and the Baraka Partners team will get back to you to follow the right path.",
  contactChips: ["I'm looking for an investment opportunity", "I own an investment opportunity or asset", "I want to cooperate as an operating or management company"],
  govTitle1: "We don't just list opportunities.",
  govTitle2: "We manage a relationship built on trust.",
  govCardTitle: "Confidentiality is not optional",
  govCardText: "Graduated disclosure that protects both the project owner and the investor.",
};

const tr: HomeExtra = {
  valueKicker: "Sadece ilan eden bir platform değil",
  valueTitle1: "Anlaşmayı ta fikirden itibaren düzenleriz",
  valueTitle2: "müzakereye ve uygulamaya hazır olana kadar",
  valuePara1:
    "Baraka Partners, fırsatlar için bir ilan panosu değildir. Fırsatı yapılandırır, ciddiyetini gözden geçirir, sunumunu hazırlar, doğru yatırımcıyla eşleştirir ve ardından tüm tarafları koruyan net bir yol içinde ilişkiye eşlik ederiz.",
  valuePara2:
    "Gerektiğinde Ahd Al-Baraka'nın rolü; nitelikli ekipler ve uzmanlığını yeni pazar ve konumlara taşıyabilecek iş insanları, fabrikalar ve işletmecilerden oluşan bir ağ aracılığıyla yönetim, işletme veya geliştirmeye uzanabilir.",
  valueBtnAbout: "Baraka Partners'ı tanıyın",
  valueBtnHow: "Platform nasıl çalışır?",
  valueCardTitle: "Yapılandırma, kaynak bulma, işletme",
  valueCardText: "Geleneksel aracılığın ötesine geçen ve anlaşma modelini kurmaya giren pratik değer.",
  destKicker: "Yatırım destinasyonları",
  destTitle: "Birden çok ülke ve pazarda fırsatları keşfedin",
  destSub:
    "Yatırımcının yatırım ortamını ve Baraka Partners aracılığıyla sunulan fırsatları anlamasına yardımcı olan ön ve düzenli bilgiler.",
  destBtn: "Yatırım destinasyonlarını keşfedin",
  destCardSub: "İncelemeye açık fırsatlar, yatırımcılar ve ortaklıklar.",
  contactKicker: "Yolculuğuna başla",
  contactTitle: "Yatırımcı mısın yoksa fırsat sahibi mi?",
  contactSub:
    "Bilgilerini ve ilgi türünü bırak; Baraka Partners ekibi doğru yolu takip etmek için seninle iletişime geçsin.",
  contactChips: ["Bir yatırım fırsatı arıyorum", "Bir yatırım fırsatım veya varlığım var", "İşletme veya yönetim şirketi olarak iş birliği yapmak istiyorum"],
  govTitle1: "Yalnızca fırsat sunmuyoruz.",
  govTitle2: "Güvene dayalı bir ilişkiyi yönetiriz.",
  govCardTitle: "Gizlilik bir tercih değildir",
  govCardText: "Hem proje sahibini hem yatırımcıyı koruyan kademeli paylaşım.",
};

const zh: HomeExtra = {
  valueKicker: "不止于展示的平台",
  valueTitle1: "我们从最初的构想就开始安排交易",
  valueTitle2: "直到它可供谈判与执行",
  valuePara1:
    "Baraka Partners 不是机会的广告牌。我们构建机会、审查其严肃性、准备其展示、与合适的投资者匹配，然后在保护各方的清晰路径中陪伴这段关系。",
  valuePara2:
    "在需要时，Ahd Al-Baraka 的角色可以延伸到管理、运营或开发，通过专业团队以及由能够将经验带到新市场和新地点的企业主、工厂和运营方组成的网络。",
  valueBtnAbout: "了解 Baraka Partners",
  valueBtnHow: "平台如何运作？",
  valueCardTitle: "构建、招商、运营",
  valueCardText: "超越传统中介、深入构建交易模式的实用价值。",
  destKicker: "投资目的地",
  destTitle: "探索多个国家和市场的机会",
  destSub:
    "初步且有条理的信息，帮助投资者了解投资环境以及通过 Baraka Partners 提供的机会。",
  destBtn: "探索投资目的地",
  destCardSub: "可供研究的机会、投资者与合作。",
  contactKicker: "开始您的旅程",
  contactTitle: "您是投资者还是机会方？",
  contactSub:
    "留下您的信息和兴趣类型，Baraka Partners 团队将与您联系以跟进合适的路径。",
  contactChips: ["我在寻找投资机会", "我拥有投资机会或资产", "我希望作为运营或管理公司开展合作"],
  govTitle1: "我们不只是展示机会。",
  govTitle2: "我们管理建立在信任之上的关系。",
  govCardTitle: "保密并非可选项",
  govCardText: "分级披露，同时保护项目方与投资者。",
};

export const HOME_X: Record<Locale, HomeExtra> = { ar, en, tr, zh };
