"use server";
// إجراءات ملف المستثمر — حفظ/إرسال ملف التوثيق (KYC + التفضيلات) على InvestorEntity.
// محمية بـ requireRole("INVESTOR")؛ بيانات سرّية للإدارة فقط.
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/audit";
import { notifyAdmins } from "@/lib/notify";
import { isInvestorProfileComplete, type Ans } from "@/lib/investor-form";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const s = (a: Ans, id: string) => (typeof a[id] === "string" ? (a[id] as string).trim() : "");

// قيم مشتقّة لأعمدة الكيان (تبقى الأسئلة كاملة في profile JSON)
function derive(a: Ans, fallbackName: string) {
  const type = s(a, "investorType") || "individual";
  const name =
    type === "individual"
      ? s(a, "legalFullName") || fallbackName
      : s(a, "legalName") || fallbackName;
  const country =
    type === "individual" ? s(a, "residenceCountry") || s(a, "nationality") : s(a, "regCountry");
  return { type, name, country: country || null };
}

// إيجاد كيان المستثمر الأساسي أو إنشاؤه
async function getOrCreateEntity(userId: string, fullName: string, a: Ans) {
  const existing = await prisma.investorEntity.findFirst({
    where: { investorId: userId },
    orderBy: { createdAt: "asc" },
  });
  if (existing) return existing;
  const d = derive(a, fullName);
  return prisma.investorEntity.create({
    data: { investorId: userId, name: d.name, type: d.type, country: d.country },
  });
}

export async function saveInvestorProfile(answers: Ans): Promise<ActionResult> {
  const session = await requireRole("INVESTOR");
  const entity = await getOrCreateEntity(session.userId, session.fullName, answers);
  const d = derive(answers, session.fullName);

  await prisma.investorEntity.update({
    where: { id: entity.id },
    data: {
      name: d.name,
      type: d.type,
      country: d.country,
      profile: answers as unknown as Prisma.InputJsonValue,
    },
  });

  revalidatePath("/investor/profile");
  revalidatePath("/investor");
  return { ok: true };
}

export async function submitInvestorProfile(answers: Ans): Promise<ActionResult> {
  const session = await requireRole("INVESTOR");

  if (!isInvestorProfileComplete(answers)) {
    return { ok: false, error: "يرجى استكمال كل الحقول الإلزامية والإقرارات قبل الإرسال." };
  }

  const entity = await getOrCreateEntity(session.userId, session.fullName, answers);
  const d = derive(answers, session.fullName);
  const firstSubmit = !(entity as { profileSubmittedAt?: Date | null }).profileSubmittedAt;

  await prisma.investorEntity.update({
    where: { id: entity.id },
    data: {
      name: d.name,
      type: d.type,
      country: d.country,
      profile: answers as unknown as Prisma.InputJsonValue,
      profileSubmittedAt: new Date(),
    },
  });

  await logActivity({
    actorId: session.userId,
    action: "INVESTOR_PROFILE_SUBMITTED",
    entityType: "InvestorEntity",
    entityId: entity.id,
  });

  if (firstSubmit) {
    await notifyAdmins({
      type: "NEW_REGISTRATION",
      message: `أكمل المستثمر ${session.fullName} ملف التوثيق وهو بانتظار المراجعة.`,
      link: `/admin/investors/${session.userId}`,
    });
  }

  revalidatePath("/investor/profile");
  revalidatePath("/investor");
  revalidatePath("/admin/investors");
  return { ok: true };
}
