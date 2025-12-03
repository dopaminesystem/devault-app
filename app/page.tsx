"use client"
import { ArrowRight, Sparkles, Github, Zap, Shield, Tags, Globe, Share2, Code } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-1000 bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      <header className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-50">
        <div className="flex items-center gap-3">
          {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Sparkles className="text-white w-4 h-4" />
          </div> */}
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
            The vault for everyone. Capture references, tools, and inspiration in a weightless, distraction-free
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-20 px-4 animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <Card className="h-full bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-900/60 transition-all duration-300">
              <CardHeader className="items-center text-center">
                <Shield className="w-6 h-6 text-emerald-400 mb-3 mx-auto" />
                <CardTitle className="text-sm font-semibold text-zinc-200 mb-1">Secure</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Your data is encrypted at rest and in transit.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="h-full bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-900/60 transition-all duration-300">
              <CardHeader className="items-center text-center">
                <Tags className="w-6 h-6 text-blue-400 mb-3 mx-auto" />
                <CardTitle className="text-sm font-semibold text-zinc-200 mb-1">Smart Organization</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Tag, categorize, and filter your assets with flexible system.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="h-full bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-900/60 transition-all duration-300">
              <CardHeader className="items-center text-center">
                <Zap className="w-6 h-6 text-yellow-400 mb-3 mx-auto" />
                <CardTitle className="text-sm font-semibold text-zinc-200 mb-1">Lightning Fast</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Instant page loads and seamless interactions.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="h-full bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-900/60 transition-all duration-300">
              <CardHeader className="items-center text-center">
                <Globe className="w-6 h-6 text-indigo-400 mb-3 mx-auto" />
                <CardTitle className="text-sm font-semibold text-zinc-200 mb-1">Anywhere</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Access your bookmarks from any device, anytime.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="h-full bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-900/60 transition-all duration-300">
              <CardHeader className="items-center text-center">
                <Share2 className="w-6 h-6 text-pink-400 mb-3 mx-auto" />
                <CardTitle className="text-sm font-semibold text-zinc-200 mb-1">Selective Sharing</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Keep your personal items private, but share curated collections with the world via public links.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="h-full bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-900/60 transition-all duration-300">
              <CardHeader className="items-center text-center">
                <Code className="w-6 h-6 text-zinc-400 mb-3 mx-auto" />
                <CardTitle className="text-sm font-semibold text-zinc-200 mb-1">Developer First</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Open source and ready for you to extend.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center border-t border-white/5 bg-zinc-950/50 backdrop-blur-md">
        <p className="text-xs text-zinc-600">Vault for everyone.</p>
      </footer>
    </div>
  )
}
