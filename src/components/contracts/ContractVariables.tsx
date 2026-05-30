"use client";

import { Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ContractVariable } from "@/types/contracts";

export function ContractVariables({
  value,
  onChange,
}: {
  value: ContractVariable[];
  onChange: (variables: ContractVariable[]) => void;
}) {
  const updateVariable = (id: string, patch: Partial<ContractVariable>) => {
    onChange(value.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Dynamic variables</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Add reusable placeholders like client_name or effective_date.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onChange([...value, { id: nanoid(), key: "", value: "" }])}>Add variable</Button>
      </div>
      <div className="grid gap-3">
        {value.map((variable) => (
          <div key={variable.id} className="grid gap-3 rounded-2xl border border-slate-200 p-4 dark:border-zinc-800 lg:grid-cols-[1fr_1fr_auto]">
            <div>
              <Label htmlFor={`${variable.id}-key`}>Key</Label>
              <Input id={`${variable.id}-key`} value={variable.key} onChange={(event) => updateVariable(variable.id, { key: event.target.value })} placeholder="client_name" />
            </div>
            <div>
              <Label htmlFor={`${variable.id}-value`}>Default value</Label>
              <Input id={`${variable.id}-value`} value={variable.value} onChange={(event) => updateVariable(variable.id, { value: event.target.value })} placeholder="Acme Inc." />
            </div>
            <div className="flex items-end">
              <Button variant="ghost" size="icon" onClick={() => onChange(value.filter((item) => item.id !== variable.id))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
