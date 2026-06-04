// مساعد التدقيق — يسجّل كل إجراء إداري حسّاس في ActivityLog.
import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type AuditAction =
  | "OPP_STATE_CHANGE"
  | "VERSION_SAVED"
  | "MISSING_ITEM_ADDED"
  | "MISSING_ITEM_RESOLVED"
  | "INTEREST_APPROVED"
  | "INTEREST_DECLINED"
  | "NCNDA_RECORDED"
  | "OPP_CREATED"
  | "SOURCE_SAVED"
  | "OPP_SUBMITTED"
  | "INTEREST_REQUESTED"
  | "FILE_UPLOADED"
  | "FILE_APPROVED"
  | "FILE_VISIBILITY_CHANGED"
  | "FILE_DELETED"
  | "USER_REGISTERED"
  | "USER_APPROVED"
  | "USER_SUSPENDED"
  | "USER_REACTIVATED";

export async function logActivity(params: {
  actorId: string;
  action: AuditAction;
  entityType: "Opportunity" | "Interest" | "MissingItem" | "User";
  entityId: string;
  details?: Prisma.InputJsonValue;
}): Promise<void> {
  await prisma.activityLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: params.details,
    },
  });
}
