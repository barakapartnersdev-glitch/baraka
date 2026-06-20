// Webhook التوقيع الإلكتروني لعقود وكلاء أصحاب الأصول — يحدّث حالة العقد تلقائياً
// حسب أحداث المزوّد (Zoho Sign). محميّ بسرّ مشترك (ESIGN_WEBHOOK_SECRET) عبر
// ترويسة x-webhook-secret أو ?secret=. مرآة لمسار السفراء.
import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AssetAgentContractStatus } from "@prisma/client";
import { getEsignAdapter, verifyWebhookSecret } from "@/lib/esign";
import { notifyAdmins } from "@/lib/notify";

export async function POST(req: NextRequest) {
  const provided =
    req.headers.get("x-webhook-secret") || new URL(req.url).searchParams.get("secret");
  if (!verifyWebhookSecret(provided)) return new Response("forbidden", { status: 403 });

  const raw = await req.text();
  const evt = getEsignAdapter().parseWebhook(raw);
  if (!evt) return new Response("ignored", { status: 200 });

  const contract = await prisma.assetAgentContract.findFirst({
    where: { externalSignatureId: evt.externalId },
    select: { id: true, applicationId: true },
  });
  if (!contract) return new Response("not found", { status: 404 });

  await prisma.assetAgentContract.update({
    where: { id: contract.id },
    data: {
      status: evt.status as AssetAgentContractStatus,
      ...(evt.status === "OPENED" ? { openedAt: new Date() } : {}),
      ...(evt.status === "SIGNED" ? { signedAt: new Date() } : {}),
    },
  });

  if (evt.status === "SIGNED") {
    await prisma.assetAgentApplication.update({
      where: { id: contract.applicationId },
      data: { status: "CONTRACTED" },
    });
    await notifyAdmins({
      type: "ASSET_AGENT_CONTRACT_SIGNED",
      message: "تم توقيع عقد وكيل أصحاب الأصول إلكترونياً (Zoho Sign).",
      link: `/admin/asset-agents/${contract.applicationId}`,
    });
  }

  return new Response("ok", { status: 200 });
}
