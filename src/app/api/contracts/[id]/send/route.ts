import { ContractStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildParticipantToken, getBaseUrl, getRequestMetadata } from "@/lib/contract-workflow";
import { logSigningInvitation } from "@/lib/notifications";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const contract = await prisma.contract.findFirst({
    where: { id, ownerId: session.user.id },
    include: { participants: { orderBy: { signingOrder: "asc" } } },
  });

  if (!contract) {
    return NextResponse.json({ error: "Contract not found." }, { status: 404 });
  }
  if (contract.status !== ContractStatus.DRAFT) {
    return NextResponse.json({ error: "Only draft contracts can be sent." }, { status: 409 });
  }
  if (contract.participants.length === 0) {
    return NextResponse.json({ error: "Add at least one participant before sending." }, { status: 400 });
  }

  const metadata = getRequestMetadata(request);
  const baseUrl = getBaseUrl(request);
  const updates = contract.participants.map((participant) => {
    const token = buildParticipantToken();
    logSigningInvitation({
      email: participant.email,
      link: `${baseUrl}/sign/${token}`,
      contractId: contract.id,
    });
    return prisma.contractParticipant.update({
      where: { id: participant.id },
      data: { token },
    });
  });

  await prisma.$transaction([
    ...updates,
    prisma.contract.update({ where: { id }, data: { status: ContractStatus.SENT } }),
    prisma.auditEvent.create({
      data: {
        contractId: id,
        userId: session.user.id,
        eventType: "contract_sent",
        metadata: { participantCount: contract.participants.length },
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    }),
    ...contract.participants.map((participant) =>
      prisma.auditEvent.create({
        data: {
          contractId: id,
          participantId: participant.id,
          userId: session.user.id,
          eventType: "participant_invited",
          metadata: { email: participant.email },
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      }),
    ),
  ]);

  return NextResponse.json({ success: true });
}
