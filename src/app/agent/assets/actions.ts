"use server";
// إجراء تقديم أصل/فرصة من بوّابة الوكيل — ينشئ AssetAgentSubmittedAsset + ملفات + إشعار الإدارة.
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notify";
import { getAgentAccount } from "@/lib/agent-account";
import { storeAgentUpload, validateAgentUpload } from "@/lib/agent-files";
import { ASSET_TYPES, ASSET_STATUSES, OFFER_TYPES, RELATIONSHIP_TYPES, YES_NO, type Taxon } from "@/lib/agent";
import { getLocale } from "@/lib/i18n-server";
import { tg } from "@/lib/agent-portal-i18n";

export interface AssetFormState {
  ok?: boolean;
  error?: string;
}

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
function norm(list: Taxon[], v: string): string | null {
  return list.some((t) => t.code === v) ? v : null;
}

export async function submitAsset(_prev: AssetFormState, formData: FormData): Promise<AssetFormState> {
  const session = await requireRole("ASSET_OWNER_AGENT");
  const locale = await getLocale();
  const account = await getAgentAccount(session.userId);
  if (!account || account.status !== "active") return { error: tg(locale, "common.actionFailed") };

  const title = s(formData, "title");
  if (title.length < 2) return { error: tg(locale, "assets.errTitle") };

  // تحقّق مسبق من الملفات
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  for (const f of files) {
    if (!validateAgentUpload(f).ok) return { error: tg(locale, "assets.filesHint") };
  }

  let assetId: string;
  try {
    const asset = await prisma.assetAgentSubmittedAsset.create({
      data: {
        agentUserId: session.userId,
        title,
        country: s(formData, "country") || null,
        city: s(formData, "city") || null,
        assetType: norm(ASSET_TYPES, s(formData, "assetType")),
        assetStatus: norm(ASSET_STATUSES, s(formData, "assetStatus")),
        offerType: norm(OFFER_TYPES, s(formData, "offerType")),
        shortDescription: s(formData, "shortDescription") || null,
        estimatedValue: s(formData, "estimatedValue") || null,
        requiredFinancing: s(formData, "requiredFinancing") || null,
        agentRelationshipToOwner: norm(RELATIONSHIP_TYPES, s(formData, "relationship")),
        hasOwnerPermission: norm(YES_NO, s(formData, "hasOwnerPermission")),
        hasOwnershipDocuments: norm(YES_NO, s(formData, "hasOwnershipDocuments")),
        canArrangeOwnerMeeting: norm(YES_NO, s(formData, "canArrangeOwnerMeeting")),
        additionalNotes: s(formData, "additionalNotes") || null,
        status: "NEW_SUBMISSION",
      },
      select: { id: true },
    });
    assetId = asset.id;
  } catch (e) {
    console.error("[agent-assets] تعذّر حفظ الأصل:", e);
    return { error: tg(locale, "common.actionFailed") };
  }

  for (const f of files) {
    try {
      await storeAgentUpload(f, {
        applicationId: account.applicationId,
        submittedAssetId: assetId,
        agentUserId: session.userId,
        category: "asset_doc",
      });
    } catch (e) {
      console.error("[agent-assets] تعذّر تخزين ملف:", e);
    }
  }

  await notifyAdmins({
    type: "ASSET_AGENT_NEW_ASSET",
    message: `أصل/فرصة جديدة من الوكيل ${session.fullName}: ${title}`,
    link: "/admin/asset-agents/assets",
  });

  return { ok: true };
}
