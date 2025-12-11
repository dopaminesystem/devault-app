import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-1000 bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      <LandingNavbar />

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
