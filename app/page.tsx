import { LandingFeatures } from "@/shared/components/landing/landing-features";
import { LandingHero } from "@/shared/components/landing/landing-hero";
import { LandingNavbar } from "@/shared/components/landing/landing-navbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-1000 bg-ds-canvas text-ds-text-primary font-sans selection:bg-[--ds-selection]">
      <LandingNavbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative">
        {/* Decorative Gradients */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-[--ds-gradient-hero] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-radial-gradient from-[--ds-brand-subtle] to-transparent rounded-full blur-3xl pointer-events-none" />

        <LandingHero />
        <LandingFeatures />
      </main>

      <footer className="py-8 text-center border-t border-white/5 bg-zinc-950/50 backdrop-blur-md">
        <p className="text-xs text-zinc-600">Vault for everyone.</p>
      </footer>
    </div>
  );
}
