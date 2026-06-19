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
  return getEsignProvider() !== "manual" && !!process.env.ESIGN_API_KEY;
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

export function getEsignAdapter(): EsignAdapter {
  const p = getEsignProvider();
  return p === "manual" ? manualAdapter : providerAdapterStub(p);
}

// تحقّق من سرّ الـ webhook المشترك (الحدّ الأدنى للحماية؛ المزوّد الحقيقي يضيف توقيع الحمولة)
export function verifyWebhookSecret(provided: string | null): boolean {
  const secret = process.env.ESIGN_WEBHOOK_SECRET;
  return !!secret && provided === secret;
}
