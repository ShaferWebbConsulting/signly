import Link from "next/link";
import { Eye, PenSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContractStatusBadge } from "@/components/contracts/ContractStatusBadge";
import { formatDate } from "@/lib/utils";

type ContractListItem = {
  id: string;
  title: string;
  description: string | null;
  status: Parameters<typeof ContractStatusBadge>[0]["status"];
  createdAt: Date;
  participants: { id: string }[];
};

export function ContractList({ contracts }: { contracts: ContractListItem[] }) {
  return (
    <div className="grid gap-4">
      {contracts.map((contract) => (
        <Card key={contract.id}>
          <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{contract.title}</h3>
                <ContractStatusBadge status={contract.status} />
              </div>
              <p className="max-w-2xl text-sm text-slate-500 dark:text-zinc-500">{contract.description || "No description provided yet."}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-zinc-500">
                <span>Created {formatDate(contract.createdAt)}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{contract.participants.length} participants</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/contracts/${contract.id}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900">
                <Eye className="h-4 w-4" />
                View
              </Link>
              <Link href={`/contracts/${contract.id}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-zinc-100 dark:hover:bg-zinc-900">
                <PenSquare className="h-4 w-4" />
                Edit
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
      {contracts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-slate-500 dark:text-zinc-500">No contracts found for this filter yet.</CardContent>
        </Card>
      ) : null}
    </div>
  );
}
