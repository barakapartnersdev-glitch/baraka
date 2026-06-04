// بيانات تجريبية لتشغيل لوحة الإدارة فوراً بعد الإعداد.
// شغّله بـ: npm run db:seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

// كلمة مرور تجريبية موحّدة لكل الحسابات (للاختبار فقط — غيّرها قبل أي استخدام فعلي)
const DEMO_PASSWORD = "Baraka@123";

async function main() {
  console.log("جارٍ تهيئة البيانات التجريبية...");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // تنظيف
  await prisma.interest.deleteMany();
  await prisma.opportunityFile.deleteMany();
  await prisma.missingItem.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.investorEntity.deleteMany();
  await prisma.user.deleteMany();

  // مدير
  const admin = await prisma.user.create({
    data: {
      email: "admin@baraka.example",
      fullName: "مدير المنصة",
      role: "ADMIN",
      accountStatus: "ACTIVE",
      passwordHash,
    },
  });

  // أصحاب مشاريع
  const owners = await Promise.all(
    ["شركة الغذاء التركي", "مجموعة الرعاية", "تك فنتشرز", "مزارع النيل", "شمس الطاقة", "لوجستيك بلس", "دار الأناقة"].map(
      (name, i) =>
        prisma.user.create({
          data: {
            email: `owner${i + 1}@baraka.example`,
            fullName: name,
            role: "PROJECT_OWNER",
            accountStatus: i < 5 ? "ACTIVE" : "PENDING_REVIEW",
            passwordHash,
          },
        })
    )
  );

  // مستثمرون
  const investors = await Promise.all(
    Array.from({ length: 4 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `investor${i + 1}@baraka.example`,
          fullName: `مستثمر ${i + 1}`,
          role: "INVESTOR",
          accountStatus: i < 3 ? "ACTIVE" : "PENDING_REVIEW",
          passwordHash,
        },
      })
    )
  );

  // فرص — تغطي كل الحالات المهمة
  const oppsData = [
    { title: "مصنع أغذية محفوظة", sector: "صناعة", country: "تركيا", state: "UNDER_REVIEW", min: 500000, max: 800000 },
    { title: "سلسلة عيادات أسنان", sector: "رعاية صحية", country: "السعودية", state: "NEEDS_INFO", min: 1000000, max: 1500000 },
    { title: "منصة تجارة إلكترونية", sector: "تقنية", country: "الإمارات", state: "PUBLISHED", min: 300000, max: 600000 },
    { title: "مزرعة دواجن متكاملة", sector: "زراعة", country: "مصر", state: "PUBLISHED", min: 250000, max: 400000 },
    { title: "مشروع طاقة شمسية", sector: "طاقة", country: "الأردن", state: "UNDER_REVIEW", min: 2000000, max: 3000000 },
    { title: "شركة لوجستيات وشحن", sector: "خدمات", country: "تركيا", state: "DRAFT_SOURCE", min: 700000, max: 900000 },
    { title: "علامة أزياء محتشمة", sector: "تجزئة", country: "الكويت", state: "PUBLISHED", min: 400000, max: 700000 },
  ];

  const opps = [];
  for (let i = 0; i < oppsData.length; i++) {
    const d = oppsData[i];
    const opp = await prisma.opportunity.create({
      data: {
        title: d.title,
        sector: d.sector,
        country: d.country,
        state: d.state,
        ownerId: owners[i].id,
        reviewerId: d.state === "DRAFT_SOURCE" ? null : admin.id,
        investmentMin: BigInt(d.min),
        investmentMax: BigInt(d.max),
        currency: "USD",
        sourceData: { note: "بيانات المصدر السرية — للإدارة فقط", contactRevealed: false },
        publicVersion:
          d.state === "PUBLISHED"
            ? { summary: `فرصة في قطاع ${d.sector} بدولة ${d.country}`, sector: d.sector, country: d.country }
            : undefined,
        publishedAt: d.state === "PUBLISHED" ? new Date() : null,
      },
    });
    opps.push(opp);
  }

  // نواقص لفرصة "بانتظار نواقص"
  await prisma.missingItem.createMany({
    data: [
      { opportunityId: opps[1].id, description: "القوائم المالية لآخر سنتين" },
      { opportunityId: opps[1].id, description: "صورة السجل التجاري" },
      { opportunityId: opps[1].id, description: "دراسة الجدوى المحدّثة" },
    ],
  });

  // طلبات اهتمام على الفرص المنشورة
  const published = opps.filter((o) => o.state === "PUBLISHED");
  let count = 0;
  for (const o of published) {
    for (let j = 0; j < investors.length - 1; j++) {
      if ((count + j) % 2 === 0) {
        await prisma.interest.create({
          data: {
            opportunityId: o.id,
            investorId: investors[j].id,
            status: j === 0 ? "NCNDA_SIGNED" : j === 1 ? "ADMIN_APPROVED" : "REQUESTED",
            ncndaSignedAt: j === 0 ? new Date() : null,
          },
        });
      }
    }
    count++;
  }

  console.log("تمت التهيئة بنجاح.");
  console.log(`\nبيانات الدخول التجريبية (كلمة المرور موحّدة): ${DEMO_PASSWORD}`);
  console.log("  مدير:       admin@baraka.example");
  console.log("  صاحب مشروع: owner1@baraka.example");
  console.log("  مستثمر:     investor1@baraka.example");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
