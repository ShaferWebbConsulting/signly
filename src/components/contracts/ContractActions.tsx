"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { type ContractStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";

async function postAction(url: string) {
  const response = await fetch(url, { method: "POST" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? "Action failed");
  return payload;
}

export function ContractActions({ contractId, status }: { contractId: string; status: ContractStatus }) {
  const router = useRouter();

  const handleAction = async (path: string, successMessage: string) => {
    try {
      await postAction(path);
      toast.success(successMessage);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {status === "DRAFT" ? <Button onClick={() => handleAction(`/api/contracts/${contractId}/send`, "Contract sent")}>Send for signing</Button> : null}
      {(status === "SIGNED" || status === "VIEWED" || status === "SENT") ? (
        <Button variant="outline" onClick={() => handleAction(`/api/contracts/${contractId}/finalize`, "Contract finalized")}>Finalize</Button>
      ) : null}
      {status !== "ARCHIVED" ? (
        <Button variant="ghost" onClick={() => handleAction(`/api/contracts/${contractId}/archive`, "Contract archived")}>Archive</Button>
      ) : null}
    </div>
  );
}
