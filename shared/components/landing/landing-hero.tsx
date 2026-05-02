"use client";

import { ArrowRight, Github, LockKeyhole, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative min-h-[calc(100svh-88px)] overflow-hidden px-6 pt-10 pb-20 md:px-10 md:pt-16">
      <Image
        src="/images/devault-hero.png"
        alt=""
        width={1672}
        height={941}
        priority
        className="absolute inset-0 h-full w-full object-cover object-[62%_50%] opacity-70"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#09090b_0%,rgba(9,9,11,0.92)_30%,rgba(9,9,11,0.58)_62%,rgba(9,9,11,0.26)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ds-canvas to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-220px)] w-full max-w-7xl items-center">
        <div className="max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="size-3.5" />
            Early access for curated communities
          </div>

          <h1 className="mt-8 max-w-2xl text-5xl font-semibold tracking-normal text-white md:text-7xl">
            Shared bookmark vaults for people with taste.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-300 md:text-lg">
            Devault turns links into a living library: organize resources by space, gate access with
            passwords or Discord, and give your community one reliable place to find the good stuff
            again.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-7">
              <Link href="/sign-up">
                Start a vault
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-white/15 bg-white/5 px-7 text-zinc-100 hover:bg-white/10"
            >
              <Link href="https://github.com/dopaminesystem/devault-app" target="_blank">
                <Github className="size-5" />
                View source
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {["Public or private spaces", "Discord-gated vaults", "Rich link previews"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-zinc-300 backdrop-blur-md"
                >
                  <LockKeyhole className="size-4 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
