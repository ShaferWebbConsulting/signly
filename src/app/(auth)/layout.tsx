import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 dark:bg-black">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
