-- نظام CRM / إدارة العلاقات الاستثمارية — الأساس (المرحلة الأولى)
-- هجرة إضافية بالكامل: لا تعديل ولا حذف لأي جدول قائم.

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'NEW_CRM_LEAD';
ALTER TYPE "NotificationType" ADD VALUE 'CRM_LEAD_ASSIGNED';

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('INVESTOR_INTEREST', 'OPPORTUNITY_SUBMISSION', 'CONTACT', 'HOME_QUICK');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('OPPORTUNITY_PAGE', 'SUBMIT_PAGE', 'CONTACT_PAGE', 'HOME_PAGE');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "CrmLead" (
    "id" TEXT NOT NULL,
    "leadType" "LeadType" NOT NULL,
    "source" "LeadSource" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "priority" "LeadPriority" NOT NULL DEFAULT 'MEDIUM',
    "leadScore" INTEGER NOT NULL DEFAULT 0,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "country" TEXT,
    "city" TEXT,
    "companyName" TEXT,
    "senderRole" TEXT,
    "preferredContact" TEXT,
    "investmentBudget" TEXT,
    "sectorInterest" TEXT,
    "message" TEXT,
    "languageCode" TEXT NOT NULL DEFAULT 'ar',
    "internalTranslation" TEXT,
    "preferredReplyLanguage" TEXT,
    "relatedOpportunityId" TEXT,
    "projectSector" TEXT,
    "projectCountry" TEXT,
    "projectCity" TEXT,
    "hasFeasibility" TEXT,
    "hasLicensing" TEXT,
    "assignedToId" TEXT,
    "assignedById" TEXT,
    "assignedAt" TIMESTAMP(3),
    "department" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isSpam" BOOLEAN NOT NULL DEFAULT false,
    "privacyAccepted" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "lastFollowupAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmNote" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "noteType" TEXT NOT NULL DEFAULT 'internal_note',
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrmNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmFollowup" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "followupAt" TIMESTAMP(3) NOT NULL,
    "followupType" TEXT NOT NULL DEFAULT 'call',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmFollowup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmFile" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "uploadedById" TEXT,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "visibility" TEXT NOT NULL DEFAULT 'admin_only',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrmFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmEmailTemplate" (
    "id" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "templateType" TEXT,
    "languageCode" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmEmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmActivityLog" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "actorId" TEXT,
    "actionType" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrmActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CrmLead_leadType_idx" ON "CrmLead"("leadType");

-- CreateIndex
CREATE INDEX "CrmLead_status_idx" ON "CrmLead"("status");

-- CreateIndex
CREATE INDEX "CrmLead_priority_idx" ON "CrmLead"("priority");

-- CreateIndex
CREATE INDEX "CrmLead_assignedToId_idx" ON "CrmLead"("assignedToId");

-- CreateIndex
CREATE INDEX "CrmLead_relatedOpportunityId_idx" ON "CrmLead"("relatedOpportunityId");

-- CreateIndex
CREATE INDEX "CrmLead_isRead_idx" ON "CrmLead"("isRead");

-- CreateIndex
CREATE INDEX "CrmLead_isSpam_idx" ON "CrmLead"("isSpam");

-- CreateIndex
CREATE INDEX "CrmLead_languageCode_idx" ON "CrmLead"("languageCode");

-- CreateIndex
CREATE INDEX "CrmLead_createdAt_idx" ON "CrmLead"("createdAt");

-- CreateIndex
CREATE INDEX "CrmNote_leadId_idx" ON "CrmNote"("leadId");

-- CreateIndex
CREATE INDEX "CrmFollowup_leadId_idx" ON "CrmFollowup"("leadId");

-- CreateIndex
CREATE INDEX "CrmFollowup_assignedToId_idx" ON "CrmFollowup"("assignedToId");

-- CreateIndex
CREATE INDEX "CrmFollowup_followupAt_idx" ON "CrmFollowup"("followupAt");

-- CreateIndex
CREATE INDEX "CrmFile_leadId_idx" ON "CrmFile"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "CrmEmailTemplate_templateKey_languageCode_key" ON "CrmEmailTemplate"("templateKey", "languageCode");

-- CreateIndex
CREATE INDEX "CrmEmailTemplate_languageCode_idx" ON "CrmEmailTemplate"("languageCode");

-- CreateIndex
CREATE INDEX "CrmActivityLog_leadId_idx" ON "CrmActivityLog"("leadId");

-- AddForeignKey
ALTER TABLE "CrmLead" ADD CONSTRAINT "CrmLead_relatedOpportunityId_fkey" FOREIGN KEY ("relatedOpportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmLead" ADD CONSTRAINT "CrmLead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmLead" ADD CONSTRAINT "CrmLead_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmNote" ADD CONSTRAINT "CrmNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "CrmLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmNote" ADD CONSTRAINT "CrmNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmFollowup" ADD CONSTRAINT "CrmFollowup_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "CrmLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmFollowup" ADD CONSTRAINT "CrmFollowup_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmFile" ADD CONSTRAINT "CrmFile_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "CrmLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmFile" ADD CONSTRAINT "CrmFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmActivityLog" ADD CONSTRAINT "CrmActivityLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "CrmLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmActivityLog" ADD CONSTRAINT "CrmActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
