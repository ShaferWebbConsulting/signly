"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        <Toaster position="top-right" toastOptions={{ className: "!bg-zinc-900 !text-white dark:!bg-zinc-800" }} />
      </ThemeProvider>
    </SessionProvider>
  );
}
