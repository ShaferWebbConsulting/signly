export interface BlockchainAnchorResult {
  network: string;
  transactionId: string;
  anchoredAt: string;
}

export interface BlockchainAnchorService {
  anchorHash(hash: string): Promise<BlockchainAnchorResult | null>;
}

export class StubBlockchainAnchorService implements BlockchainAnchorService {
  async anchorHash(hash: string) {
    return {
      network: "stub",
      transactionId: `pending-${hash.slice(0, 12)}`,
      anchoredAt: new Date().toISOString(),
    };
  }
}
