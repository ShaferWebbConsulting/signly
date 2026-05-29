"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TypedSignature({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="typed-signature">Type your full legal name</Label>
      <Input id="typed-signature" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Alex Morgan" className="font-serif text-xl" />
    </div>
  );
}
