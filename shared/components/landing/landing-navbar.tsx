"use client";

import { useSession } from "@/shared/auth/auth-client";
import { AuthButtons } from "./auth-buttons";
import { DashboardButton } from "./dashboard-button";

export function LandingNavbar() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-50">
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
          Devault
        </span>
      </div>
      <div className="flex items-center gap-6">
        {session?.user ? <DashboardButton /> : <AuthButtons />}
      </div>
    </header>
  );
}
