// طبقة التخزين — تدعم S3 (AWS S3 / Cloudflare R2 / MinIO)، ومع غياب إعدادات S3
// تتحوّل تلقائياً إلى تخزين محلي على القرص (.local-storage) لتسهيل التطوير والتجربة.
// لا تُخدَم الملفات مباشرة؛ تُقرأ هنا ثم تمرّ عبر مسار محمي.
import "server-only";
import { promises as fs } from "fs";
import path from "path";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// تُستخدم S3 فقط إذا اكتملت إعداداتها؛ وإلا فالتخزين محلي.
function s3Configured(): boolean {
  return Boolean(
    process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_BUCKET
  );
}

// ===== التخزين المحلي (احتياطي للتطوير) =====
const LOCAL_DIR =
  process.env.LOCAL_STORAGE_DIR || path.join(process.cwd(), ".local-storage");

// يمنع اجتياز المسار خارج مجلد التخزين
function localPath(key: string): string {
  const safe = path.normalize(key).replace(/^(\.\.[/\\])+/, "");
  return path.join(LOCAL_DIR, safe);
}

const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".doc": "application/msword",
  ".xls": "application/vnd.ms-excel",
};

function contentTypeFromKey(key: string): string {
  return (
    MIME_BY_EXT[path.extname(key).toLowerCase()] || "application/octet-stream"
  );
}

// ===== عميل S3 (كسول — يُنشأ عند الحاجة فقط) =====
let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;
  const endpoint = process.env.S3_ENDPOINT || undefined;
  client = new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint,
    forcePathStyle: Boolean(endpoint), // مطلوب لمزوّدي غير AWS
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  });
  return client;
}

function bucket(): string {
  return process.env.S3_BUCKET as string;
}

export async function putObject(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  if (!s3Configured()) {
    const p = localPath(key);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, body);
    return;
  }
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

export async function getObjectBuffer(
  key: string
): Promise<{ buffer: Buffer; contentType: string }> {
  if (!s3Configured()) {
    const buffer = await fs.readFile(localPath(key));
    return { buffer, contentType: contentTypeFromKey(key) };
  }
  const res = await getClient().send(
    new GetObjectCommand({ Bucket: bucket(), Key: key })
  );
  const bytes = await res.Body!.transformToByteArray();
  return {
    buffer: Buffer.from(bytes),
    contentType: res.ContentType || "application/octet-stream",
  };
}

export async function deleteObject(key: string): Promise<void> {
  if (!s3Configured()) {
    await fs.rm(localPath(key), { force: true });
    return;
  }
  await getClient().send(
    new DeleteObjectCommand({ Bucket: bucket(), Key: key })
  );
}
