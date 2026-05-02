import { LandingFeatures } from "@/shared/components/landing/landing-features";
import { LandingHero } from "@/shared/components/landing/landing-hero";
import { LandingNavbar } from "@/shared/components/landing/landing-navbar";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col animate-in fade-in duration-1000 bg-ds-canvas text-ds-text-primary selection:bg-[--ds-selection]">
      <LandingNavbar />

      <main className="relative flex-1 overflow-hidden">
        <LandingHero />
        <LandingFeatures />
      </main>

      <footer className="border-t border-white/5 bg-zinc-950 px-6 py-8 text-center">
        <p className="text-xs text-zinc-600">Devault. Community bookmarks, kept close.</p>
      </footer>
    </div>
  );
}
