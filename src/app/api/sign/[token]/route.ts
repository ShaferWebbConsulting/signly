import { ContractStatus, SignerStatus, SignatureType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { finalizeContract, getRequestMetadata } from "@/lib/contract-workflow";
import { prisma } from "@/lib/prisma";

const signatureSchema = z.object({
  type: z.nativeEnum(SignatureType),
  data: z.string().min(2),
});

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const participant = await prisma.contractParticipant.findUnique({
    where: { token },
    include: { contract: true },
  });

  if (!participant) {
    return NextResponse.json({ error: "Signing link not found." }, { status: 404 });
  }

  const metadata = getRequestMetadata(request);
  if (participant.status === SignerStatus.PENDING) {
    await prisma.contractParticipant.update({
      where: { id: participant.id },
      data: {
        status: SignerStatus.VIEWED,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });

    await prisma.contract.updateMany({
      where: { id: participant.contractId, status: ContractStatus.SENT },
      data: { status: ContractStatus.VIEWED },
    });

    await prisma.auditEvent.create({
      data: {
        contractId: participant.contractId,
        participantId: participant.id,
        eventType: "contract_viewed",
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });
  }

  return NextResponse.json({ participant });
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const body = signatureSchema.parse(await request.json());
    const { token } = await params;
    const metadata = getRequestMetadata(request);
    const participant = await prisma.contractParticipant.findUnique({
      where: { token },
      include: { contract: { include: { participants: true } } },
    });

    if (!participant) {
      return NextResponse.json({ error: "Signing link not found." }, { status: 404 });
    }
    if (participant.status === SignerStatus.SIGNED) {
      return NextResponse.json({ error: "This contract has already been signed." }, { status: 409 });
    }

    await prisma.$transaction([
      prisma.signature.create({
        data: {
          contractId: participant.contractId,
          participantId: participant.id,
          type: body.type,
          data: body.data,
        },
      }),
      prisma.contractParticipant.update({
        where: { id: participant.id },
        data: {
          status: SignerStatus.SIGNED,
          signedAt: new Date(),
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      }),
      prisma.auditEvent.create({
        data: {
          contractId: participant.contractId,
          participantId: participant.id,
          eventType: "signature_submitted",
          metadata: { type: body.type },
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      }),
    ]);

    const allParticipants = await prisma.contractParticipant.findMany({ where: { contractId: participant.contractId } });
    const signers = allParticipants.filter((item) => item.role === "SIGNER");
    const allSigned = signers.length > 0 && signers.every((item) => item.status === SignerStatus.SIGNED);

    if (allSigned) {
      const contract = await finalizeContract({
        contractId: participant.contractId,
        participantId: participant.id,
        metadata,
      });
      return NextResponse.json({ success: true, contract });
    }

    await prisma.contract.updateMany({
      where: { id: participant.contractId, status: { in: [ContractStatus.SENT, ContractStatus.VIEWED] } },
      data: { status: ContractStatus.VIEWED },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid signature payload." }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to sign contract." }, { status: 500 });
  }
}
