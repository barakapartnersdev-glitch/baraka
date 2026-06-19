// مسار تنزيل محمي لعقود الوكالة — الإدارة + الوكيل صاحب العقد فقط.
// ?doc=signed (افتراضي) أو ?doc=contract لنسخة العقد غير الموقّعة.
import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getObjectBuffer } from "@/lib/storage";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return new Response("غير مصرّح", { status: 401 });

  const { id } = await params;
  const contract = await prisma.assetAgentContract.findUnique({
    where: { id },
    select: { contractPdfKey: true, signedPdfKey: true, application: { select: { userId: true } } },
  });
  if (!contract) return new Response("غير موجود", { status: 404 });

  let allowed = false;
  if (session.role === "ADMIN") allowed = true;
  else if (session.role === "ASSET_OWNER_AGENT") allowed = contract.application.userId === session.userId;
  if (!allowed) return new Response("ممنوع", { status: 403 });

  const doc = new URL(req.url).searchParams.get("doc");
  const key = doc === "contract" ? contract.contractPdfKey : contract.signedPdfKey;
  if (!key) return new Response("غير موجود", { status: 404 });

  const { buffer, contentType } = await getObjectBuffer(key);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent("agent-contract.pdf")}`,
      "Cache-Control": "private, no-store",
    },
  });
}
