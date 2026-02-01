import Link from "next/link";
import { Users, Calendar, Settings } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">TherapyFlow</h1>
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard/calendar" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800">
            <Calendar className="h-5 w-5" />
            <span>Kalendarz</span>
          </Link>
          <Link href="/dashboard/patients" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800">
            <Users className="h-5 w-5" />
            <span>Pacjenci</span>
          </Link>
           <Link href="/dashboard/settings" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800">
            <Settings className="h-5 w-5" />
            <span>Ustawienia</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-slate-50">
        {children}
      </main>
    </div>
  );
}
