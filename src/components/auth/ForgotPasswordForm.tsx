"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">Forgot password</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-500">Password reset emails are coming soon. We will still capture your request.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="forgot-email">Email</Label>
          <Input id="forgot-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
        </div>
        <Button className="w-full" onClick={() => toast.success(`Reset instructions will be available soon for ${email || "your email"}.`)}>Request reset</Button>
      </CardContent>
    </Card>
  );
}
