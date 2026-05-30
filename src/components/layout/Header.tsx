"use client";

import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header({ user }: { user: { name?: string | null; email?: string | null; image?: string | null; stripePlan?: string } }) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    if (process.env.NODE_ENV === "development") {
      console.log("[Header] signOut triggered");
    }
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 bg-white/80 px-4 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 lg:px-8">
      <div>
        <p className="text-sm text-zinc-500">Welcome back</p>
        <h1 className="text-xl font-semibold text-zinc-950 dark:text-white">Manage every contract from one workspace.</h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {signingOut ? "Signing out..." : "Sign out"}
        </Button>
        <Dropdown
          trigger={
            <button className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
              <Avatar name={user.name} src={user.image} />
              <div className="text-left">
                <p className="text-sm font-medium text-zinc-950 dark:text-white">{user.name ?? user.email ?? "Signly user"}</p>
                <p className="text-xs text-zinc-500">{user.stripePlan ?? "FREE"} plan</p>
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </button>
          }
        >
          <div className="space-y-1 text-sm">
            <p className="px-3 py-2 text-zinc-500">{user.email}</p>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
