import { createHash } from "node:crypto";

export function generateSha256Hash(input: string) {
  return createHash("sha256").update(input).digest("hex");
}
