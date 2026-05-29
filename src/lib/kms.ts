import { KMSClient } from "@aws-sdk/client-kms";

export const kms =
  process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? new KMSClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })
    : null;

export async function describeKmsAvailability() {
  return {
    configured: Boolean(kms && process.env.AWS_KMS_KEY_ID),
    keyId: process.env.AWS_KMS_KEY_ID ?? null,
  };
}
