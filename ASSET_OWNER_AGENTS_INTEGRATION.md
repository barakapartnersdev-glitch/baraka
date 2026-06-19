# تكامل قسم «وكلاء أصحاب الأصول» — Asset Owner Agents (المرحلة 1)

تم بناء كل ملفات القسم الجديدة (غير المشتركة). يبقى عليك تطبيق إضافات **صغيرة** على
ملفات مشتركة كانت قيد التعديل المتزامن (مخطّط Prisma + الإشعارات + روابط التنقّل).
طبّقها عندما تستقرّ تعديلات «سفراء الاستثمار»، ثم يعمل القسم بالكامل.

> القسم مبنيّ ليكون **توأماً بنيوياً** لميزة السفراء: نفس الأسلوب والتسميات، لكن للوكلاء
> الذين يمثّلون **أصحاب الأصول** بدل ترشيح المستثمرين.

---

## الملفات الجديدة التي أُنشئت (لا تحتاج عملاً منك)

| الملف | الدور |
|------|------|
| `src/lib/agent.ts` | التصنيفات (الصفة المهنية، العلاقة، أنواع الأصول، المناطق) + حالات الطلب + شارات |
| `src/lib/agent-i18n.ts` | نصوص الصفحة والنموذج ولوحة الإدارة (ar/en/tr، والصينية ترجع للإنجليزية) |
| `src/lib/agent-form.ts` | تعريف النموذج (5 أقسام) متعدّد اللغات |
| `src/components/AgentApplicationWizard.tsx` | محرّك النموذج (عميل) — إرسال دفعة واحدة مع الملفات |
| `src/app/[locale]/asset-owner-agents/page.tsx` | الصفحة العامة + SEO |
| `src/app/[locale]/asset-owner-agents/actions.ts` | استقبال الطلب (تحقّق + حماية سبام + حفظ + ملفات + إشعار + بريد) |
| `src/app/admin/asset-agents/page.tsx` | قائمة الطلبات (الإدارة) |
| `src/app/admin/asset-agents/[id]/page.tsx` | تفاصيل الطلب (الإدارة) |
| `src/app/admin/asset-agents/[id]/AgentAdminActions.tsx` | تغيير الحالة/الإسناد/الملاحظات |
| `src/app/admin/asset-agents/actions.ts` | إجراءات الإدارة (محميّة بدور ADMIN) |
| `src/app/api/agent-files/[id]/route.ts` | تنزيل ملفات المتقدّمين (للإدارة فقط) |

الروابط بعد التطبيق:
- عام: `/ar/asset-owner-agents` · `/tr/asset-owner-agents` · `/en/asset-owner-agents`
- إدارة: `/admin/asset-agents`

---

## 1) مخطّط Prisma — `prisma/schema.prisma`

### (أ) أضف قيمة إلى `enum UserRole` (تُستخدم في المرحلة 2 عند تفعيل حساب الوكيل)
```prisma
  ASSET_OWNER_AGENT // وكيل صاحب الأصل (يُفعَّل بعد اعتماد طلبه)
```

### (ب) أضف هذه القيم إلى `enum NotificationType`
```prisma
  // ===== وكلاء أصحاب الأصول =====
  ASSET_AGENT_APPLICATION_RECEIVED  // للإدارة: طلب وكيل جديد
  ASSET_AGENT_STATUS_CHANGED        // للمتقدّم/الوكيل: تغيّرت حالة طلبه
  ASSET_AGENT_CONTRACT_SENT         // للمتقدّم: أُرسل العقد للتوقيع
  ASSET_AGENT_CONTRACT_SIGNED       // للإدارة: تم توقيع العقد
  ASSET_AGENT_ACCOUNT_CREATED       // للوكيل: فُتح حسابه
  ASSET_AGENT_NEW_MESSAGE           // للطرف الآخر: رسالة داخلية جديدة
  ASSET_AGENT_NEW_ASSET             // للإدارة: أصل/فرصة جديدة من وكيل
  ASSET_AGENT_ASSET_STATUS_CHANGED  // للوكيل: تحديث حالة أصل مقدّم
```
> المرحلة 1 تستخدم `ASSET_AGENT_APPLICATION_RECEIVED` فقط؛ البقية مُضافة سلفاً لتجنّب
> هجرة enum ثانية في المرحلة 2 (نفس نهج السفراء).

### (ج) أضف داخل `model User` علاقة معكوسة (مع باقي علاقات المستخدم)
```prisma
  // وكلاء أصحاب الأصول
  assetAgentAppsAssigned AssetAgentApplication[] @relation("AssetAgentAppAssignee")
```

### (د) أضف في نهاية الملف: enum + جدولان

```prisma
// ===== وكلاء أصحاب الأصول (Asset Owner Agents) =====

enum AssetAgentAppStatus {
  NEW               // جديد
  UNDER_REVIEW      // قيد المراجعة
  NEEDS_INFO        // بحاجة إلى معلومات إضافية
  PRE_QUALIFIED     // مؤهَّل مبدئياً
  REJECTED          // مرفوض
  AWAITING_CONTRACT // بانتظار توقيع العقد
  CONTRACTED        // تم التعاقد
  ACTIVE            // حساب مفعّل
  SUSPENDED         // موقوف
}

// طلب الانضمام كوكيل لصاحب أصل (النموذج العام)
model AssetAgentApplication {
  id String @id @default(cuid())

  // ----- بيانات شخصية وتواصل -----
  fullName          String
  nationality       String?
  country           String? // دولة الإقامة
  city              String?
  phone             String
  whatsapp          String?
  email             String
  preferredLanguage String  @default("ar") // ar / tr / en

  // ----- الصفة المهنية -----
  professionalType      String?
  professionalTypeOther String?

  // ----- نوع العلاقة بأصحاب الأصول -----
  relationshipType      String?
  relationshipTypeOther String?

  // ----- التغطية -----
  coveredAssetTypes      Json?
  coveredAssetTypesOther String?
  coveredRegions         Json?
  coveredRegionsOther    String?

  // ----- الخبرة -----
  experienceYears       String?
  experienceDescription String?
  hasPreviousDeals      String? // yes / no
  previousDeals         String?

  // ----- القدرة على توفير المعلومات (yes/no) -----
  canProvideInfo      String?
  canContactOwner     String?
  canArrangeMeeting   String?
  canProvideDocuments String?
  ownerWantsDeal      String?
  hasOwnerPermission  String?

  // ----- روابط مهنية -----
  linkedinUrl String?
  websiteUrl  String?
  companyUrl  String?

  // ----- الإقرارات الإلزامية -----
  infoAccuracyAck     Boolean @default(false)
  noRepresentationAck Boolean @default(false)
  privacyAccepted     Boolean @default(false)
  contactConsent      Boolean @default(false)
  ownerConsentAck     Boolean @default(false)

  // ----- إدارة / حوكمة -----
  status          AssetAgentAppStatus @default(NEW)
  score           Int                 @default(0)
  assignedTo      User?               @relation("AssetAgentAppAssignee", fields: [assignedToId], references: [id])
  assignedToId    String?
  adminNotes      String?
  rejectionReason String?
  lastContactAt   DateTime?

  // ----- مصدر / لغة / تقني -----
  source       String  @default("asset_owner_agents_page")
  languageCode String  @default("ar")
  ipAddress    String?
  userAgent    String?

  files AssetAgentFile[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([status])
  @@index([country])
  @@index([assignedToId])
  @@index([createdAt])
}

// ملفات طلب الوكيل (سرّية — للإدارة فقط)
model AssetAgentFile {
  id            String                @id @default(cuid())
  application   AssetAgentApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  applicationId String

  fileName     String
  storageKey   String  // مرجع تخزين آمن — لا يُخدَم مباشرة
  fileType     String?
  fileSize     Int?
  fileCategory String? // cv / company_profile / id / authorization / supporting
  visibility   String  @default("admin_only")

  createdAt DateTime @default(now())

  @@index([applicationId])
}
```

### ثم طبّق الهجرة وأعِد توليد العميل
```bash
npx prisma migrate dev --name asset_owner_agents
# أو على بيئة منشورة: npx prisma migrate deploy && npx prisma generate
```
> Prisma سيولّد ملف الهجرة الصحيح ويطبّقه. ملاحظة Postgres: لا تُستخدم قيم enum
> الجديدة داخل نفس الهجرة، لذا لا مشكلة في `ALTER TYPE ... ADD VALUE`.

(SQL مرجعي اختياري في نهاية هذا الملف.)

---

## 2) الإشعارات — `src/lib/notify.ts`

أضف هذه الأسطر إلى الكائن `SUBJECTS` (لازمة لأن النوع `Record<NotificationType, string>`):
```ts
  ASSET_AGENT_APPLICATION_RECEIVED: "طلب وكيل صاحب أصل جديد",
  ASSET_AGENT_STATUS_CHANGED: "تحديث حالة طلب الوكالة",
  ASSET_AGENT_CONTRACT_SENT: "عقد الوكالة جاهز للتوقيع",
  ASSET_AGENT_CONTRACT_SIGNED: "تم توقيع عقد الوكالة",
  ASSET_AGENT_ACCOUNT_CREATED: "تم فتح حساب وكيل صاحب الأصل",
  ASSET_AGENT_NEW_MESSAGE: "رسالة داخلية جديدة",
  ASSET_AGENT_NEW_ASSET: "أصل/فرصة جديدة من وكيل",
  ASSET_AGENT_ASSET_STATUS_CHANGED: "تحديث حالة أصل مقدّم",
```

---

## 3) روابط التنقّل (تستعمل `agentUi` — بلا حاجة لتعديل `i18n.ts`)

### الرأس العام — `src/components/PublicHeader.tsx`
أضف الاستيراد:
```ts
import { agentUi } from "@/lib/agent-i18n";
```
وداخل `<nav className="hidden ... lg:flex">` أضف رابطاً (مثلاً بعد رابط «الفرص»):
```tsx
<Link href={localeHref(locale, "/asset-owner-agents")} className="transition hover:text-gold">{agentUi(locale).navLabel}</Link>
```

### التذييل — `src/components/Footer.tsx`
أضف الاستيراد `import { agentUi } from "@/lib/agent-i18n";` ثم داخل قائمة «تصفّح»:
```tsx
<li><Link href={localeHref(locale, "/asset-owner-agents")} className="transition hover:text-gold">{agentUi(locale).navLabel}</Link></li>
```

### شريط الإدارة الجانبي — `src/components/Sidebar.tsx`
أضف الاستيراد `import { agentUi } from "@/lib/agent-i18n";` ثم داخل `<nav>` (بعد عناصر القائمة):
```tsx
<Link href="/admin/asset-agents"
  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-baraka-light hover:text-baraka-dark transition">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  {agentUi(locale).listTitle}
</Link>
```

### (اختياري) الصفحة الرئيسية وصفحات الشراكات/أصحاب الفرص
حسب التعليمات يُستحسن وضع الرابط أيضاً في الصفحة الرئيسية وضمن أقسام التعاون. أضف أينما يناسب:
```tsx
<Link href={localeHref(locale, "/asset-owner-agents")}>{agentUi(locale).navLabel}</Link>
```

---

## 4) التحقّق بعد التطبيق
```bash
npx tsc --noEmit     # يجب أن تختفي أخطاء assetAgentApplication / NotificationType
npm run dev          # ثم افتح /ar/asset-owner-agents وجرّب الإرسال، و /admin/asset-agents
```

---

## ما لم يُنجَز بعد (المرحلة 2 — مرآة للسفراء)
- تفعيل دور `ASSET_OWNER_AGENT`: ربط `/agent` في `middleware.ts` ونوع `Role` في `auth.ts`، وإنشاء `User` من الطلب عند الاعتماد.
- عقد الوكالة + تفعيل الحساب (مرآة `AmbassadorContract` / `AmbassadorAccount`).
- نموذج رفع الأصول من الوكيل (مرآة `AmbassadorReferral`) + مراجعتها والتحويل إلى فرصة استثمارية.
- نظام المراسلات الداخلية (مرآة `AmbassadorMessage` / `AmbassadorMessageReply`).
- لوحة الوكيل `/agent` (ملفه، أصوله، رسائله).
> أنصح ببنائها بعد استقرار طبقة تطبيق السفراء كي تتطابق التسميات والأنماط تماماً.

---

## ملحق: SQL مرجعي (اختياري — إن فضّلت كتابة الهجرة يدوياً)
```sql
ALTER TYPE "UserRole" ADD VALUE 'ASSET_OWNER_AGENT';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_APPLICATION_RECEIVED';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_STATUS_CHANGED';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_CONTRACT_SENT';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_CONTRACT_SIGNED';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_ACCOUNT_CREATED';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_NEW_MESSAGE';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_NEW_ASSET';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_ASSET_STATUS_CHANGED';

CREATE TYPE "AssetAgentAppStatus" AS ENUM ('NEW','UNDER_REVIEW','NEEDS_INFO','PRE_QUALIFIED','REJECTED','AWAITING_CONTRACT','CONTRACTED','ACTIVE','SUSPENDED');

CREATE TABLE "AssetAgentApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationality" TEXT,
    "country" TEXT,
    "city" TEXT,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT NOT NULL,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'ar',
    "professionalType" TEXT,
    "professionalTypeOther" TEXT,
    "relationshipType" TEXT,
    "relationshipTypeOther" TEXT,
    "coveredAssetTypes" JSONB,
    "coveredAssetTypesOther" TEXT,
    "coveredRegions" JSONB,
    "coveredRegionsOther" TEXT,
    "experienceYears" TEXT,
    "experienceDescription" TEXT,
    "hasPreviousDeals" TEXT,
    "previousDeals" TEXT,
    "canProvideInfo" TEXT,
    "canContactOwner" TEXT,
    "canArrangeMeeting" TEXT,
    "canProvideDocuments" TEXT,
    "ownerWantsDeal" TEXT,
    "hasOwnerPermission" TEXT,
    "linkedinUrl" TEXT,
    "websiteUrl" TEXT,
    "companyUrl" TEXT,
    "infoAccuracyAck" BOOLEAN NOT NULL DEFAULT false,
    "noRepresentationAck" BOOLEAN NOT NULL DEFAULT false,
    "privacyAccepted" BOOLEAN NOT NULL DEFAULT false,
    "contactConsent" BOOLEAN NOT NULL DEFAULT false,
    "ownerConsentAck" BOOLEAN NOT NULL DEFAULT false,
    "status" "AssetAgentAppStatus" NOT NULL DEFAULT 'NEW',
    "score" INTEGER NOT NULL DEFAULT 0,
    "assignedToId" TEXT,
    "adminNotes" TEXT,
    "rejectionReason" TEXT,
    "lastContactAt" TIMESTAMP(3),
    "source" TEXT NOT NULL DEFAULT 'asset_owner_agents_page',
    "languageCode" TEXT NOT NULL DEFAULT 'ar',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AssetAgentApplication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssetAgentFile" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "fileCategory" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'admin_only',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AssetAgentFile_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AssetAgentApplication_status_idx" ON "AssetAgentApplication"("status");
CREATE INDEX "AssetAgentApplication_country_idx" ON "AssetAgentApplication"("country");
CREATE INDEX "AssetAgentApplication_assignedToId_idx" ON "AssetAgentApplication"("assignedToId");
CREATE INDEX "AssetAgentApplication_createdAt_idx" ON "AssetAgentApplication"("createdAt");
CREATE INDEX "AssetAgentFile_applicationId_idx" ON "AssetAgentFile"("applicationId");

ALTER TABLE "AssetAgentApplication" ADD CONSTRAINT "AssetAgentApplication_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AssetAgentFile" ADD CONSTRAINT "AssetAgentFile_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "AssetAgentApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```
