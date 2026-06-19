// Webhook التوقيع الإلكتروني — يحدّث حالة العقد تلقائياً حسب أحداث المزوّد.
// محميّ بسرّ مشترك (ESIGN_WEBHOOK_SECRET) عبر ترويسة x-webhook-secret أو ?secret=.
import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AmbassadorContractStatus } from "@prisma/client";
import { getEsignAdapter, verifyWebhookSecret } from "@/lib/esign";
import { notifyAdmins } from "@/lib/notify";

export async function POST(req: NextRequest) {
  const provided =
    req.headers.get("x-webhook-secret") || new URL(req.url).searchParams.get("secret");
  if (!verifyWebhookSecret(provided)) return new Response("forbidden", { status: 403 });

  const raw = await req.text();
  const evt = getEsignAdapter().parseWebhook(raw);
  if (!evt) return new Response("ignored", { status: 200 });

  const contract = await prisma.ambassadorContract.findFirst({
    where: { externalSignatureId: evt.externalId },
    select: { id: true, applicationId: true },
  });
  if (!contract) return new Response("not found", { status: 404 });

  const status = evt.status as AmbassadorContractStatus;
  await prisma.ambassadorContract.update({
    where: { id: contract.id },
    data: {
      status,
      ...(evt.status === "OPENED" ? { openedAt: new Date() } : {}),
      ...(evt.status === "SIGNED" ? { signedAt: new Date() } : {}),
    },
  });

  if (evt.status === "SIGNED") {
    await prisma.ambassadorApplication.update({
      where: { id: contract.applicationId },
      data: { status: "CONTRACT_SIGNED" },
    });
    await notifyAdmins({
      type: "AMBASSADOR_CONTRACT_SIGNED",
      message: "تم توقيع عقد سفير إلكترونياً.",
      link: `/admin/ambassadors/${contract.applicationId}`,
    });
  }

  return new Response("ok", { status: 200 });
}
