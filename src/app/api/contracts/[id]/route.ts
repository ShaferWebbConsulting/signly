import { ContractStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestMetadata } from "@/lib/contract-workflow";

const updateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  content: z.any(),
  contentHtml: z.string(),
  variables: z.any().optional().nullable(),
});

async function getOwnedContract(id: string, userId: string) {
  return prisma.contract.findFirst({
    where: { id, ownerId: userId },
    include: {
      participants: { orderBy: { signingOrder: "asc" } },
      auditEvents: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const contract = await getOwnedContract(id, session.user.id);
  if (!contract) {
    return NextResponse.json({ error: "Contract not found." }, { status: 404 });
  }

  return NextResponse.json({ contract });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const { id } = await params;
    const contract = await prisma.contract.findFirst({ where: { id, ownerId: session.user.id } });
    if (!contract) {
      return NextResponse.json({ error: "Contract not found." }, { status: 404 });
    }
    if (contract.status !== ContractStatus.DRAFT) {
      return NextResponse.json({ error: "Only draft contracts can be edited." }, { status: 409 });
    }

    const metadata = getRequestMetadata(request);
    const updated = await prisma.contract.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        contentHtml: body.contentHtml,
        variables: body.variables,
        auditEvents: {
          create: {
            userId: session.user.id,
            eventType: "contract_updated",
            ipAddress: metadata.ipAddress,
            userAgent: metadata.userAgent,
          },
        },
      },
    });

    return NextResponse.json({ contract: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid contract payload." }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update contract." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const contract = await prisma.contract.findFirst({ where: { id, ownerId: session.user.id } });
  if (!contract) {
    return NextResponse.json({ error: "Contract not found." }, { status: 404 });
  }
  if (contract.status !== ContractStatus.DRAFT) {
    return NextResponse.json({ error: "Only draft contracts can be deleted." }, { status: 409 });
  }

  const metadata = getRequestMetadata(request);
  await prisma.$transaction([
    prisma.auditEvent.create({
      data: {
        contractId: contract.id,
        userId: session.user.id,
        eventType: "contract_deleted",
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    }),
    prisma.contract.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
