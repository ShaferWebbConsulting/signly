import { ContractStatus, SignerRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildParticipantToken, getRequestMetadata } from "@/lib/contract-workflow";

const participantSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.nativeEnum(SignerRole),
  signingOrder: z.coerce.number().int().min(1),
});

const participantUpdateSchema = participantSchema.extend({ participantId: z.string().min(1) });
const participantDeleteSchema = z.object({ participantId: z.string().min(1) });

async function getOwnedContract(contractId: string, userId: string) {
  return prisma.contract.findFirst({ where: { id: contractId, ownerId: userId } });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const contract = await getOwnedContract(id, session.user.id);
  if (!contract) return NextResponse.json({ error: "Contract not found." }, { status: 404 });
  if (contract.status !== ContractStatus.DRAFT) return NextResponse.json({ error: "Only draft contracts can be edited." }, { status: 409 });

  try {
    const body = participantSchema.parse(await request.json());
    const metadata = getRequestMetadata(request);
    const participant = await prisma.contractParticipant.create({
      data: {
        contractId: id,
        name: body.name,
        email: body.email,
        role: body.role,
        signingOrder: body.signingOrder,
        token: buildParticipantToken(),
      },
    });

    await prisma.auditEvent.create({
      data: {
        contractId: id,
        participantId: participant.id,
        userId: session.user.id,
        eventType: "participant_added",
        metadata: { email: body.email },
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid participant payload." }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to add participant." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const contract = await getOwnedContract(id, session.user.id);
  if (!contract) return NextResponse.json({ error: "Contract not found." }, { status: 404 });

  try {
    const body = participantUpdateSchema.parse(await request.json());
    const participant = await prisma.contractParticipant.update({
      where: { id: body.participantId },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        signingOrder: body.signingOrder,
      },
    });
    return NextResponse.json({ participant });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid participant payload." }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update participant." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const contract = await getOwnedContract(id, session.user.id);
  if (!contract) return NextResponse.json({ error: "Contract not found." }, { status: 404 });

  try {
    const body = participantDeleteSchema.parse(await request.json());
    await prisma.contractParticipant.delete({ where: { id: body.participantId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid participant payload." }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to remove participant." }, { status: 500 });
  }
}
