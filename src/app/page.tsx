import Link from "next/link";
import { ArrowRight, FileCheck2, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { PricingCard } from "@/components/billing/PricingCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: FileCheck2, title: "Rich contract drafting", description: "Build polished agreements with variables, reusable clauses, and collaborative review flows." },
  { icon: Workflow, title: "Signature orchestration", description: "Route contracts to the right people in the right order and keep everyone aligned in real time." },
  { icon: ShieldCheck, title: "Audit-ready verification", description: "Capture signatures, metadata, snapshots, and tamper-evident hashes for every finalized contract." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-indigo-950/40 text-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-24 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
            <Sparkles className="h-4 w-4 text-indigo-400" /> Contract operations for modern teams
          </span>
          <div className="space-y-6">
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Create, Sign &amp; Manage Contracts Online</h1>
            <p className="max-w-xl text-lg text-zinc-300">Signly helps legal, sales, and operations teams draft faster, collect signatures securely, and verify every finalized agreement with a complete audit trail.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="lg"><Link href="/register" className="inline-flex items-center gap-2">Start free<ArrowRight className="h-4 w-4" /></Link></Button>
            <Button variant="outline" size="lg"><Link href="/login">Sign in</Link></Button>
          </div>
        </div>
        <Card className="w-full max-w-xl border-white/10 bg-white/5 text-white shadow-2xl shadow-indigo-500/10">
          <CardContent className="grid gap-6 pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-zinc-400">Average contract turnaround</p>
              <p className="mt-2 text-4xl font-semibold">48% faster</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5">
                <p className="text-sm text-zinc-400">Active workspaces</p>
                <p className="mt-2 text-2xl font-semibold">1,200+</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5">
                <p className="text-sm text-zinc-400">Contracts finalized</p>
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
            <Card key={feature.title} className="border-white/10 bg-white/5 text-white">
              <CardContent className="space-y-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300"><Icon className="h-6 w-6" /></div>
                <h2 className="text-xl font-semibold">{feature.title}</h2>
                <p className="text-zinc-300">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold">Simple pricing that scales with your team</h2>
          <p className="mt-3 text-zinc-300">Start with secure e-signatures, then unlock deeper automation, audit trails, and enterprise controls as you grow.</p>
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
