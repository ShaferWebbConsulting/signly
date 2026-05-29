import { type ContractStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { getContractStatusLabel } from "@/lib/contract-status";

const variantMap: Record<ContractStatus, Parameters<typeof Badge>[0]["variant"]> = {
  DRAFT: "draft",
  SENT: "sent",
  VIEWED: "sent",
  SIGNED: "signed",
  FINALIZED: "finalized",
  ARCHIVED: "archived",
};

export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  return <Badge variant={variantMap[status]}>{getContractStatusLabel(status)}</Badge>;
}
