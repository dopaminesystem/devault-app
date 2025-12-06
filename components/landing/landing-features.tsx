import { Shield, Tags, Zap, Globe, Share2, Code } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function LandingFeatures() {
    return (
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
    );
}
