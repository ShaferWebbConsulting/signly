export interface VerificationResult {
  verified: boolean;
  reason?: string;
  computedHash?: string;
}

export interface VerificationService {
  verifyContract(payload: unknown, expectedHash: string): Promise<VerificationResult>;
}

export class StubVerificationService implements VerificationService {
  async verifyContract() {
    return {
      verified: false,
      reason: "Blockchain verification is not configured yet.",
    };
  }
}
