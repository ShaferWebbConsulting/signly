"use client";

import Link from "next/link";
import { FileText, LayoutDashboard, PenLine, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contracts", label: "Contracts", icon: FileText },
  { href: "/contracts/new", label: "New contract", icon: PenLine },
  { href: "/contracts", label: "Recipients", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/70 lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 text-lg font-semibold text-slate-950 dark:text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white dark:bg-violet-600">S</span>
        Signly
      </Link>
      <nav className="grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-blue-50 text-blue-700 dark:bg-violet-950/40 dark:text-violet-400"
                  : "text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-900",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
