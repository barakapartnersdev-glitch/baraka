-- ملف توثيق المستثمر (KYC + تفضيلات الاستثمار) على كيان المستثمر — سرّي للإدارة فقط
ALTER TABLE "InvestorEntity" ADD COLUMN "profile" JSONB;
ALTER TABLE "InvestorEntity" ADD COLUMN "profileSubmittedAt" TIMESTAMP(3);
