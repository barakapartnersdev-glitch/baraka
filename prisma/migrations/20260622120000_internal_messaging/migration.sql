-- المراسلة الداخلية الموحّدة (الإدارة ↔ سفير/وكيل/صاحب أصل/مستثمر). هجرة إضافية بالكامل.

-- AlterEnum (قيمة إشعار جديدة للاتجاهين)
ALTER TYPE "NotificationType" ADD VALUE 'INTERNAL_NEW_MESSAGE';

-- CreateEnum
CREATE TYPE "InternalThreadStatus" AS ENUM ('OPEN', 'REPLIED', 'CLOSED');

-- CreateTable
CREATE TABLE "InternalThread" (
    "id" TEXT NOT NULL,
    "recipientUserId" TEXT NOT NULL,
    "recipientRole" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "languageCode" TEXT NOT NULL DEFAULT 'ar',
    "status" "InternalThreadStatus" NOT NULL DEFAULT 'OPEN',
    "createdById" TEXT,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipientUnread" BOOLEAN NOT NULL DEFAULT true,
    "adminUnread" BOOLEAN NOT NULL DEFAULT false,
    "emailCopySent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderUserId" TEXT,
    "senderRole" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "emailedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternalMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalMessageTemplate" (
    "id" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "languageCode" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalMessageTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InternalThread_recipientUserId_idx" ON "InternalThread"("recipientUserId");

-- CreateIndex
CREATE INDEX "InternalThread_recipientRole_idx" ON "InternalThread"("recipientRole");

-- CreateIndex
CREATE INDEX "InternalThread_status_idx" ON "InternalThread"("status");

-- CreateIndex
CREATE INDEX "InternalThread_lastMessageAt_idx" ON "InternalThread"("lastMessageAt");

-- CreateIndex
CREATE INDEX "InternalMessage_threadId_idx" ON "InternalMessage"("threadId");

-- CreateIndex
CREATE INDEX "InternalMessageTemplate_languageCode_idx" ON "InternalMessageTemplate"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "InternalMessageTemplate_templateKey_languageCode_key" ON "InternalMessageTemplate"("templateKey", "languageCode");

-- AddForeignKey
ALTER TABLE "InternalThread" ADD CONSTRAINT "InternalThread_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalThread" ADD CONSTRAINT "InternalThread_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalMessage" ADD CONSTRAINT "InternalMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "InternalThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalMessage" ADD CONSTRAINT "InternalMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
