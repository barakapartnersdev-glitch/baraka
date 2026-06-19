-- وكلاء أصحاب الأصول (Asset Owner Agents) — المرحلة 1. هجرة إضافية بالكامل.
-- دور جديد + قيم إشعارات + نوع حالة + جدولان. لا تعديل/حذف لأي كيان قائم.

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ASSET_OWNER_AGENT';

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_APPLICATION_RECEIVED';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_STATUS_CHANGED';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_CONTRACT_SENT';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_CONTRACT_SIGNED';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_ACCOUNT_CREATED';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_NEW_MESSAGE';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_NEW_ASSET';
ALTER TYPE "NotificationType" ADD VALUE 'ASSET_AGENT_ASSET_STATUS_CHANGED';

-- CreateEnum
CREATE TYPE "AssetAgentAppStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'NEEDS_INFO', 'PRE_QUALIFIED', 'REJECTED', 'AWAITING_CONTRACT', 'CONTRACTED', 'ACTIVE', 'SUSPENDED');

-- CreateTable
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

-- CreateTable
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

-- CreateIndex
CREATE INDEX "AssetAgentApplication_status_idx" ON "AssetAgentApplication"("status");

-- CreateIndex
CREATE INDEX "AssetAgentApplication_country_idx" ON "AssetAgentApplication"("country");

-- CreateIndex
CREATE INDEX "AssetAgentApplication_assignedToId_idx" ON "AssetAgentApplication"("assignedToId");

-- CreateIndex
CREATE INDEX "AssetAgentApplication_createdAt_idx" ON "AssetAgentApplication"("createdAt");

-- CreateIndex
CREATE INDEX "AssetAgentFile_applicationId_idx" ON "AssetAgentFile"("applicationId");

-- AddForeignKey
ALTER TABLE "AssetAgentApplication" ADD CONSTRAINT "AssetAgentApplication_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentFile" ADD CONSTRAINT "AssetAgentFile_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "AssetAgentApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
