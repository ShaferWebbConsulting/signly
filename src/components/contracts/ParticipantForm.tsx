"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { type SignerRole, type SignerStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Participant = {
  id: string;
  name: string;
  email: string;
  role: SignerRole;
  signingOrder: number;
  status: SignerStatus;
};

export function ParticipantForm({ contractId, participants }: { contractId: string; participants: Participant[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", role: "SIGNER" as SignerRole, signingOrder: participants.length + 1 });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/participants/${contractId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Failed to add participant");

      toast.success("Participant added");
      setForm({ name: "", email: "", role: "SIGNER", signingOrder: participants.length + 2 });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save participant");
    } finally {
      setSaving(false);
    }
  };

  const removeParticipant = async (participantId: string) => {
    try {
      const response = await fetch(`/api/participants/${contractId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Failed to remove participant");
      toast.success("Participant removed");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove participant");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-slate-200 p-4 dark:border-zinc-800 lg:grid-cols-4">
        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Jordan Lee" />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="jordan@example.com" />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as SignerRole }))}>
            <option value="SIGNER">Signer</option>
            <option value="OWNER">Owner</option>
          </Select>
        </div>
        <div>
          <Label>Order</Label>
          <Input type="number" min={1} value={form.signingOrder} onChange={(event) => setForm((current) => ({ ...current, signingOrder: Number(event.target.value) || 1 }))} />
        </div>
      </div>
      <Button onClick={submit} disabled={saving}>{saving ? "Saving..." : "Add participant"}</Button>
      <div className="space-y-3">
        {participants.map((participant) => (
          <div key={participant.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 text-sm dark:border-zinc-800 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-medium text-slate-950 dark:text-white">{participant.name}</p>
              <p className="text-slate-500 dark:text-zinc-400">{participant.email}</p>
            </div>
            <div className="flex items-center gap-3 text-slate-500 dark:text-zinc-400">
              <span>{participant.role}</span>
              <span>Order {participant.signingOrder}</span>
              <span>{participant.status}</span>
              <Button variant="ghost" size="sm" onClick={() => removeParticipant(participant.id)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
