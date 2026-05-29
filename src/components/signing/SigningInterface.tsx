"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SignaturePad } from "@/components/signing/SignaturePad";
import { TypedSignature } from "@/components/signing/TypedSignature";

export function SigningInterface({ token }: { token: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"TYPED" | "DRAWN">("TYPED");
  const [typedName, setTypedName] = useState("");
  const [drawnSignature, setDrawnSignature] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const data = mode === "TYPED" ? typedName : drawnSignature;
    if (!data) {
      toast.error("Please provide a signature before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/sign/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: mode, data }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to sign contract");
      toast.success("Signature submitted successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-3">
          <Button variant={mode === "TYPED" ? "default" : "outline"} size="sm" onClick={() => setMode("TYPED")}>Typed</Button>
          <Button variant={mode === "DRAWN" ? "default" : "outline"} size="sm" onClick={() => setMode("DRAWN")}>Drawn</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "TYPED" ? <TypedSignature value={typedName} onChange={setTypedName} /> : <SignaturePad onChange={setDrawnSignature} />}
        <Button onClick={submit} disabled={loading}>{loading ? "Submitting..." : "Submit signature"}</Button>
      </CardContent>
    </Card>
  );
}
