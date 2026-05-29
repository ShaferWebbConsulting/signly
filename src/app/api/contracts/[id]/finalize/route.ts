import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { finalizeContract, getRequestMetadata } from "@/lib/contract-workflow";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const contract = await finalizeContract({
      contractId: id,
      userId: session.user.id,
      metadata: getRequestMetadata(request),
    });

    return NextResponse.json({ contract });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to finalize contract." }, { status: 400 });
  }
}
