import { generateSha256Hash } from "@/lib/hash";

export class ContractHashService {
  static createHash(payload: unknown) {
    return generateSha256Hash(JSON.stringify(payload));
  }
}
