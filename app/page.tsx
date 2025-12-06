"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-1000 bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      <header className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-50">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Devault
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/sign-in" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Log In
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-zinc-100 backdrop-blur-md rounded-full h-9">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative">
        {/* Decorative Gradients */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-radial-gradient from-blue-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <LandingHero />
        <LandingFeatures />

      </main>

      <footer className="py-8 text-center border-t border-white/5 bg-zinc-950/50 backdrop-blur-md">
        <p className="text-xs text-zinc-600">Vault for everyone.</p>
      </footer>
    </div>
  )
}
