import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Layers, Globe, ArrowRight, Vault, Zap, Lock, Share2, Code, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 font-sans">
      {/* Header/Nav - Ultra Minimal */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-border/40">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Vault className="h-5 w-5" />
          <span>Devault</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="https://github.com/dhafin/devault" target="_blank" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="font-medium border-border/60 hover:bg-muted/50 h-9 px-4 text-sm">
              Log in
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-6 py-16 md:py-24 flex flex-col gap-20">
        {/* Hero Section */}
        <section className="flex flex-col items-start text-left gap-8 max-w-5xl">
          <div className="inline-flex items-center border border-border/60 bg-muted/30 px-3 py-1 text-xs font-mono text-muted-foreground backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 bg-primary mr-2 animate-pulse"></span>
            IN ALPHA
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground leading-[0.9]">
              DIGITAL <br />
              <span className="text-muted-foreground/50">VAULT.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed tracking-tight font-light">
              The minimalist home for your bookmarks and snippets. <br className="hidden md:block" />
              Secure. Organized. Designed for focus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-medium rounded-none border-2 border-primary hover:bg-primary/90 transition-all">
                Get Started
              </Button>
            </Link>
            <Link href="https://github.com/dhafin/devault" target="_blank" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-medium rounded-none border-2 border-border hover:bg-muted/50 transition-all">
                View Source
              </Button>
            </Link>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">

          {/* Large Feature 1 - Security */}
          <Card className="md:col-span-2 lg:col-span-2 row-span-2 bg-card border-border/40 hover:border-primary/50 transition-colors group relative overflow-hidden rounded-none">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            <CardHeader className="h-full flex flex-col justify-between p-8">
              <Shield className="h-12 w-12 mb-4 text-foreground stroke-1" />
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold tracking-tighter">Uncompromising Security</CardTitle>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                  Your data is encrypted at rest and in transit. We prioritize privacy above all else, ensuring your vault remains truly yours.
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Medium Feature 2 - Organization */}
          <Card className="md:col-span-1 lg:col-span-2 bg-card border-border/40 hover:border-primary/50 transition-colors group rounded-none">
            <CardHeader className="p-8">
              <Layers className="h-8 w-8 mb-4 text-foreground stroke-1" />
              <CardTitle className="text-2xl font-bold tracking-tighter">Smart Organization</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <p className="text-muted-foreground text-lg">
                Tag, categorize, and filter your assets with a powerful, flexible system designed for speed.
              </p>
            </CardContent>
          </Card>

          {/* Small Feature 3 - Speed */}
          <Card className="bg-card border-border/40 hover:border-primary/50 transition-colors group rounded-none">
            <CardHeader className="p-6">
              <Zap className="h-6 w-6 mb-4 text-foreground stroke-1" />
              <CardTitle className="text-xl font-bold tracking-tighter">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-sm text-muted-foreground">
                Instant page loads and seamless interactions.
              </p>
            </CardContent>
          </Card>

          {/* Small Feature 4 - Access */}
          <Card className="bg-card border-border/40 hover:border-primary/50 transition-colors group rounded-none">
            <CardHeader className="p-6">
              <Globe className="h-6 w-6 mb-4 text-foreground stroke-1" />
              <CardTitle className="text-xl font-bold tracking-tighter">Accessible Anywhere</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-sm text-muted-foreground">
                Your vault travels with you. Access your bookmarks from any device, anytime.
              </p>
            </CardContent>
          </Card>

          {/* Medium Feature 5 - Sharing */}
          <Card className="md:col-span-3 lg:col-span-2 bg-card border-border/40 hover:border-primary/50 transition-colors group rounded-none">
            <CardHeader className="p-8">
              <Share2 className="h-8 w-8 mb-4 text-foreground stroke-1" />
              <CardTitle className="text-2xl font-bold tracking-tighter">Selective Sharing</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <p className="text-muted-foreground text-lg">
                Keep your personal items private, but share curated collections with the world via public links.
              </p>
            </CardContent>
          </Card>

          {/* Small Feature 6 - Developer First */}
          <Card className="md:col-span-1 lg:col-span-2 bg-card border-border/40 hover:border-primary/50 transition-colors group rounded-none flex flex-col justify-center items-center text-center p-8">
            <div className="space-y-4">
              <div className="flex justify-center gap-4 text-muted-foreground">
                <Code className="h-8 w-8" />
                <Terminal className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tighter">Developer First</CardTitle>
              <p className="text-sm text-muted-foreground">
                Open source and ready for you to extend.
              </p>
            </div>
          </Card>

        </section>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-mono">
        <p>&copy; {new Date().getFullYear()} DEVAULT. OPEN SOURCE SOFTWARE.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-foreground transition-colors uppercase tracking-wider">Privacy</Link>
          <Link href="#" className="hover:text-foreground transition-colors uppercase tracking-wider">Terms</Link>
          <Link href="#" className="hover:text-foreground transition-colors uppercase tracking-wider">Twitter</Link>
        </div>
      </footer>
    </div>
  );
}
