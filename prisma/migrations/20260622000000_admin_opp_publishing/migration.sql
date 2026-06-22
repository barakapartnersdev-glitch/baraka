-- نشر الفرص من الإدارة + الترجمة الآلية: حقول إضافية (آمنة، قابلة للإلغاء) على Opportunity.
-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "Opportunity" ADD COLUMN IF NOT EXISTS "translations" JSONB;
ALTER TABLE "Opportunity" ADD COLUMN IF NOT EXISTS "createdByAdmin" BOOLEAN NOT NULL DEFAULT false;
