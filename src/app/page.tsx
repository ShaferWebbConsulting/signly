import Link from "next/link";
import { ArrowRight, FileCheck2, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { PricingCard } from "@/components/billing/PricingCard";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: FileCheck2, title: "Rich contract drafting", description: "Build polished agreements with variables, reusable clauses, and collaborative review flows." },
  { icon: Workflow, title: "Signature orchestration", description: "Route contracts to the right people in the right order and keep everyone aligned in real time." },
  { icon: ShieldCheck, title: "Audit-ready verification", description: "Capture signatures, metadata, snapshots, and tamper-evident hashes for every finalized contract." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-gradient-to-b dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950/40 dark:text-white">
      <div className="mx-auto flex max-w-6xl justify-end px-6 pt-6">
        <ThemeToggle />
      </div>
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-24 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-violet-400" /> Contract operations for modern teams
          </span>
          <div className="space-y-6">
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Create, Sign &amp; Manage Contracts Online</h1>
            <p className="max-w-xl text-lg text-slate-500 dark:text-zinc-300">Signly helps legal, sales, and operations teams draft faster, collect signatures securely, and verify every finalized agreement with a complete audit trail.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="lg"><Link href="/register" className="inline-flex items-center gap-2">Start free<ArrowRight className="h-4 w-4" /></Link></Button>
            <Button variant="outline" size="lg"><Link href="/login">Sign in</Link></Button>
          </div>
        </div>
        <Card className="w-full max-w-xl border-slate-200 bg-white text-slate-950 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-2xl dark:shadow-indigo-500/10">
          <CardContent className="grid gap-6 pt-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-zinc-400">Average contract turnaround</p>
              <p className="mt-2 text-4xl font-semibold">48% faster</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900/80">
                <p className="text-sm text-slate-500 dark:text-zinc-400">Active workspaces</p>
                <p className="mt-2 text-2xl font-semibold">1,200+</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900/80">
                <p className="text-sm text-slate-500 dark:text-zinc-400">Contracts finalized</p>
                <p className="mt-2 text-2xl font-semibold">85k+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="border-slate-200 bg-white text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <CardContent className="space-y-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-violet-500/15 dark:text-violet-300"><Icon className="h-6 w-6" /></div>
                <h2 className="text-xl font-semibold">{feature.title}</h2>
                <p className="text-slate-500 dark:text-zinc-300">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold">Simple pricing that scales with your team</h2>
          <p className="mt-3 text-slate-500 dark:text-zinc-300">Start with secure e-signatures, then unlock deeper automation, audit trails, and enterprise controls as you grow.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <PricingCard title="Free" price="$0" description="For getting your first templates live." cta="Get started" onClick="/register" features={["3 contracts per month", "Unlimited viewers", "Basic templates"]} />
          <PricingCard title="Pro" price="$29/mo" description="For growing teams sending contracts every week." cta="Choose Pro" onClick="/register" featured features={["Unlimited contracts", "Signing reminders", "Contract variables", "Audit trail"]} />
          <PricingCard title="Business" price="$99/mo" description="For multi-team workflows with governance needs." cta="Talk to sales" onClick="/register" features={["Advanced permissions", "Priority support", "Custom onboarding", "Future blockchain anchors"]} />
        </div>
      </section>
    </main>
  );
}
