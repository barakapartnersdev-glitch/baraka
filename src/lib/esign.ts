// طبقة تجريد التوقيع الإلكتروني — تسمح بالتكامل لاحقاً مع DocuSign/Dropbox Sign/PandaDoc...
// المزوّد الافتراضي "manual" (بلا اتصال خارجي): يولّد مرجعاً داخلياً ويُكمَل التوقيع برفع يدوي.
// لتفعيل مزوّد حقيقي: اضبط ESIGN_PROVIDER + ESIGN_API_KEY ونفّذ send()/parseWebhook() للمزوّد.
import "server-only";

export type EsignProvider = "manual" | "docusign" | "dropbox_sign" | "pandadoc" | "zoho_sign" | "adobe_sign";

const PROVIDERS: EsignProvider[] = ["manual", "docusign", "dropbox_sign", "pandadoc", "zoho_sign", "adobe_sign"];

export interface EsignSendRequest {
  contractId: string;
  signerName: string;
  signerEmail: string;
  documentName?: string;
  documentBase64?: string; // المستند (PDF) المراد إرساله للتوقيع — مطلوب لمزوّد فعلي مثل Zoho
  fileName?: string;
}
export interface EsignSendResult {
  ok: boolean;
  externalId?: string;
  signingUrl?: string;
  error?: string;
}
export type EsignEventStatus = "SENT" | "OPENED" | "SIGNED" | "REJECTED" | "EXPIRED";
export interface EsignWebhookEvent {
  externalId: string;
  status: EsignEventStatus;
}

export interface EsignAdapter {
  readonly provider: EsignProvider;
  send(req: EsignSendRequest): Promise<EsignSendResult>;
  parseWebhook(rawBody: string): EsignWebhookEvent | null;
}

export function getEsignProvider(): EsignProvider {
  const p = (process.env.ESIGN_PROVIDER || "manual").toLowerCase();
  return (PROVIDERS as string[]).includes(p) ? (p as EsignProvider) : "manual";
}

export function esignConfigured(): boolean {
  const p = getEsignProvider();
  if (p === "manual") return false;
  if (p === "zoho_sign") return zohoEnvReady();
  return !!process.env.ESIGN_API_KEY;
}

// المزوّد اليدوي الافتراضي
const manualAdapter: EsignAdapter = {
  provider: "manual",
  async send(req) {
    return { ok: true, externalId: `manual:${req.contractId}` };
  },
  parseWebhook() {
    return null;
  },
};

// هيكل جاهز لمزوّد حقيقي — نفّذ نداء API الفعلي عند توفّر المفاتيح.
// parseWebhook يقبل حمولة JSON عامة { externalId, status } كنقطة بداية موحّدة.
function providerAdapterStub(provider: EsignProvider): EsignAdapter {
  return {
    provider,
    async send() {
      return { ok: false, error: `e-sign provider "${provider}" غير مُنفَّذ بعد` };
    },
    parseWebhook(rawBody) {
      try {
        const d = JSON.parse(rawBody) as { externalId?: unknown; status?: unknown };
        const valid: EsignEventStatus[] = ["SENT", "OPENED", "SIGNED", "REJECTED", "EXPIRED"];
        if (d && typeof d.externalId === "string" && valid.includes(d.status as EsignEventStatus)) {
          return { externalId: d.externalId, status: d.status as EsignEventStatus };
        }
      } catch {
        // تجاهل الحمولات غير الصالحة
      }
      return null;
    },
  };
}

// ===== Zoho Sign (مزوّد فعلي) =====
// OAuth: نُجدّد access token قصير العمر من refresh token الدائم، ونخزّنه مؤقتاً في الذاكرة.
let zohoToken: { accessToken: string; expiresAt: number } | null = null;

function zohoEnvReady(): boolean {
  return Boolean(
    process.env.ZOHO_REFRESH_TOKEN &&
      process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET
  );
}

async function zohoAccessToken(): Promise<string> {
  const now = Date.now();
  if (zohoToken && zohoToken.expiresAt > now + 60_000) return zohoToken.accessToken;
  const accounts = process.env.ZOHO_ACCOUNTS_URL || "https://accounts.zoho.com";
  const res = await fetch(`${accounts}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.ZOHO_REFRESH_TOKEN as string,
      client_id: process.env.ZOHO_CLIENT_ID as string,
      client_secret: process.env.ZOHO_CLIENT_SECRET as string,
    }),
  });
  const d = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!d.access_token) throw new Error("Zoho: تعذّر تجديد رمز الوصول (تحقّق من ZOHO_REFRESH_TOKEN).");
  zohoToken = { accessToken: d.access_token, expiresAt: now + (d.expires_in ?? 3600) * 1000 };
  return zohoToken.accessToken;
}

// تحويل حالة Zoho Sign إلى حالتنا الموحّدة
const ZOHO_STATUS_MAP: Record<string, EsignEventStatus> = {
  inprogress: "SENT",
  viewed: "OPENED",
  completed: "SIGNED",
  signed: "SIGNED",
  declined: "REJECTED",
  recalled: "REJECTED",
  expired: "EXPIRED",
};

const zohoAdapter: EsignAdapter = {
  provider: "zoho_sign",
  async send(req) {
    if (!req.documentBase64 || !req.fileName) {
      return { ok: false, error: "Zoho Sign: مطلوب مستند PDF (documentBase64 + fileName) لإرسال طلب التوقيع." };
    }
    try {
      const token = await zohoAccessToken();
      const api = process.env.ZOHO_SIGN_API || "https://sign.zoho.com";
      // 1) إنشاء طلب توقيع (مسوّدة) مع رفع المستند
      const fd = new FormData();
      fd.set(
        "file",
        new Blob([Buffer.from(req.documentBase64, "base64")], { type: "application/pdf" }),
        req.fileName
      );
      fd.set(
        "data",
        JSON.stringify({
          requests: {
            request_name: req.documentName || `Contract ${req.contractId}`,
            actions: [
              {
                recipient_name: req.signerName,
                recipient_email: req.signerEmail,
                action_type: "SIGN",
                signing_order: 0,
                verify_recipient: false,
              },
            ],
          },
        })
      );
      const createRes = await fetch(`${api}/api/v1/requests`, {
        method: "POST",
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
        body: fd,
      });
      const created = (await createRes.json()) as { requests?: { request_id?: string }; message?: string };
      const requestId = created?.requests?.request_id;
      if (!requestId) {
        return { ok: false, error: `Zoho Sign: فشل إنشاء الطلب (${created?.message || createRes.status}).` };
      }
      // 2) تقديم الطلب لإرساله إلى الموقّع
      const submitRes = await fetch(`${api}/api/v1/requests/${requestId}/submit`, {
        method: "POST",
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      });
      const submitted = (await submitRes.json()) as { status?: string; message?: string };
      if (submitted?.status !== "success") {
        return { ok: false, error: `Zoho Sign: فشل التقديم (${submitted?.message || submitRes.status}).` };
      }
      return { ok: true, externalId: requestId };
    } catch (e) {
      return { ok: false, error: `Zoho Sign: ${(e as Error).message}` };
    }
  },
  parseWebhook(rawBody) {
    try {
      const d = JSON.parse(rawBody) as { requests?: { request_id?: unknown; request_status?: unknown } };
      const id = d?.requests?.request_id;
      const st = d?.requests?.request_status;
      if (typeof id !== "string" || typeof st !== "string") return null;
      const status = ZOHO_STATUS_MAP[st.toLowerCase()];
      return status ? { externalId: id, status } : null;
    } catch {
      return null;
    }
  },
};

export function getEsignAdapter(): EsignAdapter {
  const p = getEsignProvider();
  if (p === "manual") return manualAdapter;
  if (p === "zoho_sign") return zohoAdapter;
  return providerAdapterStub(p);
}

// تحقّق من سرّ الـ webhook المشترك (الحدّ الأدنى للحماية؛ المزوّد الحقيقي يضيف توقيع الحمولة)
export function verifyWebhookSecret(provided: string | null): boolean {
  const secret = process.env.ESIGN_WEBHOOK_SECRET;
  return !!secret && provided === secret;
}
