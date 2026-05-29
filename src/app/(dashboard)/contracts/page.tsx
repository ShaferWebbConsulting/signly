import { ContractStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ContractList } from "@/components/contracts/ContractList";
import { Button } from "@/components/ui/button";

const tabs = ["all", "draft", "sent", "pending", "signed", "finalized", "archived"] as const;

export default async function ContractsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await auth();
  const { status = "all" } = await searchParams;
  const ownerId = session!.user.id;

  const whereStatus =
    status === "draft" ? { status: ContractStatus.DRAFT }
    : status === "sent" ? { status: ContractStatus.SENT }
    : status === "pending" ? { status: { in: [ContractStatus.SENT, ContractStatus.VIEWED] } }
    : status === "signed" ? { status: ContractStatus.SIGNED }
    : status === "finalized" ? { status: ContractStatus.FINALIZED }
    : status === "archived" ? { status: ContractStatus.ARCHIVED }
    : {};

  const contracts = await prisma.contract.findMany({
    where: { ownerId, ...whereStatus },
    orderBy: { updatedAt: "desc" },
    include: { participants: { select: { id: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button key={tab} variant={status === tab ? "default" : "outline"} size="sm">
            <a href={`/contracts?status=${tab}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</a>
          </Button>
        ))}
      </div>
      <ContractList contracts={contracts} />
    </div>
  );
}
