# مواصفة المرحلة 2 — قسم «وكلاء أصحاب الأصول» (Asset Owner Agents)

تكملة لما بُني في المرحلة 1 (الصفحة العامة + نموذج التقديم + لوحة مراجعة الإدارة).
المرحلة 2 تُحوِّل المتقدّم المقبول إلى **وكيل فعّال** له حساب وبوابة، تُمكّنه من رفع
الأصول/الفرص، مع نظام مراسلات داخلي، وربط الأصول المعتمدة بخطّ الفرص الاستثمارية.

> **مبدأ التصميم:** القسم **توأم بنيوي** لميزة «سفراء الاستثمار». نبني المرحلة 2 لتطابق
> خطة Phase B/C للسفراء (انظر memory `investment-ambassadors-build`). الفرق الجوهري:
> السفير **يرشّح مستثمرين**، أمّا الوكيل **يقدّم أصولاً/فرصاً** تتحوّل إلى Opportunity.
> يُفضّل بناء هذه المرحلة **بعد استقرار طبقة تطبيق السفراء (Phase B)** كي تتطابق الأنماط.

---

## 0) ما قبل البدء — متطلّب
يجب أولاً تطبيق **باتش المرحلة 1** (`ASSET_OWNER_AGENTS_INTEGRATION.md`):
جدولا `AssetAgentApplication`/`AssetAgentFile`، الـ enum، قيمة `UserRole.ASSET_OWNER_AGENT`،
قيم `NotificationType` الثماني، وروابط التنقّل. المرحلة 2 تبني فوقها.

---

## 1) نطاق المرحلة 2

**داخل النطاق:**
- تفعيل دور `ASSET_OWNER_AGENT` وبوابة `/agent`.
- إنشاء حساب الوكيل من الطلب المعتمد + ضبط كلمة المرور.
- عقد الوكالة (`AssetAgentContract`): إرسال/رفع نسخة موقّعة + دورة حياة الحالة.
- نموذج رفع الأصول من الوكيل (§10) + حالاتها ومراجعتها.
- تحويل الأصل المعتمد إلى Opportunity (§19–20).
- نظام المراسلات الداخلية (§8).
- الإشعارات (§11) والصلاحيات وحماية البيانات (§14).

**خارج النطاق (المرحلة 3 — مرآة Phase C للسفراء):**
توقيع إلكتروني مدمج (DocuSign/Dropbox Sign)، نظام عمولات/تقييم وكلاء وترتيبهم،
توثيق هوية متقدّم، ربط واتساب، لوحة إحصائيات للوكيل، تعدّد مسؤولين لكل وكيل.

---

## 2) تفعيل الدور والتوجيه (تعديلات ملفات مشتركة)

نفس نمط ما فُعِل لـ `AMBASSADOR`/`/ambassador`:

| الملف | التعديل |
|------|--------|
| `src/lib/auth.ts:8` | أضِف `"ASSET_OWNER_AGENT"` إلى اتحاد `Role`. |
| `src/middleware.ts:20` (`requiredRole`) | أضِف `if (pathname.startsWith("/agent")) return "ASSET_OWNER_AGENT";` |
| `src/lib/i18n.ts` (`NON_LOCALIZED_PREFIXES`) | أضِف `"/agent"`. |
| `src/app/login/actions.ts:14` (`HOME_BY_ROLE`) | أضِف `ASSET_OWNER_AGENT: "/agent"`. |

> ملاحظة: `HOME_BY_ROLE` نوعه `Record<Role,string>` — إضافة الدور لـ `Role` تُلزم إضافته
> هنا أيضاً، لذا التعديلان متلازمان.

البوّابة: `src/app/agent/layout.tsx` (حارس `requireRole("ASSET_OWNER_AGENT")` + ترويسة + جرس
إشعارات + لافتة حالة الحساب) — مرآة `src/app/owner/layout.tsx`.

---

## 3) إضافات قاعدة البيانات (Prisma — هجرة إضافية ثانية)

تُضاف في `prisma/schema.prisma`، ثم `prisma migrate dev --name asset_owner_agents_phase2`.
كلّها **إضافية** (لا تعديل مدمّر). مرآة لنماذج السفراء.

### Enums جديدة
```prisma
enum AssetSubmissionStatus {
  NEW_SUBMISSION   // جديد (New Asset Submission)
  UNDER_REVIEW     // قيد المراجعة
  NEEDS_INFO       // بحاجة معلومات
  PRE_QUALIFIED    // مؤهَّل مبدئياً
  NOT_QUALIFIED    // غير مؤهَّل
  APPROVED         // معتمد (جاهز للتحويل)
  CONVERTED        // حُوِّل إلى فرصة استثمارية
  REJECTED         // مرفوض
  ARCHIVED         // مؤرشف
}

enum AssetAgentContractStatus { NOT_SENT SENT OPENED AWAITING_SIGNATURE SIGNED REJECTED EXPIRED }
enum AssetAgentMessageStatus  { NEW IN_PROGRESS REPLIED CLOSED }
```

### علاقات على `model User` (معكوسة)
```prisma
  assetAgentAccount        AssetAgentAccount?        @relation("AssetAgentAccountUser")
  assetAgentAccountsManaged AssetAgentAccount[]      @relation("AssetAgentAccountManager")
  assetAgentSubmissions    AssetAgentSubmittedAsset[] @relation("AssetAgentSubmitter")
  assetAgentSubsAssigned   AssetAgentSubmittedAsset[] @relation("AssetAgentSubAssignee")
  assetAgentMessages       AssetAgentMessage[]       @relation("AssetAgentMsgAgent")
  assetAgentMsgReplies     AssetAgentMessageReply[]
```
وأضِف على `AssetAgentApplication` (الموجود من المرحلة 1):
```prisma
  userId   String?            @unique           // يُملأ عند تفعيل الحساب
  user     User?              @relation("AssetAgentUser", fields:[userId], references:[id])
  contracts AssetAgentContract[]
  account  AssetAgentAccount?
```
(وعلى `User`: `assetAgentApplication AssetAgentApplication? @relation("AssetAgentUser")`)

### النماذج الجديدة (مختصرة — مرآة AmbassadorContract/Account/Referral/Message/Reply)
```prisma
model AssetAgentContract {            // مرآة AmbassadorContract
  id String @id @default(cuid())
  application   AssetAgentApplication @relation(fields:[applicationId], references:[id], onDelete:Cascade)
  applicationId String
  account       AssetAgentAccount? @relation("AssetAgentAccountContract")
  status AssetAgentContractStatus @default(NOT_SENT)
  contractPdfKey String?  signedPdfKey String?
  sentAt DateTime?  openedAt DateTime?  signedAt DateTime?  expiresAt DateTime?
  signingProvider String?  externalSignatureId String?
  createdAt DateTime @default(now())  updatedAt DateTime @updatedAt
  @@index([applicationId]) @@index([status])
}

model AssetAgentAccount {             // مرآة AmbassadorAccount
  id String @id @default(cuid())
  user   User @relation("AssetAgentAccountUser", fields:[userId], references:[id])
  userId String @unique
  application   AssetAgentApplication @relation(fields:[applicationId], references:[id])
  applicationId String @unique
  status String @default("active")    // active / suspended / closed
  startDate DateTime?
  allowedAssetTypes Json?  allowedRegions Json?   // نطاق التفويض
  assignedManager   User? @relation("AssetAgentAccountManager", fields:[assignedManagerId], references:[id])
  assignedManagerId String?
  contract   AssetAgentContract? @relation("AssetAgentAccountContract", fields:[contractId], references:[id])
  contractId String? @unique
  notes String?
  createdAt DateTime @default(now())  updatedAt DateTime @updatedAt
  @@index([status])
}

model AssetAgentSubmittedAsset {      // مرآة AmbassadorReferral — لكن للأصول
  id String @id @default(cuid())
  agentUser   User @relation("AssetAgentSubmitter", fields:[agentUserId], references:[id])
  agentUserId String
  // بيانات الأصل (§10)
  title String  country String?  city String?
  assetType   String?   // كود من ASSET_TYPES
  assetStatus String?   // operating / distressed / needs_financing / for_sale / for_partnership / for_development
  shortDescription String?
  estimatedValue   String?  requiredFinancing String?
  offerType String?     // sale / partnership / financing / operation / restructuring
  agentRelationshipToOwner String?   // كود من RELATIONSHIP_TYPES
  hasOwnerPermission     String?   // yes/no
  hasOwnershipDocuments  String?   // yes/no
  canArrangeOwnerMeeting String?   // yes/no
  additionalNotes String?
  // إدارة
  status AssetSubmissionStatus @default(NEW_SUBMISSION)
  assignedTo   User? @relation("AssetAgentSubAssignee", fields:[assignedToId], references:[id])
  assignedToId String?
  adminNotes String?  rejectionReason String?
  // ربط بالفرصة بعد التحويل (§20)
  convertedOpportunity   Opportunity? @relation(fields:[convertedOpportunityId], references:[id], onDelete:SetNull)
  convertedOpportunityId String? @unique
  files AssetAgentFile[]              // أعِد استخدام AssetAgentFile بإضافة submittedAssetId? اختياري
  createdAt DateTime @default(now())  updatedAt DateTime @updatedAt
  @@index([agentUserId]) @@index([status]) @@index([assignedToId]) @@index([createdAt])
}

model AssetAgentMessage {             // مرآة AmbassadorMessage
  id String @id @default(cuid())
  application   AssetAgentApplication? @relation(fields:[applicationId], references:[id])  // يدعم ما قبل/بعد الحساب
  applicationId String?
  agentUser   User? @relation("AssetAgentMsgAgent", fields:[agentUserId], references:[id])
  agentUserId String?
  relatedSubmittedAssetId String?
  subject String  messageType String @default("general")
  status AssetAgentMessageStatus @default(NEW)
  createdById String?
  replies AssetAgentMessageReply[]
  createdAt DateTime @default(now())  updatedAt DateTime @updatedAt
  @@index([applicationId]) @@index([agentUserId]) @@index([status])
}

model AssetAgentMessageReply {        // مرآة AmbassadorMessageReply
  id String @id @default(cuid())
  message   AssetAgentMessage @relation(fields:[messageId], references:[id], onDelete:Cascade)
  messageId String
  senderUserId String?  senderRole String?   // agent / admin (لقطة وقت الإرسال)
  body String
  createdAt DateTime @default(now())
  @@index([messageId])
}
```
ملاحظة: نشاط التدقيق يبقى على `ActivityLog` العام (entityType=`AssetAgentApplication`/`AssetAgentSubmittedAsset`)
كما في المرحلة 1، أو أنشئ `AssetAgentActivityLog` مرآةً لـ `AmbassadorActivityLog` إن أردت
تطابقاً كاملاً (مفضّل للتوأمة). **قرار** أدناه.

`AssetAgentFile`: أضِف عمودين اختياريين `submittedAssetId String?` و`agentUserId String?`
ليخدم ملفات الأصول وملفات «ملفاتي» في البوابة (مرآة `AmbassadorFile`).

---

## 4) دورة حياة الإدارة (إكمال لوحة المرحلة 1)

أضِف إلى `src/app/admin/asset-agents/[id]/AgentAdminActions.tsx` + `actions.ts`
(مرآة لما خطّطته خطة السفراء Phase B):
1. **طلب معلومات** → الحالة `NEEDS_INFO` + رسالة/بريد للمتقدّم (موجود جزئياً في المرحلة 1).
2. **قبول مبدئي** → `PRE_QUALIFIED`.
3. **رفض** → `REJECTED` + سبب داخلي (موجود).
4. **إرسال العقد** → ينشئ `AssetAgentContract(status=SENT)` + يولّد PDF عبر `pdf-lib`
   (مرآة `src/lib/ncnda.ts`) أو يرفع ملفاً + إشعار `ASSET_AGENT_CONTRACT_SENT` + الحالة `AWAITING_CONTRACT`.
5. **تسجيل توقيع العقد** → رفع PDF موقّع → `signedPdfKey` + `status=SIGNED` + حالة الطلب `CONTRACTED` + إشعار `ASSET_AGENT_CONTRACT_SIGNED`.
6. **فتح الحساب** (انظر §5) → الحالة `ACTIVE`.
7. **إيقاف/إعادة تفعيل** الحساب.

الإجراءات الجديدة (`actions.ts`، محميّة `requireRole("ADMIN")`، تُسجَّل بالنشاط):
`sendAgentContract`, `recordAgentContractSigned`, `createAgentAccount`, `suspendAgentAccount`.

---

## 5) إنشاء الحساب وضبط كلمة المرور

`createAgentAccount(applicationId)` (admin) — مرآة Phase B «Create Account»:
1. تحقّق أن الطلب `CONTRACTED` وأن `userId` فارغ والبريد غير مستخدم.
2. أنشئ `User{ role:ASSET_OWNER_AGENT, accountStatus:ACTIVE, fullName, email, passwordHash:عشوائي مؤقت }`.
3. اربط: `AssetAgentApplication.userId` + أنشئ `AssetAgentAccount`.
4. أصدر **رمز ضبط كلمة مرور** (JWT قصير العمر عبر `jose`، 24–72h) وأرسله بريداً
   (`/agent/set-password?token=…`). صفحة `src/app/agent/set-password/page.tsx` + إجراء يضبط
   `passwordHash`. إشعار `ASSET_AGENT_ACCOUNT_CREATED`.
5. سجّل النشاط `account_created`.

> **قرار 1:** رمز ضبط كلمة مرور (مُوصى به — لا تُرسل كلمات مرور بالبريد) مقابل كلمة مرور
> مؤقتة. التوصية: الرمز. (يلزم وحدة صغيرة `agent-account.ts` لإصدار/تحقّق الرمز — مرآة `lib/account.ts` إن وُجد.)

---

## 6) عقد الوكالة

- المرحلة 2: توليد PDF بسيط (`pdf-lib`، مرآة `lib/ncnda.ts` / `watermark.ts`) **أو** رفع يدوي
  لنسخة موقّعة. دورة الحالة `AssetAgentContractStatus`.
- المرحلة 3: توقيع إلكتروني مدمّج (`signingProvider`/`externalSignatureId` + webhook).
- التخزين: `contractPdfKey` / `signedPdfKey` عبر `lib/storage.ts`؛ التنزيل عبر مسار محمي
  جديد `src/app/api/agent-contracts/[id]/route.ts` (الإدارة + الوكيل صاحب العقد فقط).

---

## 7) بوابة الوكيل `/agent` (مرآة بوابة المالك/البوابة المخطّطة للسفير)

| المسار | المحتوى |
|------|--------|
| `src/app/agent/layout.tsx` | حارس الدور + ترويسة + جرس إشعارات + لافتة حالة الحساب |
| `src/app/agent/page.tsx` | لوحة: ملخّص الأصول حسب الحالة، رسائل غير مقروءة، حالة الحساب |
| `src/app/agent/profile/` | تعديل حقول محدودة (هاتف/واتساب/روابط/لغة)؛ لا تعديل للبريد/الاسم القانوني بلا موافقة |
| `src/app/agent/assets/` | قائمة أصوله فقط + حالاتها |
| `src/app/agent/assets/new/` | نموذج رفع أصل (§10) |
| `src/app/agent/assets/[id]/` | تفاصيل أصل + ملفاته + ملاحظات الإدارة المسموح بها + رسائل مرتبطة |
| `src/app/agent/messages/` | المراسلات الداخلية (قائمة + محادثة) |

كلّها server components بحارس `requireRole("ASSET_OWNER_AGENT")` + تصفية `where agentUserId = session.userId`.

---

## 8) نموذج رفع الأصل ومراجعته (§10)

- نموذج العميل `AgentAssetForm.tsx` (مرآة `AgentApplicationWizard` لكن أقصر) بالحقول في §3 أعلاه.
  تعريف الحقول في `src/lib/agent-asset-form.ts` (متعدّد اللغات، مرآة `agent-form.ts`).
- تُضاف تصنيفات جديدة في `src/lib/agent.ts`: `ASSET_STATUSES` (operating/distressed/…)،
  `OFFER_TYPES` (sale/partnership/financing/operation/restructuring).
- الإرسال `agent/assets/actions.ts → submitAsset()` ينشئ `AssetAgentSubmittedAsset(status=NEW_SUBMISSION)`
  + يخزّن الملفات + إشعار الإدارة `ASSET_AGENT_NEW_ASSET`.
- مراجعة الإدارة في `src/app/admin/asset-agents/assets/` (قائمة كل الأصول المقدّمة) و`[id]`
  (تفاصيل + تغيير حالة + إسناد + ملاحظات + زر «تحويل إلى فرصة»).
- **لا ينشر الوكيل أصلاً مباشرة؛ ولا يعدّله بعد دخوله المراجعة** (حارس على الحالة).

---

## 9) التحويل إلى فرصة استثمارية (§19–20)

`convertAssetToOpportunity(submittedAssetId)` (admin، الأصل `APPROVED`):
1. أنشئ `Opportunity{ title, sector←assetType, country, state:DRAFT_SOURCE,
   ownerId:???, sourceData: { source:"asset_owner_agent", agentId, agentName,
   agentApplicationId, submittedAt, relationshipToOwner, ownerConsent, notes } } }`.
2. انقل/اربط الملفات الأولية إن لزم.
3. `submittedAsset.convertedOpportunityId = opp.id` + `status=CONVERTED` + إشعار الوكيل
   `ASSET_AGENT_ASSET_STATUS_CHANGED`.
4. من هنا تُكمل الإدارة الفرصة في خطّ الحوكمة القائم (`/admin/opportunities`).

> **قرار 2 (مهم): `Opportunity.ownerId` لأصل وكيل.** الفرصة تتطلّب `owner:User`.
> الخيارات: (أ) **مستخدم الوكيل نفسه** كمصدر (مُوصى به — لا تغيير على Opportunity؛ بيانات
> المصدر في `sourceData`)؛ (ب) إضافة عمود `submittedByAgentId String?` على Opportunity (FK صريح،
> أوضح للتقارير، لكنه تعديل على نموذج مشترك). التوصية: (أ) + الاحتفاظ بالربط عبر
> `AssetAgentSubmittedAsset.convertedOpportunityId`. لا تُكشف بيانات الوكيل للمستثمر إلا بقرار الإدارة.

---

## 10) المراسلات الداخلية (§8)

- نموذج `AssetAgentMessage` يربط دائماً بـ `applicationId` و(بعد الحساب) `agentUserId`،
  فتنتقل المحادثة بسلاسة بعد فتح الحساب.
- **قبل الاعتماد:** الإدارة تنشئ رسالة على الطلب → يصل نصّها للمتقدّم بالبريد (لا حساب بعد).
  الردّ الكامل ثنائي الاتجاه داخل المنصة يكون **بعد فتح الحساب** (مرآة السفراء).
- **بعد الحساب:** الطرفان يتبادلان الرسائل في `/agent/messages` و`/admin/asset-agents/[id]`؛
  إشعار `ASSET_AGENT_NEW_MESSAGE` للطرف الآخر.
- إجراءات: `startThread`, `replyThread`, `setThreadStatus` (admin).

> **قرار 3:** دردشة كاملة قبل الاعتماد (تتطلّب وصولاً للمتقدّم بلا حساب — رمز/رابط) مقابل
> «بريد صادر + الحالة `NEEDS_INFO`» قبل الاعتماد ثم دردشة كاملة بعد الحساب. التوصية: الثاني
> (أبسط، يطابق السفراء، يكفي عملياً).

---

## 11) الإشعارات (§11) — جدول الأحداث

أنواع `NotificationType` مُضافة سلفاً في باتش المرحلة 1.

| الحدث | النوع | المستلِم |
|------|------|---------|
| رفع أصل جديد | `ASSET_AGENT_NEW_ASSET` | الإدارة |
| تغيّر حالة طلب | `ASSET_AGENT_STATUS_CHANGED` | الوكيل (بريد قبل الحساب) |
| إرسال العقد | `ASSET_AGENT_CONTRACT_SENT` | الوكيل |
| توقيع العقد | `ASSET_AGENT_CONTRACT_SIGNED` | الإدارة |
| فتح الحساب | `ASSET_AGENT_ACCOUNT_CREATED` | الوكيل |
| رسالة جديدة | `ASSET_AGENT_NEW_MESSAGE` | الطرف الآخر |
| تغيّر حالة أصل | `ASSET_AGENT_ASSET_STATUS_CHANGED` | الوكيل |

(القنوات: داخل المنصة + بريد عبر `notify`/`notifyAdmins`؛ واتساب = مرحلة 3.)

---

## 12) الصلاحيات وحماية البيانات (§14)

- كل استعلامات البوابة مُقيَّدة بـ `agentUserId = session.userId`.
- الوكيل **لا** يرى: المستثمرين، وكلاء آخرين، أصول غيره.
- الوكيل **لا** ينشر أصلاً ولا يعدّله بعد المراجعة، ولا يغيّر حالته.
- ملفات الهوية/التفويض: للإدارة فقط (مسارات `api/agent-files` و`api/agent-contracts` تتحقّق من الدور/الملكية).
- كل تغيير حالة/إسناد يُسجَّل في النشاط.
- النماذج العامة محميّة بمصيدة سبام + حدّ معدّل (قائم من المرحلة 1).

---

## 13) الملفات/الوحدات الجديدة (تقدير)

**lib:** `agent-asset-form.ts`، `agent-account.ts` (رمز كلمة المرور)، توسعة `agent.ts`
(ASSET_STATUSES/OFFER_TYPES + تسميات حالات الأصل/العقد/الرسالة)، توسعة `agent-i18n.ts`.
**عام/مصادقة:** `app/agent/set-password/`.
**بوابة الوكيل:** `app/agent/{layout,page,profile,assets,assets/new,assets/[id],messages}` + مكوّناتها + `actions.ts`.
**الإدارة:** توسعة `admin/asset-agents/[id]` (عقد/حساب)، `admin/asset-agents/assets/{page,[id]}` + `actions`.
**مسارات محميّة:** `api/agent-contracts/[id]/route.ts` (وتوسعة `api/agent-files` لملفات الأصول).
**مشترك (باتش، لا تحرير مباشر أثناء العمل المتزامن):** `auth.ts`، `middleware.ts`، `i18n.ts`،
`login/actions.ts` (§2).

---

## 14) قرارات مطلوبة (مع توصياتي)
1. ضبط كلمة المرور: **رمز عبر بريد** ✅ (لا كلمة مؤقتة).
2. `Opportunity.ownerId` للأصل المحوَّل: **مستخدم الوكيل + sourceData** ✅ (لا تعديل على Opportunity).
3. مراسلة ما قبل الاعتماد: **بريد + حالة NEEDS_INFO**، ودردشة كاملة بعد الحساب ✅.
4. سجل التدقيق: `AssetAgentActivityLog` مستقل (توأمة كاملة مع السفراء) مقابل `ActivityLog` العام.
   التوصية: **`AssetAgentActivityLog`** للتطابق مع السفراء (يلزم نموذج + علاقات User).
5. التوقيع الإلكتروني المدمج: **المرحلة 3** (المرحلة 2 = رفع PDF موقّع).

---

## 15) معايير القبول (مقابلة §22)
- [ ] الطلب المعتمد يُحوَّل إلى حساب وكيل فعّال بدور `ASSET_OWNER_AGENT` وبوابة `/agent`.
- [ ] الوكيل يضبط كلمة مروره عبر رابط آمن ويدخل.
- [ ] عقد الوكالة يُرسَل/يُرفع موقّعاً وتُتابَع حالته.
- [ ] الوكيل يرفع أصولاً (§10)؛ تصل للإدارة بحالة `NEW_SUBMISSION`.
- [ ] لا يُنشر أي أصل إلا بعد مراجعة الإدارة؛ الوكيل لا ينشر مباشرة.
- [ ] الأصل المعتمد يتحوّل إلى Opportunity مع حفظ مصدر الوكيل (§20).
- [ ] مراسلات داخلية ثنائية الاتجاه بعد الحساب، محفوظة ومربوطة بالوكيل.
- [ ] الإشعارات تعمل لكل أحداث §11.
- [ ] الصلاحيات والخصوصية (§14) مطبّقة؛ الوكيل لا يرى مستثمرين/وكلاء آخرين/أصول غيره.
- [ ] جميع النصوص بالعربية/التركية/الإنجليزية؛ الواجهة متجاوبة وRTL/LTR.

---

## 16) ترتيب البناء المقترح (مرحلتان فرعيّتان)
- **2أ — الحساب والبوابة الأساسية:** §2 الدور + §5 الحساب/كلمة المرور + بوابة `/agent` (لوحة + ملف)
  + §6 عقد بسيط (رفع يدوي). أصغر شريحة قابلة للاختبار.
- **2ب — الأصول والتحويل والمراسلات:** §8 نموذج الأصل + مراجعة الإدارة + §9 التحويل + §10 المراسلات + §11 الإشعارات.
- **(2ج/المرحلة 3):** توقيع إلكتروني، عمولات، تقييم/ترتيب، واتساب، إحصائيات.

> أعِد قراءة الملفات المشتركة قبل أي تعديل (الشيفرة تحت تطوير متزامن).
