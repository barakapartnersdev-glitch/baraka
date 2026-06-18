import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getAccountStatus } from "@/lib/account";
import InvestorWizard from "@/components/wizard/InvestorWizard";
import { isInvestorProfileComplete, type Ans } from "@/lib/investor-form";

export const dynamic = "force-dynamic";

function asAnswers(value: unknown): Ans {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Ans) : {};
}

export default async function InvestorProfilePage() {
  const session = await requireRole("INVESTOR");
  const status = await getAccountStatus(session.userId);

  const entity = await prisma.investorEntity.findFirst({
    where: { investorId: session.userId },
    orderBy: { createdAt: "asc" },
    select: { type: true, profile: true, profileSubmittedAt: true },
  });

  const answers = asAnswers(entity?.profile);
  // بذر نوع المستثمر من الكيان (المحدّد عند التسجيل) عند أول زيارة
  if (!answers.investorType && entity?.type) answers.investorType = entity.type;
  const submitted = !!entity?.profileSubmittedAt;
  const complete = isInvestorProfileComplete(answers);

  return (
    <div>
      <Link href="/investor" className="text-sm text-baraka hover:underline">
        ← العودة إلى الفرص
      </Link>

      <div className="mb-6 mt-2">
        <h1 className="text-2xl font-extrabold text-navy">توثيق حساب المستثمر</h1>
        <p className="mt-1 text-sm text-gray-500">
          استكمل بياناتك ليتمكّن الفريق من اعتماد حسابك وإتاحة طلب الاهتمام بالفرص. كل بياناتك سرّية لدى الإدارة ولا تُكشف لأصحاب المشاريع.
        </p>
      </div>

      {status === "ACTIVE" && (
        <p className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          حسابك مفعّل. يمكنك تحديث بيانات ملفك في أي وقت.
        </p>
      )}
      {status !== "ACTIVE" && submitted && (
        <p className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          تم استلام ملفك وهو قيد مراجعة الإدارة.
        </p>
      )}
      {status !== "ACTIVE" && !submitted && complete && (
        <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          بياناتك مكتملة — اضغط «إرسال الملف للمراجعة» في آخر قسم لإتمام التوثيق.
        </p>
      )}

      <InvestorWizard initialAnswers={answers} submitted={submitted} />
    </div>
  );
}
