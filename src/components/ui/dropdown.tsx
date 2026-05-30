"use client";

import { cn } from "@/lib/utils";

export function Dropdown({
  trigger,
  children,
  className,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer">{trigger}</summary>
      <div className={cn("absolute right-0 z-30 mt-2 min-w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950", className)}>
        {children}
      </div>
    </details>
  );
}
