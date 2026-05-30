import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  size?: "sm" | "default" | "lg" | "icon";
};

const variantClasses = {
  default: "bg-blue-600 text-white hover:bg-blue-500",
  destructive: "bg-rose-500 text-white hover:bg-rose-400",
  outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900",
  ghost: "text-slate-700 hover:bg-slate-100 dark:text-zinc-100 dark:hover:bg-zinc-900",
  link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
} as const;

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  default: "h-10 px-4 py-2",
  lg: "h-11 px-6 text-base",
  icon: "h-10 w-10",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
