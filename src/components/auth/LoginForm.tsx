"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password.");
        return;
      }

      toast.success("Welcome back to Signly.");
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">Sign in</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">Continue managing contracts, approvals, and audit-ready signatures.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
        </div>
        <Button className="w-full" onClick={submit} disabled={isPending}>{isPending ? "Signing in..." : "Sign in"}</Button>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm text-slate-500 dark:text-zinc-400">
        <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 dark:text-violet-400 dark:hover:text-violet-300">Forgot your password?</Link>
        <p>
          Need an account? <Link href="/register" className="text-blue-600 hover:text-blue-700 dark:text-violet-400 dark:hover:text-violet-300">Create one</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
