import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;

export const s3 =
  region && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? new S3Client({
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })
    : null;

export async function uploadContract(storageKey: string, body: string) {
  if (!s3 || !bucket) {
    return { storageKey, uploaded: false };
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: storageKey,
      Body: body,
      ContentType: "application/json",
    }),
  );

  return { storageKey, uploaded: true };
}

export async function getContractUrl(storageKey: string) {
  if (!s3 || !bucket) return null;

  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucket,
      Key: storageKey,
    }),
    { expiresIn: 3600 },
  );
}
