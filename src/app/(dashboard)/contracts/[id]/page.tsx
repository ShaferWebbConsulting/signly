import Link from "next/link";
import { notFound } from "next/navigation";
import { ContractActions } from "@/components/contracts/ContractActions";
import { ContractComposer } from "@/components/contracts/ContractComposer";
import { ContractStatusBadge } from "@/components/contracts/ContractStatusBadge";
import { ParticipantForm } from "@/components/contracts/ParticipantForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const contract = await prisma.contract.findFirst({
    where: { id, ownerId: session!.user.id },
    include: {
      participants: { orderBy: { signingOrder: "asc" } },
      auditEvents: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!contract) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">{contract.title}</h1>
            <ContractStatusBadge status={contract.status} />
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Last updated {formatDate(contract.updatedAt)}</p>
        </div>
        <ContractActions contractId={contract.id} status={contract.status} />
      </div>

      <ContractComposer
        readonly={contract.status !== "DRAFT"}
        contract={{
          id: contract.id,
          title: contract.title,
          description: contract.description,
          content: contract.content as never,
          contentHtml: contract.contentHtml,
          status: contract.status,
          variables: contract.variables,
        }}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Participants</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Manage signing roles and recipient routing.</p>
          </div>
          <Link href={`/contracts/${contract.id}/participants`} className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-violet-400 dark:hover:text-violet-300">Open full participant manager</Link>
        </CardHeader>
        <CardContent>
          <ParticipantForm contractId={contract.id} participants={contract.participants} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Audit trail</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {contract.auditEvents.map((event: (typeof contract.auditEvents)[number]) => (
            <div key={event.id} className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-zinc-800">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-slate-950 dark:text-white">{event.eventType}</span>
                <span className="text-slate-500 dark:text-zinc-400">{formatDate(event.createdAt)}</span>
              </div>
              <p className="mt-1 text-slate-500 dark:text-zinc-400">{event.ipAddress ?? "No IP captured"} · {event.userAgent ?? "No user agent captured"}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
