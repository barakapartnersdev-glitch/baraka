// منطق الإشعارات داخل المنصة — إنشاء وقراءة ووضع علامة مقروء.
// يرسل أيضاً بريداً للمستلم إذا ضُبطت إعدادات البريد (وإلا فإشعار داخلي فقط).
// ملاحظة: الإشعارات وظيفة ثانوية — فشلها (مثلاً قبل تشغيل الـ migration) لا يكسر
// الإجراء الأساسي الذي استدعاها (التسجيل/الاهتمام...)، بل يُسجَّل في السجل فقط.
import "server-only";
import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@prisma/client";
import { emailConfigured, sendEmail, notificationEmailHtml } from "@/lib/email";

// عنوان البريد حسب نوع الإشعار
const SUBJECTS: Record<NotificationType, string> = {
  NEW_REGISTRATION: "تسجيل جديد على المنصة",
  ACCOUNT_APPROVED: "تم اعتماد حسابك",
  ACCOUNT_SUSPENDED: "تحديث حالة حسابك",
  INTEREST_REQUESTED: "طلب اهتمام جديد",
  INTEREST_APPROVED: "تم اعتماد طلب اهتمامك",
  INTEREST_DECLINED: "تحديث طلب اهتمامك",
  NCNDA_SIGNED: "توقيع اتفاقية NCNDA",
  MISSING_INFO_REQUESTED: "طلب استكمال نواقص",
  OPPORTUNITY_PUBLISHED: "تم نشر فرصتك",
  OPPORTUNITY_STATE_CHANGED: "تحديث حالة فرصتك",
  NEW_CRM_LEAD: "طلب/رسالة جديدة من الموقع",
  CRM_LEAD_ASSIGNED: "تم إسناد طلب إليك",
  AMBASSADOR_APPLICATION_RECEIVED: "طلب انضمام سفير استثمار جديد",
  AMBASSADOR_STATUS_CHANGED: "تحديث حالة طلب الانضمام كسفير",
  AMBASSADOR_CONTRACT_SENT: "عقد سفير الاستثمار جاهز للتوقيع",
  AMBASSADOR_CONTRACT_SIGNED: "تم توقيع عقد سفير الاستثمار",
  AMBASSADOR_ACCOUNT_CREATED: "تم فتح حساب سفير الاستثمار",
  AMBASSADOR_NEW_MESSAGE: "رسالة داخلية جديدة",
  AMBASSADOR_NEW_REFERRAL: "ترشيح مستثمر جديد من سفير",
  AMBASSADOR_REFERRAL_STATUS_CHANGED: "تحديث حالة ترشيح مستثمر",
};

// إشعار مستخدم واحد (+ بريد إن كان مُفعّلاً). أفضل جهد: لا يرمي للأعلى.
export async function notify(params: {
  userId: string;
  type: NotificationType;
  message: string;
  link?: string;
}): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        message: params.message,
        link: params.link ?? null,
      },
    });

    if (emailConfigured()) {
      const u = await prisma.user.findUnique({
        where: { id: params.userId },
        select: { email: true, fullName: true },
      });
      if (u) {
        await sendEmail({
          to: u.email,
          subject: SUBJECTS[params.type],
          html: notificationEmailHtml({
            fullName: u.fullName,
            message: params.message,
            link: params.link,
          }),
        });
      }
    }
  } catch (e) {
    console.error("[notify] تعذّر إنشاء الإشعار (هل شُغّل prisma migrate؟):", e);
  }
}

// إشعار جميع الإداريين بحدث يهمّ الإدارة (+ بريد إن كان مُفعّلاً). أفضل جهد.
export async function notifyAdmins(params: {
  type: NotificationType;
  message: string;
  link?: string;
}): Promise<void> {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, email: true, fullName: true },
    });
    if (admins.length === 0) return;

    await prisma.notification.createMany({
      data: admins.map((a) => ({
        userId: a.id,
        type: params.type,
        message: params.message,
        link: params.link ?? null,
      })),
    });

    if (emailConfigured()) {
      for (const a of admins) {
        await sendEmail({
          to: a.email,
          subject: SUBJECTS[params.type],
          html: notificationEmailHtml({
            fullName: a.fullName,
            message: params.message,
            link: params.link,
          }),
        });
      }
    }
  } catch (e) {
    console.error("[notifyAdmins] تعذّر إنشاء الإشعارات (هل شُغّل prisma migrate؟):", e);
  }
}

export async function markAllRead(userId: string): Promise<void> {
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  } catch (e) {
    console.error("[markAllRead] تعذّر التحديث:", e);
  }
}

export interface BellItem {
  id: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

// بيانات الجرس: عدد غير المقروء + أحدث 30 إشعاراً (التاريخ نصّاً للنقل للعميل).
// أفضل جهد: عند أي خطأ (مثلاً الجدول غير موجود قبل migration) يعيد قائمة فارغة
// كي لا تتعطّل تخطيطات البوّابات.
export async function getBellData(
  userId: string
): Promise<{ count: number; items: BellItem[] }> {
  try {
    const [count, rows] = await Promise.all([
      prisma.notification.count({ where: { userId, read: false } }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);
    return {
      count,
      items: rows.map((n) => ({
        id: n.id,
        message: n.message,
        link: n.link,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      })),
    };
  } catch (e) {
    console.error("[getBellData] تعذّر جلب الإشعارات (هل شُغّل prisma migrate؟):", e);
    return { count: 0, items: [] };
  }
}
