-- أدوار الإدارة الفرعية الدقيقة — هجرة إضافية بالكامل.
-- تضيف نوع AdminRole وعمود User.adminRole، وتُرقّي كل أدمن حالي إلى SUPER_ADMIN
-- حفاظاً على السلوك السابق (كل أدمن كان يملك كل الصلاحيات).

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'AMBASSADOR_MANAGER', 'LEGAL_MANAGER', 'STAFF');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "adminRole" "AdminRole";

-- Backfill: الأدمن الحاليون → SUPER_ADMIN
UPDATE "User" SET "adminRole" = 'SUPER_ADMIN' WHERE "role" = 'ADMIN';
