import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-violet-400",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
