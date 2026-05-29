import { ContractStatus, SignerRole, SignerStatus } from "@prisma/client";
import { nanoid } from "nanoid";
import { uploadContract } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { ContractHashService } from "@/services/ContractHashService";

export function getRequestMetadata(request: Request) {
  return {
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent"),
  };
}

export function getBaseUrl(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export function buildParticipantToken() {
  return nanoid(32);
}

export async function finalizeContract({
  contractId,
  userId,
  participantId,
  metadata,
}: {
  contractId: string;
  userId?: string | null;
  participantId?: string | null;
  metadata?: { ipAddress?: string | null; userAgent?: string | null };
}) {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      participants: { orderBy: { signingOrder: "asc" } },
      signatures: true,
    },
  });

  if (!contract) {
    throw new Error("Contract not found.");
  }

  const requiredSigners = contract.participants.filter((participant) => participant.role === SignerRole.SIGNER);
  const allSigned = requiredSigners.length > 0 && requiredSigners.every((participant) => participant.status === SignerStatus.SIGNED);

  if (!allSigned) {
    throw new Error("All signers must complete signing before finalization.");
  }

  const snapshotPayload = {
    contract: {
      id: contract.id,
      title: contract.title,
      description: contract.description,
      content: contract.content,
      contentHtml: contract.contentHtml,
      variables: contract.variables,
    },
    participants: contract.participants,
    signatures: contract.signatures,
  };

  const hash = ContractHashService.createHash(snapshotPayload);
  const storageKey = `contracts/${contract.id}/${Date.now()}-${hash}.json`;
  let resolvedStorageKey = storageKey;

  try {
    const upload = await uploadContract(storageKey, JSON.stringify(snapshotPayload, null, 2));
    if (!upload.uploaded) {
      resolvedStorageKey = `local://${storageKey}`;
    }
  } catch {
    resolvedStorageKey = `local://${storageKey}`;
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.contract.update({
      where: { id: contract.id },
      data: {
        status: ContractStatus.FINALIZED,
        hash,
        finalizedAt: new Date(),
      },
    });

    await tx.contractSnapshot.create({
      data: {
        contractId: contract.id,
        storageKey: resolvedStorageKey,
        hash,
      },
    });

    await tx.auditEvent.create({
      data: {
        contractId: contract.id,
        participantId: participantId ?? null,
        userId: userId ?? null,
        eventType: "contract_finalized",
        metadata: { hash, storageKey: resolvedStorageKey },
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });

    return updated;
  });
}
