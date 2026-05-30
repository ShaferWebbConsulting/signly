"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className={cn("w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100")}> 
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description ? <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        {children}
      </div>
    </div>
  );
}
