-- وجهات الاستثمار (صفحات SEO تعريفية حسب الدولة) — المرحلة الأولى
-- هجرة إضافية بالكامل: لا تعديل ولا حذف لأي جدول قائم.
-- تضيف جدولي Destination / DestinationTranslation، وتربط الفرص وطلبات الـ CRM بالوجهة،
-- وتضيف قيمة مصدر جديدة DESTINATION_PAGE لنماذج صفحات الدول.

-- AlterEnum
ALTER TYPE "LeadSource" ADD VALUE 'DESTINATION_PAGE';

-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN "destinationId" TEXT;

-- AlterTable
ALTER TABLE "CrmLead" ADD COLUMN "destinationId" TEXT;

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "countryKey" TEXT NOT NULL,
    "region" TEXT,
    "flagEmoji" TEXT,
    "featuredImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "showInMenu" BOOLEAN NOT NULL DEFAULT true,
    "showInFooter" BOOLEAN NOT NULL DEFAULT true,
    "inSitemap" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DestinationTranslation" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "countryName" TEXT,
    "pageTitle" TEXT,
    "h1Title" TEXT NOT NULL,
    "introText" TEXT,
    "whyInvestTitle" TEXT,
    "whyInvestPoints" JSONB,
    "keySectorsTitle" TEXT,
    "keySectorsList" JSONB,
    "opportunityTypesTitle" TEXT,
    "opportunityTypesList" JSONB,
    "investorNotesTitle" TEXT,
    "investorNotesPoints" JSONB,
    "disclaimerText" TEXT,
    "ctaTitle" TEXT,
    "ctaDescription" TEXT,
    "ctaButtonText" TEXT,
    "faq" JSONB,
    "seoTitle" TEXT,
    "metaDescription" TEXT,
    "focusKeyword" TEXT,
    "secondaryKeywords" JSONB,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "twitterTitle" TEXT,
    "twitterDescription" TEXT,
    "twitterImage" TEXT,
    "schemaJson" JSONB,
    "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "robotsFollow" BOOLEAN NOT NULL DEFAULT true,
    "sitemapPriority" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "sitemapChangefreq" TEXT NOT NULL DEFAULT 'monthly',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DestinationTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Destination_countryKey_key" ON "Destination"("countryKey");

-- CreateIndex
CREATE INDEX "Destination_isActive_idx" ON "Destination"("isActive");

-- CreateIndex
CREATE INDEX "Destination_displayOrder_idx" ON "Destination"("displayOrder");

-- CreateIndex
CREATE INDEX "DestinationTranslation_destinationId_idx" ON "DestinationTranslation"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationTranslation_destinationId_locale_key" ON "DestinationTranslation"("destinationId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationTranslation_locale_slug_key" ON "DestinationTranslation"("locale", "slug");

-- CreateIndex
CREATE INDEX "Opportunity_destinationId_idx" ON "Opportunity"("destinationId");

-- CreateIndex
CREATE INDEX "CrmLead_destinationId_idx" ON "CrmLead"("destinationId");

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmLead" ADD CONSTRAINT "CrmLead_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationTranslation" ADD CONSTRAINT "DestinationTranslation_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
