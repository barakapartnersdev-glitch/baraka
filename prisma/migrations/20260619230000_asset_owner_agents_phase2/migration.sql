-- وكلاء أصحاب الأصول — المرحلة 2 (حساب/عقد/أصول/مراسلات). هجرة إضافية بالكامل.

-- CreateEnum
CREATE TYPE "AssetSubmissionStatus" AS ENUM ('NEW_SUBMISSION', 'UNDER_REVIEW', 'NEEDS_INFO', 'PRE_QUALIFIED', 'NOT_QUALIFIED', 'APPROVED', 'CONVERTED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AssetAgentContractStatus" AS ENUM ('NOT_SENT', 'SENT', 'OPENED', 'AWAITING_SIGNATURE', 'SIGNED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AssetAgentMessageStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED');

-- AlterTable (ربط الحساب + ملفات الأصول/البوابة)
ALTER TABLE "AssetAgentApplication" ADD COLUMN "userId" TEXT;
ALTER TABLE "AssetAgentFile" ADD COLUMN "submittedAssetId" TEXT;
ALTER TABLE "AssetAgentFile" ADD COLUMN "agentUserId" TEXT;

-- CreateTable
CREATE TABLE "AssetAgentContract" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" "AssetAgentContractStatus" NOT NULL DEFAULT 'NOT_SENT',
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

    CONSTRAINT "AssetAgentContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAgentAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3),
    "allowedAssetTypes" JSONB,
    "allowedRegions" JSONB,
    "assignedManagerId" TEXT,
    "contractId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetAgentAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAgentSubmittedAsset" (
    "id" TEXT NOT NULL,
    "agentUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "assetType" TEXT,
    "assetStatus" TEXT,
    "shortDescription" TEXT,
    "estimatedValue" TEXT,
    "requiredFinancing" TEXT,
    "offerType" TEXT,
    "agentRelationshipToOwner" TEXT,
    "hasOwnerPermission" TEXT,
    "hasOwnershipDocuments" TEXT,
    "canArrangeOwnerMeeting" TEXT,
    "additionalNotes" TEXT,
    "status" "AssetSubmissionStatus" NOT NULL DEFAULT 'NEW_SUBMISSION',
    "assignedToId" TEXT,
    "adminNotes" TEXT,
    "rejectionReason" TEXT,
    "convertedOpportunityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetAgentSubmittedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAgentMessage" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT,
    "agentUserId" TEXT,
    "relatedSubmittedAssetId" TEXT,
    "subject" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'general',
    "status" "AssetAgentMessageStatus" NOT NULL DEFAULT 'NEW',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetAgentMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAgentMessageReply" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "senderUserId" TEXT,
    "senderRole" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetAgentMessageReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetAgentApplication_userId_key" ON "AssetAgentApplication"("userId");

-- CreateIndex
CREATE INDEX "AssetAgentFile_submittedAssetId_idx" ON "AssetAgentFile"("submittedAssetId");

-- CreateIndex
CREATE INDEX "AssetAgentFile_agentUserId_idx" ON "AssetAgentFile"("agentUserId");

-- CreateIndex
CREATE INDEX "AssetAgentContract_applicationId_idx" ON "AssetAgentContract"("applicationId");

-- CreateIndex
CREATE INDEX "AssetAgentContract_status_idx" ON "AssetAgentContract"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AssetAgentAccount_userId_key" ON "AssetAgentAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AssetAgentAccount_applicationId_key" ON "AssetAgentAccount"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "AssetAgentAccount_contractId_key" ON "AssetAgentAccount"("contractId");

-- CreateIndex
CREATE INDEX "AssetAgentAccount_status_idx" ON "AssetAgentAccount"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AssetAgentSubmittedAsset_convertedOpportunityId_key" ON "AssetAgentSubmittedAsset"("convertedOpportunityId");

-- CreateIndex
CREATE INDEX "AssetAgentSubmittedAsset_agentUserId_idx" ON "AssetAgentSubmittedAsset"("agentUserId");

-- CreateIndex
CREATE INDEX "AssetAgentSubmittedAsset_status_idx" ON "AssetAgentSubmittedAsset"("status");

-- CreateIndex
CREATE INDEX "AssetAgentSubmittedAsset_assignedToId_idx" ON "AssetAgentSubmittedAsset"("assignedToId");

-- CreateIndex
CREATE INDEX "AssetAgentSubmittedAsset_createdAt_idx" ON "AssetAgentSubmittedAsset"("createdAt");

-- CreateIndex
CREATE INDEX "AssetAgentMessage_applicationId_idx" ON "AssetAgentMessage"("applicationId");

-- CreateIndex
CREATE INDEX "AssetAgentMessage_agentUserId_idx" ON "AssetAgentMessage"("agentUserId");

-- CreateIndex
CREATE INDEX "AssetAgentMessage_status_idx" ON "AssetAgentMessage"("status");

-- CreateIndex
CREATE INDEX "AssetAgentMessageReply_messageId_idx" ON "AssetAgentMessageReply"("messageId");

-- AddForeignKey
ALTER TABLE "AssetAgentApplication" ADD CONSTRAINT "AssetAgentApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentFile" ADD CONSTRAINT "AssetAgentFile_submittedAssetId_fkey" FOREIGN KEY ("submittedAssetId") REFERENCES "AssetAgentSubmittedAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentContract" ADD CONSTRAINT "AssetAgentContract_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "AssetAgentApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentAccount" ADD CONSTRAINT "AssetAgentAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentAccount" ADD CONSTRAINT "AssetAgentAccount_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "AssetAgentApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentAccount" ADD CONSTRAINT "AssetAgentAccount_assignedManagerId_fkey" FOREIGN KEY ("assignedManagerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentAccount" ADD CONSTRAINT "AssetAgentAccount_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "AssetAgentContract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentSubmittedAsset" ADD CONSTRAINT "AssetAgentSubmittedAsset_agentUserId_fkey" FOREIGN KEY ("agentUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentSubmittedAsset" ADD CONSTRAINT "AssetAgentSubmittedAsset_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentSubmittedAsset" ADD CONSTRAINT "AssetAgentSubmittedAsset_convertedOpportunityId_fkey" FOREIGN KEY ("convertedOpportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentMessage" ADD CONSTRAINT "AssetAgentMessage_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "AssetAgentApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentMessage" ADD CONSTRAINT "AssetAgentMessage_agentUserId_fkey" FOREIGN KEY ("agentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentMessageReply" ADD CONSTRAINT "AssetAgentMessageReply_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "AssetAgentMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAgentMessageReply" ADD CONSTRAINT "AssetAgentMessageReply_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
