import { cn } from "@/lib/utils";

const variants = {
  default: "bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-200",
  draft: "bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200",
  signed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200",
  finalized: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-200",
  archived: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-200",
  destructive: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200",
} as const;

export function Badge({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: keyof typeof variants;
  children: React.ReactNode;
}) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", variants[variant], className)}>{children}</span>;
}
