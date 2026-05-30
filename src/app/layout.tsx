import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: "Signly",
  description: "Create, sign, and manage contracts online.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased dark:bg-zinc-950 dark:text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
