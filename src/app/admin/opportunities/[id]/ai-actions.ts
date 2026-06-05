"use server";
// توليد تقرير تقييم الفرصة بالذكاء الاصطناعي وتخزينه — محمي للإدارة.
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/audit";
import {
  buildReport,
  buildReportMarkdown,
  extractAnswers,
  type ReportMeta,
} from "@/lib/opportunity-report";
import { generateEvaluation, MissingApiKeyError, type EvalMode } from "@/lib/ai-evaluation";

export interface AiReportResult {
  ok: boolean;
  text?: string;
  at?: string;
  error?: string;
}

export async function generateAiReport(
  opportunityId: string,
  mode: EvalMode
): Promise<AiReportResult> {
  await requireRole("ADMIN");

  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: { owner: { select: { fullName: true } } },
  });
  if (!opp) return { ok: false, error: "الفرصة غير موجودة." };

  const answers = extractAnswers(opp.sourceData);
  if (Object.keys(answers).length === 0) {
    return { ok: false, error: "لا يوجد نموذج تفصيلي لهذه الفرصة لتوليد تقرير منه." };
  }

  const sections = buildReport(answers, mode);
  const meta: ReportMeta = {
    title: opp.title,
    ref: opp.id.slice(-8).toUpperCase(),
    sector: opp.sector,
    country: opp.country,
    ownerName: mode === "full" ? opp.owner.fullName : undefined,
    generatedAt: "",
    mode,
  };
  const markdown = buildReportMarkdown(meta, sections);

  let result;
  try {
    result = await generateEvaluation(markdown, mode);
  } catch (e) {
    if (e instanceof MissingApiKeyError) {
      return {
        ok: false,
        error: "ميزة الذكاء الاصطناعي غير مُفعّلة: أضِف المتغيّر OPENAI_API_KEY في بيئة التشغيل.",
      };
    }
    return { ok: false, error: "تعذّر الاتصال بخدمة الذكاء الاصطناعي. حاول لاحقاً." };
  }

  const at = new Date().toISOString();
  // دمج النتيجة في sourceData.aiReport[mode] مع الحفاظ على بقية البيانات
  const existing =
    opp.sourceData && typeof opp.sourceData === "object"
      ? (opp.sourceData as Record<string, unknown>)
      : {};
  const prevReport =
    existing.aiReport && typeof existing.aiReport === "object"
      ? (existing.aiReport as Record<string, unknown>)
      : {};
  const newSource = {
    ...existing,
    aiReport: { ...prevReport, [mode]: { text: result.text, at, model: result.model } },
  } as Prisma.InputJsonValue;

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: { sourceData: newSource },
  });

  await logActivity({
    actorId: (await requireRole("ADMIN")).userId,
    action: "VERSION_SAVED",
    entityType: "Opportunity",
    entityId: opportunityId,
    details: { aiReport: mode },
  });

  revalidatePath(`/admin/opportunities/${opportunityId}`);
  return { ok: true, text: result.text, at };
}
