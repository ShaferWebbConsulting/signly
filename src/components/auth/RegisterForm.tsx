"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to register");
      toast.success("Account created. You can sign in now.");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">Create account</h1>
        <p className="text-sm text-zinc-500">Set up your workspace and start sending contracts today.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></div>
        <div className="space-y-2"><Label htmlFor="register-email">Email</Label><Input id="register-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></div>
        <div className="space-y-2"><Label htmlFor="register-password">Password</Label><Input id="register-password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /></div>
        <Button className="w-full" onClick={submit} disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
      </CardContent>
      <CardFooter className="text-sm text-zinc-500">
        Already have an account? <Link href="/login" className="ml-1 text-indigo-500">Sign in</Link>
      </CardFooter>
    </Card>
  );
}
