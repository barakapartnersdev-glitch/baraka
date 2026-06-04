// seed آمن للإنتاج — ينشئ (أو يحدّث) حساب مدير واحد فقط دون حذف أي بيانات.
// مخصّص لإنشاء أول حساب إدارة على قاعدة الإنتاج، خلافاً لـ seed.mjs الذي يمسح كل شيء.
//
// التشغيل (مرّة واحدة مقابل قاعدة الإنتاج):
//   ADMIN_EMAIL=you@domain.com ADMIN_PASSWORD=سرّ-قوي ADMIN_NAME="اسمك" npm run db:seed:admin
//
// على PowerShell:
//   $env:ADMIN_EMAIL="you@domain.com"; $env:ADMIN_PASSWORD="سرّ-قوي"; $env:ADMIN_NAME="اسمك"; npm run db:seed:admin
//
// آمن لإعادة التشغيل: إن وُجد الحساب يُحدَّث (الاسم/كلمة المرور/التفعيل) بدل إنشاء نسخة مكرّرة.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const fullName = (process.env.ADMIN_NAME || "مدير المنصة").trim();

  // تحقّق من المدخلات قبل لمس القاعدة
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    fail("ADMIN_EMAIL مفقود أو غير صالح. مثال: ADMIN_EMAIL=you@domain.com");
  }
  if (password.length < 10) {
    fail("ADMIN_PASSWORD مفقود أو قصير — استخدم 10 أحرف فأكثر لكلمة مرور الإدارة.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  const user = await prisma.user.upsert({
    where: { email },
    // عند وجود الحساب: حدّث بياناته واضمن أنه مدير مفعّل (دون لمس بقية الجدول)
    update: {
      fullName,
      role: "ADMIN",
      accountStatus: "ACTIVE",
      passwordHash,
    },
    create: {
      email,
      fullName,
      role: "ADMIN",
      accountStatus: "ACTIVE",
      passwordHash,
    },
  });

  console.log(`\n✓ ${existing ? "حُدِّث" : "أُنشئ"} حساب المدير بنجاح.`);
  console.log(`  البريد: ${user.email}`);
  console.log(`  الاسم:  ${user.fullName}`);
  console.log(`  الدور:  ADMIN (مفعّل)`);
  console.log(`\nادخل عبر /login بهذا البريد وكلمة المرور التي مرّرتها.\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
