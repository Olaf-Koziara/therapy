import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-4xl font-bold mb-8">TherapyFlow</h1>
      <Link href="/dashboard">
        <Button>Przejdź do Aplikacji</Button>
      </Link>
    </div>
  );
}
