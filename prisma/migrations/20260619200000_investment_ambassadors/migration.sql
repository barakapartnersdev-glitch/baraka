-- نظام سفراء الاستثمار (Investment Ambassadors) — المرحلة الأولى (الأساس)
-- هجرة إضافية بالكامل: لا تعديل ولا حذف لأي جدول أو نوع قائم.
-- تشمل: دور AMBASSADOR، قيم enum جديدة، 4 أنواع enum، 8 جداول + فهارس + مفاتيح أجنبية.

-- AlterEnum: دور السفير
ALTER TYPE "UserRole" ADD VALUE 'AMBASSADOR';

-- AlterEnum: نوع/مصدر طلب الـ CRM
ALTER TYPE "LeadType" ADD VALUE 'INVESTMENT_AMBASSADOR_APPLICATION';
ALTER TYPE "LeadSource" ADD VALUE 'INVESTMENT_AMBASSADORS_PAGE';

-- AlterEnum: أنواع الإشعارات
ALTER TYPE "NotificationType" ADD VALUE 'AMBASSADOR_APPLICATION_RECEIVED';
ALTER TYPE "NotificationType" ADD VALUE 'AMBASSADOR_STATUS_CHANGED';
ALTER TYPE "NotificationType" ADD VALUE 'AMBASSADOR_CONTRACT_SENT';
ALTER TYPE "NotificationType" ADD VALUE 'AMBASSADOR_CONTRACT_SIGNED';
ALTER TYPE "NotificationType" ADD VALUE 'AMBASSADOR_ACCOUNT_CREATED';
ALTER TYPE "NotificationType" ADD VALUE 'AMBASSADOR_NEW_MESSAGE';
ALTER TYPE "NotificationType" ADD VALUE 'AMBASSADOR_NEW_REFERRAL';
ALTER TYPE "NotificationType" ADD VALUE 'AMBASSADOR_REFERRAL_STATUS_CHANGED';

-- CreateEnum
CREATE TYPE "AmbassadorAppStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'NEEDS_INFO', 'INTERVIEW', 'PRE_QUALIFIED', 'NOT_QUALIFIED', 'PRE_ACCEPTED', 'AWAITING_CONTRACT', 'CONTRACT_SIGNED', 'ACCOUNT_CREATED', 'ACTIVE', 'SUSPENDED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'NEEDS_INFO', 'PRE_QUALIFIED', 'NOT_QUALIFIED', 'INVESTOR_CONTACTED', 'AWAITING_INVESTOR', 'MEETING_SCHEDULED', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AmbassadorContractStatus" AS ENUM ('NOT_SENT', 'SENT', 'OPENED', 'AWAITING_SIGNATURE', 'SIGNED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AmbassadorMessageStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED');

-- CreateTable
CREATE TABLE "AmbassadorApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationality" TEXT,
    "residenceCountry" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT NOT NULL,
    "preferredLanguage" TEXT,
    "spokenLanguages" JSONB,
    "photoKey" TEXT,
    "currentTitle" TEXT,
    "companyName" TEXT,
    "professionalRole" TEXT,
    "yearsOfExperience" TEXT,
    "workType" TEXT,
    "website" TEXT,
    "linkedinUrl" TEXT,
    "otherLinks" TEXT,
    "coveredCountries" JSONB,
    "investorTypes" JSONB,
    "coveredSectors" JSONB,
    "investmentRange" TEXT,
    "relationshipType" TEXT,
    "previousExperience" TEXT,
    "experienceSummary" TEXT,
    "motivation" TEXT,
    "addedValue" TEXT,
    "conflictOfInterest" TEXT,
    "answers" JSONB,
    "infoAccuracyAck" BOOLEAN NOT NULL DEFAULT false,
    "privacyAccepted" BOOLEAN NOT NULL DEFAULT false,
    "applicationAck" BOOLEAN NOT NULL DEFAULT false,
    "noRepresentationAck" BOOLEAN NOT NULL DEFAULT false,
    "contactConsent" BOOLEAN NOT NULL DEFAULT false,
    "status" "AmbassadorAppStatus" NOT NULL DEFAULT 'NEW',
    "score" INTEGER NOT NULL DEFAULT 0,
    "assignedToId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'investment_ambassadors_page',
    "languageCode" TEXT NOT NULL DEFAULT 'ar',
    "crmLeadId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbassadorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbassadorContract" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "templateId" TEXT,
    "status" "AmbassadorContractStatus" NOT NULL DEFAULT 'NOT_SENT',
    "contractPdfKey" TEXT,
    "signedPdfKey" TEXT,
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "signingProvider" TEXT,
    "externalSignatureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbassadorContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbassadorAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3),
    "allowedCountries" JSONB,
    "allowedSectors" JSONB,
    "assignedManagerId" TEXT,
    "contractId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbassadorAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbassadorReferral" (
    "id" TEXT NOT NULL,
    "ambassadorUserId" TEXT NOT NULL,
    "investorName" TEXT NOT NULL,
    "investorCompany" TEXT,
    "investorCountry" TEXT,
    "investorCity" TEXT,
    "investorType" TEXT,
    "interestedSectors" JSONB,
    "investmentRange" TEXT,
    "relationshipWithAmbassador" TEXT,
    "seriousnessLevel" TEXT,
    "consentConfirmed" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "linkedinUrl" TEXT,
    "website" TEXT,
    "description" TEXT,
    "ambassadorNotes" TEXT,
    "status" "ReferralStatus" NOT NULL DEFAULT 'NEW',
    "internalScore" INTEGER,
    "assignedToId" TEXT,
    "crmLeadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbassadorReferral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbassadorMessage" (
    "id" TEXT NOT NULL,
    "ambassadorUserId" TEXT NOT NULL,
    "relatedReferralId" TEXT,
    "subject" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'general',
    "status" "AmbassadorMessageStatus" NOT NULL DEFAULT 'NEW',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbassadorMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbassadorMessageReply" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "senderUserId" TEXT,
    "senderRole" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AmbassadorMessageReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbassadorFile" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT,
    "ambassadorUserId" TEXT,
    "referralId" TEXT,
    "messageId" TEXT,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "fileCategory" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'admin_only',
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AmbassadorFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbassadorActivityLog" (
    "id" TEXT NOT NULL,
    "ambassadorUserId" TEXT,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "actionType" TEXT NOT NULL,
    "description" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AmbassadorActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AmbassadorApplication_status_idx" ON "AmbassadorApplication"("status");

-- CreateIndex
CREATE INDEX "AmbassadorApplication_residenceCountry_idx" ON "AmbassadorApplication"("residenceCountry");

-- CreateIndex
CREATE INDEX "AmbassadorApplication_score_idx" ON "AmbassadorApplication"("score");

-- CreateIndex
CREATE INDEX "AmbassadorApplication_assignedToId_idx" ON "AmbassadorApplication"("assignedToId");

-- CreateIndex
CREATE INDEX "AmbassadorApplication_createdAt_idx" ON "AmbassadorApplication"("createdAt");

-- CreateIndex
CREATE INDEX "AmbassadorContract_applicationId_idx" ON "AmbassadorContract"("applicationId");

-- CreateIndex
CREATE INDEX "AmbassadorContract_status_idx" ON "AmbassadorContract"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AmbassadorAccount_userId_key" ON "AmbassadorAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AmbassadorAccount_applicationId_key" ON "AmbassadorAccount"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "AmbassadorAccount_contractId_key" ON "AmbassadorAccount"("contractId");

-- CreateIndex
CREATE INDEX "AmbassadorAccount_status_idx" ON "AmbassadorAccount"("status");

-- CreateIndex
CREATE INDEX "AmbassadorReferral_ambassadorUserId_idx" ON "AmbassadorReferral"("ambassadorUserId");

-- CreateIndex
CREATE INDEX "AmbassadorReferral_status_idx" ON "AmbassadorReferral"("status");

-- CreateIndex
CREATE INDEX "AmbassadorReferral_assignedToId_idx" ON "AmbassadorReferral"("assignedToId");

-- CreateIndex
CREATE INDEX "AmbassadorReferral_createdAt_idx" ON "AmbassadorReferral"("createdAt");

-- CreateIndex
CREATE INDEX "AmbassadorMessage_ambassadorUserId_idx" ON "AmbassadorMessage"("ambassadorUserId");

-- CreateIndex
CREATE INDEX "AmbassadorMessage_status_idx" ON "AmbassadorMessage"("status");

-- CreateIndex
CREATE INDEX "AmbassadorMessageReply_messageId_idx" ON "AmbassadorMessageReply"("messageId");

-- CreateIndex
CREATE INDEX "AmbassadorFile_applicationId_idx" ON "AmbassadorFile"("applicationId");

-- CreateIndex
CREATE INDEX "AmbassadorFile_ambassadorUserId_idx" ON "AmbassadorFile"("ambassadorUserId");

-- CreateIndex
CREATE INDEX "AmbassadorFile_referralId_idx" ON "AmbassadorFile"("referralId");

-- CreateIndex
CREATE INDEX "AmbassadorFile_messageId_idx" ON "AmbassadorFile"("messageId");

-- CreateIndex
CREATE INDEX "AmbassadorActivityLog_ambassadorUserId_idx" ON "AmbassadorActivityLog"("ambassadorUserId");

-- CreateIndex
CREATE INDEX "AmbassadorActivityLog_relatedEntityType_relatedEntityId_idx" ON "AmbassadorActivityLog"("relatedEntityType", "relatedEntityId");

-- CreateIndex
CREATE INDEX "AmbassadorActivityLog_createdAt_idx" ON "AmbassadorActivityLog"("createdAt");

-- AddForeignKey
ALTER TABLE "AmbassadorApplication" ADD CONSTRAINT "AmbassadorApplication_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorApplication" ADD CONSTRAINT "AmbassadorApplication_crmLeadId_fkey" FOREIGN KEY ("crmLeadId") REFERENCES "CrmLead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorContract" ADD CONSTRAINT "AmbassadorContract_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "AmbassadorApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorAccount" ADD CONSTRAINT "AmbassadorAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorAccount" ADD CONSTRAINT "AmbassadorAccount_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "AmbassadorApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorAccount" ADD CONSTRAINT "AmbassadorAccount_assignedManagerId_fkey" FOREIGN KEY ("assignedManagerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorAccount" ADD CONSTRAINT "AmbassadorAccount_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "AmbassadorContract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorReferral" ADD CONSTRAINT "AmbassadorReferral_ambassadorUserId_fkey" FOREIGN KEY ("ambassadorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorReferral" ADD CONSTRAINT "AmbassadorReferral_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorReferral" ADD CONSTRAINT "AmbassadorReferral_crmLeadId_fkey" FOREIGN KEY ("crmLeadId") REFERENCES "CrmLead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorMessage" ADD CONSTRAINT "AmbassadorMessage_ambassadorUserId_fkey" FOREIGN KEY ("ambassadorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorMessage" ADD CONSTRAINT "AmbassadorMessage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorMessageReply" ADD CONSTRAINT "AmbassadorMessageReply_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "AmbassadorMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorMessageReply" ADD CONSTRAINT "AmbassadorMessageReply_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorFile" ADD CONSTRAINT "AmbassadorFile_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "AmbassadorApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorFile" ADD CONSTRAINT "AmbassadorFile_ambassadorUserId_fkey" FOREIGN KEY ("ambassadorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorFile" ADD CONSTRAINT "AmbassadorFile_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "AmbassadorReferral"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorFile" ADD CONSTRAINT "AmbassadorFile_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "AmbassadorMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorFile" ADD CONSTRAINT "AmbassadorFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorActivityLog" ADD CONSTRAINT "AmbassadorActivityLog_ambassadorUserId_fkey" FOREIGN KEY ("ambassadorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorActivityLog" ADD CONSTRAINT "AmbassadorActivityLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
