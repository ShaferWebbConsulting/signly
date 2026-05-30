import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SigningInterface } from "@/components/signing/SigningInterface";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function SigningPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const participant = await prisma.contractParticipant.findUnique({
    where: { token },
    include: { contract: true },
  });

  if (!participant) notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      <div className="mx-auto flex max-w-5xl justify-end px-6 pt-6">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Sign contract</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">You are signing as {participant.name} ({participant.email}).</p>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: participant.contract.contentHtml }} />
        </CardContent>
      </Card>
      <SigningInterface token={token} />
      </div>
    </div>
  );
}
