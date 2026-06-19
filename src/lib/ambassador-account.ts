// قراءة حساب السفير الحالي (خادم فقط). يُستخدم في بوّابة السفير لعزل البيانات.
import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAmbassadorAccount(userId: string) {
  return prisma.ambassadorAccount.findUnique({ where: { userId } });
}
