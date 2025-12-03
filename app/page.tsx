"use client"
import { ArrowRight, Sparkles, Github, Zap, Layers, Cpu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-1000 bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      <header className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Antigravity
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

        <div className="space-y-8 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.0 is now live
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent pb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Bookmarks at <br /> Zero Gravity.
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            The vault for design engineers. Capture references, tools, and inspiration in a weightless, distraction-free
            environment.
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
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <Github className="w-5 h-5" /> Star on GitHub
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 px-4 animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <Card>
              <CardHeader>
                <Zap className="w-6 h-6 text-yellow-400 mb-3 mx-auto md:mx-0" />
                <CardTitle className="text-sm font-semibold text-zinc-200 mb-1">Instant Search</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Client-side filtering for zero latency. Find anything in milliseconds.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Layers className="w-6 h-6 text-indigo-400 mb-3 mx-auto md:mx-0" />
                <CardTitle className="text-sm font-semibold text-zinc-200 mb-1">Design Engineering</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Built for the intersection of code and design. Syntax highlighting included.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Cpu className="w-6 h-6 text-emerald-400 mb-3 mx-auto md:mx-0" />
                <CardTitle className="text-sm font-semibold text-zinc-200 mb-1">AI-Ready Context</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Structured data ready for your LLM workflows via MCP.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center border-t border-white/5 bg-zinc-950/50 backdrop-blur-md">
        <p className="text-xs text-zinc-600">Designed & Engineered by Dhafin using Antigravity V2.</p>
      </footer>
    </div>
  )
}
