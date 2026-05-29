import { ContractStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestMetadata } from "@/lib/contract-workflow";

const createContractSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  content: z.any().default({ type: "doc", content: [{ type: "paragraph" }] }),
  contentHtml: z.string().default("<p></p>"),
  variables: z.any().optional().nullable(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const contracts = await prisma.contract.findMany({
    where: {
      ownerId: session.user.id,
      ...(status && status !== "all" ? { status: status.toUpperCase() as ContractStatus } : {}),
    },
    include: { participants: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ contracts });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = createContractSchema.parse(await request.json());
    const metadata = getRequestMetadata(request);
    const contract = await prisma.contract.create({
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        contentHtml: body.contentHtml,
        variables: body.variables,
        status: ContractStatus.DRAFT,
        ownerId: session.user.id,
        auditEvents: {
          create: {
            userId: session.user.id,
            eventType: "contract_created",
            metadata: { title: body.title },
            ipAddress: metadata.ipAddress,
            userAgent: metadata.userAgent,
          },
        },
      },
    });

    return NextResponse.json({ contract }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid contract payload." }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create contract." }, { status: 500 });
  }
}
