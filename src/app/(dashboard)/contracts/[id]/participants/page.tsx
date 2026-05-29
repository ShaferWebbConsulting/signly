import { notFound } from "next/navigation";
import { ParticipantForm } from "@/components/contracts/ParticipantForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ContractParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const contract = await prisma.contract.findFirst({
    where: { id, ownerId: session!.user.id },
    include: { participants: { orderBy: { signingOrder: "asc" } } },
  });

  if (!contract) notFound();

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">Participants · {contract.title}</h1>
        <p className="text-sm text-zinc-500">Add, remove, and sequence everyone who needs to review or sign.</p>
      </CardHeader>
      <CardContent>
        <ParticipantForm contractId={contract.id} participants={contract.participants} />
      </CardContent>
    </Card>
  );
}
