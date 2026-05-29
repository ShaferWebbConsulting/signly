import { ContractStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestMetadata } from "@/lib/contract-workflow";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const contract = await prisma.contract.findFirst({ where: { id, ownerId: session.user.id } });
  if (!contract) {
    return NextResponse.json({ error: "Contract not found." }, { status: 404 });
  }
  if (contract.status === ContractStatus.ARCHIVED) {
    return NextResponse.json({ error: "Contract is already archived." }, { status: 409 });
  }

  const metadata = getRequestMetadata(request);
  const updated = await prisma.contract.update({
    where: { id },
    data: {
      status: ContractStatus.ARCHIVED,
      auditEvents: {
        create: {
          userId: session.user.id,
          eventType: "contract_archived",
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      },
    },
  });

  return NextResponse.json({ contract: updated });
}
