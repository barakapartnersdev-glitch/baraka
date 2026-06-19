// بذور قوالب بريد سفراء الاستثمار في CrmEmailTemplate (قابلة للتحرير من الإدارة).
// التشغيل: node prisma/seed-ambassador-templates.mjs
// آمن لإعادة التشغيل: لا يستبدل تعديلات الإدارة (update فارغ).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const T = {
  amb_needs_info: {
    ar: ["نحتاج معلومات إضافية لطلبك", "مرحباً {{fullName}}،\nنحتاج بعض المعلومات الإضافية لاستكمال مراجعة طلب انضمامك كسفير استثمار. سيتواصل معك فريقنا قريباً."],
    en: ["We need additional information", "Hello {{fullName}},\nWe need some additional information to continue reviewing your Investment Ambassador application. Our team will contact you shortly."],
    tr: ["Ek bilgiye ihtiyacımız var", "Merhaba {{fullName}},\nYatırım Elçisi başvurunuzu incelemeye devam etmek için ek bilgilere ihtiyacımız var. Ekibimiz kısa süre içinde sizinle iletişime geçecek."],
    zh: ["我们需要补充信息", "您好 {{fullName}}，\n我们需要一些补充信息以继续审核您的投资大使申请。我们的团队将很快与您联系。"],
  },
  amb_interview: {
    ar: ["دعوة لمقابلة", "مرحباً {{fullName}}،\nيسعدنا دعوتك لمقابلة ضمن مراجعة طلبك. سيتواصل معك فريقنا لتحديد الموعد."],
    en: ["Interview invitation", "Hello {{fullName}},\nWe are pleased to invite you to an interview as part of reviewing your application. Our team will contact you to schedule a time."],
    tr: ["Mülakat daveti", "Merhaba {{fullName}},\nBaşvurunuzun değerlendirilmesi kapsamında sizi mülakata davet ediyoruz. Ekibimiz zaman belirlemek için iletişime geçecek."],
    zh: ["面谈邀请", "您好 {{fullName}}，\n作为申请审核的一部分，我们诚邀您参加面谈。我们的团队将与您联系安排时间。"],
  },
  amb_pre_accepted: {
    ar: ["قبول مبدئي لطلبك", "مرحباً {{fullName}}،\nيسعدنا قبول طلبك مبدئياً للانضمام كسفير استثمار. سنتواصل معك لاستكمال التعاقد."],
    en: ["Your application is pre-accepted", "Hello {{fullName}},\nYour application to become an Investment Ambassador has been pre-accepted. We will contact you to proceed with the contract."],
    tr: ["Başvurunuz ön kabul aldı", "Merhaba {{fullName}},\nYatırım Elçisi başvurunuz ön kabul aldı. Sözleşme için sizinle iletişime geçeceğiz."],
    zh: ["您的申请已初步通过", "您好 {{fullName}}，\n您成为投资大使的申请已初步通过。我们将与您联系以办理合同。"],
  },
  amb_rejected: {
    ar: ["تحديث بخصوص طلبك", "مرحباً {{fullName}}،\nنشكر اهتمامك. بعد المراجعة لم نتمكّن من قبول طلبك حالياً. نقدّر وقتك ونتمنى لك التوفيق."],
    en: ["Update regarding your application", "Hello {{fullName}},\nThank you for your interest. After review, we were unable to accept your application at this time. We wish you success."],
    tr: ["Başvurunuzla ilgili güncelleme", "Merhaba {{fullName}},\nİlginiz için teşekkürler. İnceleme sonrası başvurunuzu şu an kabul edemedik. Başarılar dileriz."],
    zh: ["关于您申请的更新", "您好 {{fullName}}，\n感谢您的关注。经审核，我们暂时无法接受您的申请。祝您一切顺利。"],
  },
  amb_contract_sent: {
    ar: ["عقد التعاون جاهز", "مرحباً {{fullName}}،\nأصبح عقد التعاون جاهزاً. سيرسل فريقنا تفاصيل التوقيع. بعد التوقيع سيُفتح حسابك."],
    en: ["Your cooperation contract is ready", "Hello {{fullName}},\nYour cooperation contract is ready. Our team will send the signing details. Your account opens once signed."],
    tr: ["İş birliği sözleşmeniz hazır", "Merhaba {{fullName}},\nİş birliği sözleşmeniz hazır. Ekibimiz imza ayrıntılarını gönderecek. İmzalandığında hesabınız açılır."],
    zh: ["您的合作合同已就绪", "您好 {{fullName}}，\n您的合作合同已就绪。我们的团队将发送签署详情。签署后将开通您的账户。"],
  },
  amb_account_opened: {
    ar: ["تم فتح حساب سفير الاستثمار", "مرحباً {{fullName}}،\nتم فتح حسابك كسفير استثمار. سجّل الدخول عبر: {{loginUrl}}\nبيانات الدخول المؤقتة ستصلك من الإدارة."],
    en: ["Your Investment Ambassador account is open", "Hello {{fullName}},\nYour Investment Ambassador account is open. Log in at: {{loginUrl}}\nYour temporary credentials will be shared by management."],
    tr: ["Yatırım Elçisi hesabınız açıldı", "Merhaba {{fullName}},\nYatırım Elçisi hesabınız açıldı. Giriş: {{loginUrl}}\nGeçici bilgileriniz yönetim tarafından paylaşılacaktır."],
    zh: ["您的投资大使账户已开通", "您好 {{fullName}}，\n您的投资大使账户已开通。登录：{{loginUrl}}\n临时凭据将由管理层提供。"],
  },
};

async function main() {
  let n = 0;
  for (const [key, langs] of Object.entries(T)) {
    for (const [lang, [subject, body]] of Object.entries(langs)) {
      await prisma.crmEmailTemplate.upsert({
        where: { templateKey_languageCode: { templateKey: key, languageCode: lang } },
        update: {}, // لا نستبدل تعديلات الإدارة عند إعادة التشغيل
        create: { templateKey: key, templateType: "ambassador", languageCode: lang, subject, body, isActive: true },
      });
      n++;
    }
  }
  console.log(`✓ ensured ${n} ambassador email templates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
