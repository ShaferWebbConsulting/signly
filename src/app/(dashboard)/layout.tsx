import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black lg:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col bg-slate-50 dark:bg-black">
        <Header user={session.user} />
        <main className="flex-1 bg-slate-50 px-4 py-6 dark:bg-black lg:px-8">{children}</main>
      </div>
    </div>
  );
}
