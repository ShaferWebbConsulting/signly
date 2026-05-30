"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        <Toaster position="top-right" toastOptions={{ className: "!border !border-slate-200 !bg-white !text-slate-950 dark:!border-zinc-800 dark:!bg-zinc-900 dark:!text-white" }} />
      </ThemeProvider>
    </SessionProvider>
  );
}
