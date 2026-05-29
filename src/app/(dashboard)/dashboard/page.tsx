import Link from "next/link";
import { startOfMonth } from "date-fns";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContractStatusBadge } from "@/components/contracts/ContractStatusBadge";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const ownerId = session!.user.id;
  const monthStart = startOfMonth(new Date());

  const [totalContracts, pendingSignatures, finalizedThisMonth, recentContracts] = await Promise.all([
    prisma.contract.count({ where: { ownerId } }),
    prisma.contract.count({ where: { ownerId, status: { in: ["SENT", "VIEWED", "SIGNED"] } } }),
    prisma.contract.count({ where: { ownerId, finalizedAt: { gte: monthStart } } }),
    prisma.contract.findMany({ where: { ownerId }, orderBy: { updatedAt: "desc" }, take: 5, include: { participants: true } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total contracts", value: totalContracts },
          { label: "Pending signatures", value: pendingSignatures },
          { label: "Finalized this month", value: finalizedThisMonth },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader><p className="text-sm text-zinc-500">{item.label}</p></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-zinc-950 dark:text-white">{item.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button><Link href="/contracts/new">Create contract</Link></Button>
        <Button variant="outline"><Link href="/contracts">View all contracts</Link></Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Recent contracts</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell><Link href={`/contracts/${contract.id}`} className="font-medium text-zinc-950 dark:text-white">{contract.title}</Link></TableCell>
                    <TableCell><ContractStatusBadge status={contract.status} /></TableCell>
                    <TableCell>{contract.participants.length}</TableCell>
                    <TableCell>{formatDate(contract.updatedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
