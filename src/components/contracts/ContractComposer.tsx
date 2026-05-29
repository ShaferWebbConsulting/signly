"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { JSONContent } from "@tiptap/core";
import { type ContractStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContractEditor } from "@/components/contracts/ContractEditor";
import { ContractVariables } from "@/components/contracts/ContractVariables";
import { type ContractVariable } from "@/types/contracts";

function normalizeVariables(input: unknown): ContractVariable[] {
  if (!Array.isArray(input)) return [];
  return input.filter(Boolean).map((item, index) => {
    const value = item as Partial<ContractVariable>;
    return {
      id: value.id ?? `${index}`,
      key: value.key ?? "",
      value: value.value ?? "",
    };
  });
}

export function ContractComposer({
  contract,
  readonly = false,
}: {
  contract?: {
    id: string;
    title: string;
    description: string | null;
    content: JSONContent;
    contentHtml: string;
    status: ContractStatus;
    variables: unknown;
  };
  readonly?: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(contract?.title ?? "");
  const [description, setDescription] = useState(contract?.description ?? "");
  const [content, setContent] = useState<JSONContent>(contract?.content ?? { type: "doc", content: [{ type: "paragraph" }] });
  const [contentHtml, setContentHtml] = useState(contract?.contentHtml ?? "<p></p>");
  const [variables, setVariables] = useState<ContractVariable[]>(normalizeVariables(contract?.variables));
  const [saving, setSaving] = useState(false);

  const payload = useMemo(
    () => ({ title, description, content, contentHtml, variables }),
    [content, contentHtml, description, title, variables],
  );

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch(contract ? `/api/contracts/${contract.id}` : "/api/contracts", {
        method: contract ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to save contract");
      toast.success(contract ? "Contract updated" : "Draft created");
      router.push(contract ? `/contracts/${contract.id}` : `/contracts/${data.contract.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save contract");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">Contract details</h2>
          <p className="text-sm text-zinc-500">Build clear, reusable agreements and keep every approval in one secure workflow.</p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2"><Label htmlFor="contract-title">Title</Label><Input id="contract-title" value={title} disabled={readonly} onChange={(event) => setTitle(event.target.value)} placeholder="Master service agreement" /></div>
          <div className="space-y-2"><Label htmlFor="contract-description">Description</Label><Textarea id="contract-description" value={description} disabled={readonly} onChange={(event) => setDescription(event.target.value)} placeholder="Internal summary for your team" /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">Contract body</h2>
        </CardHeader>
        <CardContent>
          <ContractEditor editable={!readonly} content={content} onChange={(nextContent, html) => { setContent(nextContent); setContentHtml(html); }} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><h2 className="text-xl font-semibold text-zinc-950 dark:text-white">Variable library</h2></CardHeader>
        <CardContent>
          <ContractVariables value={variables} onChange={setVariables} />
        </CardContent>
      </Card>
      {!readonly ? <Button onClick={save} disabled={saving}>{saving ? "Saving..." : contract ? "Save changes" : "Save draft"}</Button> : null}
    </div>
  );
}
