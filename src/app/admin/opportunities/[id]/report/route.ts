// تنزيل تقرير الفرصة (نسخة كاملة/مستثمر) بصيغ: HTML للطباعة/PDF، Word (.doc)، Markdown للذكاء الاصطناعي.
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  buildReport,
  buildReportHtml,
  buildReportMarkdown,
  extractAnswers,
  type ReportMode,
  type ReportMeta,
} from "@/lib/opportunity-report";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole("ADMIN");
  const { id } = await params;

  const opp = await prisma.opportunity.findUnique({
    where: { id },
    include: { owner: { select: { fullName: true } } },
  });
  if (!opp) return new NextResponse("Not found", { status: 404 });

  const url = new URL(req.url);
  const mode: ReportMode = url.searchParams.get("v") === "investor" ? "investor" : "full";
  const format = url.searchParams.get("format") ?? "html";

  const answers = extractAnswers(opp.sourceData);
  const sections = buildReport(answers, mode);

  const meta: ReportMeta = {
    title: opp.title,
    ref: opp.id.slice(-8).toUpperCase(),
    sector: opp.sector,
    country: opp.country,
    ownerName: mode === "full" ? opp.owner.fullName : undefined,
    generatedAt: new Date().toLocaleString("ar", { dateStyle: "long", timeStyle: "short" }),
    mode,
  };

  const base = `baraka-report-${meta.ref}-${mode}`;

  if (format === "md") {
    return new NextResponse(buildReportMarkdown(meta, sections), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${base}.md"`,
      },
    });
  }

  if (format === "doc") {
    return new NextResponse(buildReportHtml(meta, sections, true), {
      headers: {
        "Content-Type": "application/msword; charset=utf-8",
        "Content-Disposition": `attachment; filename="${base}.doc"`,
      },
    });
  }

  // HTML — يُعرض في المتصفح مع زر طباعة/حفظ PDF
  return new NextResponse(buildReportHtml(meta, sections, false), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
