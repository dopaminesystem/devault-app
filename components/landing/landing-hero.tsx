"use client";

import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <div className="space-y-8 max-w-4xl relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        Early Access Soon
      </div>

      <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent pb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        Bookmarks at <br /> Zero Gravity.
      </h1>

      <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        The vault for everyone. Capture references, tools, and inspiration in a weightless,
        distraction-free environment.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
        <Link href="/sign-up">
          <Button size="lg" className="text-base h-12 px-8">
            Start Collecting <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="lg"
          className="h-12 px-8"
          onClick={() => window.open("https://github.com/dopaminesystem/devault-app", "_blank")}
        >
          <Github className="w-5 h-5" /> Star on GitHub
        </Button>
      </div>
    </div>
  );
}
