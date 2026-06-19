// قراءة حساب الوكيل الحالي (خادم فقط) — لعزل بيانات البوابة.
import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAgentAccount(userId: string) {
  return prisma.assetAgentAccount.findUnique({ where: { userId } });
}
