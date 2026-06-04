// عروض استثمارية تجريبية (Showcase) — 10 فرص منشورة بدول متعددة مع صور حقيقية.
// الغرض: معاينة شكل الصفحة الرئيسية وصفحة الفرص بمحتوى واقعي.
// آمن لإعادة التشغيل: يحذف فقط فرص "المالك التجريبي" ثم يعيد إنشاءها — لا يلمس بيانات أخرى.
//
// التشغيل:  npm run db:seed:showcase
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const OWNER_EMAIL = "showcase-owner@baraka.example";
const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

// 10 عروض — قطاعات ودول متنوّعة، بصور مطابقة موثّقة.
const OPPS = [
  {
    sector: "طاقة متجددة",
    country: "الأردن",
    min: 2_000_000,
    max: 3_500_000,
    image: "photo-1509391366360-2e959784a276",
    displayTitle: "محطة طاقة شمسية بقدرة 12 ميغاواط",
    summary:
      "مشروع توليد طاقة شمسية متوسط الحجم باتفاقية شراء طاقة طويلة الأجل وعائد مستقر.",
    highlights:
      "أرض مخصّصة جاهزة • اتفاقية شراء طاقة 20 سنة • دراسة جدوى مكتملة",
  },
  {
    sector: "رعاية صحية",
    country: "السعودية",
    min: 1_000_000,
    max: 1_800_000,
    image: "photo-1606811971618-4486d14f3f99",
    displayTitle: "سلسلة عيادات أسنان متخصّصة",
    summary:
      "توسعة سلسلة عيادات أسنان قائمة ومربحة إلى ثلاثة فروع جديدة في مدن رئيسية.",
    highlights: "فرعان عاملان بأرباح مثبتة • فريق طبّي مرخّص • طلب مرتفع",
  },
  {
    sector: "تجارة إلكترونية",
    country: "الإمارات",
    min: 300_000,
    max: 600_000,
    image: "photo-1556740758-90de374c12ad",
    displayTitle: "منصة تجزئة إلكترونية متعددة البائعين",
    summary:
      "منصة تجارة إلكترونية بنمو شهري متسارع تسعى لجولة توسّع في السوق الخليجي.",
    highlights: "نموّ شهري ثابت • قاعدة عملاء متنامية • فريق تقني جاهز",
  },
  {
    sector: "خدمات لوجستية",
    country: "البحرين",
    min: 700_000,
    max: 1_200_000,
    image: "photo-1553413077-190dd305871c",
    displayTitle: "مركز تخزين وتوزيع ذكي",
    summary:
      "مستودع توزيع حديث يخدم تجار التجزئة والتجارة الإلكترونية بأنظمة إدارة مخزون آلية.",
    highlights: "موقع استراتيجي • أنظمة WMS • عقود تشغيل مبدئية",
  },
  {
    sector: "أزياء وتجزئة",
    country: "الكويت",
    min: 400_000,
    max: 700_000,
    image: "photo-1445205170230-053b83016050",
    displayTitle: "علامة أزياء محتشمة عصرية",
    summary:
      "علامة أزياء محتشمة بهوية قوية وحضور رقمي، تستهدف التوسّع في المتاجر والتصدير.",
    highlights: "هوية علامة مميّزة • مبيعات رقمية قائمة • هوامش ربح جيدة",
  },
  {
    sector: "سياحة وضيافة",
    country: "المغرب",
    min: 2_500_000,
    max: 4_000_000,
    image: "photo-1571896349842-33c89424de2d",
    displayTitle: "منتجع سياحي بيئي متكامل",
    summary:
      "تطوير منتجع بيئي في وجهة سياحية صاعدة بإشغال متوقّع مرتفع على مدار العام.",
    highlights: "أرض مرخّصة • تصميم مكتمل • طلب سياحي متنامٍ",
  },
  {
    sector: "صناعة ومواد بناء",
    country: "قطر",
    min: 1_500_000,
    max: 2_800_000,
    image: "photo-1504307651254-35680f356dfd",
    displayTitle: "مصنع مواد بناء مستدامة",
    summary:
      "مصنع لإنتاج مواد بناء صديقة للبيئة يخدم قطاع الإنشاءات المتنامي في المنطقة.",
    highlights: "طلب إنشائي مرتفع • تقنية موفّرة للطاقة • عقود توريد محتملة",
  },
  {
    sector: "ثروة حيوانية",
    country: "مصر",
    min: 250_000,
    max: 450_000,
    image: "photo-1548550023-2bdb3c5beed7",
    displayTitle: "مزرعة دواجن متكاملة",
    summary:
      "مزرعة دواجن متكاملة من التربية حتى التعبئة، تستهدف الاكتفاء المحلي والتوسّع.",
    highlights: "دورة إنتاج متكاملة • طلب غذائي ثابت • تكلفة تشغيل تنافسية",
  },
  {
    sector: "زراعة ذكية",
    country: "عُمان",
    min: 500_000,
    max: 900_000,
    image: "photo-1605000797499-95a51c5269ae",
    displayTitle: "مشروع زراعة محاصيل ذكية",
    summary:
      "مزرعة محاصيل تعتمد الري الذكي والزراعة الدقيقة لرفع الإنتاجية وترشيد المياه.",
    highlights: "ري ذكي موفّر للمياه • محاصيل عالية القيمة • أسواق تصدير",
  },
  {
    sector: "تقنية حيوية",
    country: "تركيا",
    min: 1_200_000,
    max: 2_200_000,
    image: "photo-1581093588401-fbb62a02f120",
    displayTitle: "مختبر تقنية حيوية وأبحاث",
    summary:
      "مركز أبحاث وتطوير في التقنية الحيوية بفريق علمي متخصّص ومنتجات قيد التسجيل.",
    highlights: "فريق بحثي متخصّص • براءات قيد التسجيل • شراكات بحثية",
  },
];

async function main() {
  console.log("جارٍ تهيئة العروض التجريبية...");

  // مالك تجريبي (لربط الفرص به) — لا يُستخدم للدخول
  const passwordHash = await bcrypt.hash("disabled-showcase-account", 10);
  const owner = await prisma.user.upsert({
    where: { email: OWNER_EMAIL },
    update: { accountStatus: "ACTIVE", role: "PROJECT_OWNER" },
    create: {
      email: OWNER_EMAIL,
      fullName: "عروض تجريبية",
      role: "PROJECT_OWNER",
      accountStatus: "ACTIVE",
      passwordHash,
    },
  });

  // مراجع (الإدارة) إن وُجد
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });

  // تنظيف العروض التجريبية السابقة فقط (cascade يحذف العلاقات)
  const removed = await prisma.opportunity.deleteMany({
    where: { ownerId: owner.id },
  });
  if (removed.count) console.log(`حُذفت ${removed.count} عروض تجريبية سابقة.`);

  let n = 0;
  for (const o of OPPS) {
    await prisma.opportunity.create({
      data: {
        title: `[عرض تجريبي] ${o.displayTitle}`,
        sector: o.sector,
        country: o.country,
        state: "PUBLISHED",
        ownerId: owner.id,
        reviewerId: admin?.id ?? null,
        investmentMin: BigInt(o.min),
        investmentMax: BigInt(o.max),
        currency: "USD",
        sourceData: { note: "بيانات تجريبية للعرض فقط", contactRevealed: false },
        publicVersion: {
          displayTitle: o.displayTitle,
          summary: o.summary,
          highlights: o.highlights,
          imageUrl: img(o.image),
        },
        publishedAt: new Date(),
      },
    });
    n++;
  }

  console.log(`\n✓ أُنشئت ${n} عروض استثمارية منشورة بدول متعددة مع صور حقيقية.`);
  console.log("شاهدها في: /opportunities وفي قسم «فرص مختارة» بالصفحة الرئيسية.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
