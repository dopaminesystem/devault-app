import { Shield, Tags, Zap, Globe, Share2, Code, Lock, Folder, Star, Users, GitFork, Heart } from "lucide-react"

export function LandingFeatures() {
    return (
        <section className="py-24 px-4 text-left w-full">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Powerful features to organize, secure, and access your bookmarks from anywhere.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[180px]">
                    <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all duration-500" />
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-zinc-100 mb-2">Bank-Grade Security</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Your data is encrypted at rest and in transit with AES-256 encryption.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
                                <Lock className="w-3 h-3" />
                                <span>AES-256</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
                                <Shield className="w-3 h-3" />
                                <span>Postgres</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 hover:border-blue-500/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-500" />
                        <div className="flex items-start justify-between h-full">
                            <div className="max-w-xs">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Tags className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-100 mb-2">Smart Organization</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Tag, categorize, and filter with our flexible system.
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 flex-wrap max-w-xs">
                                {["Design", "Dev", "Reading", "Work", "Personal", "Research"].map((tag, i) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 hover:scale-105"
                                        style={{
                                            backgroundColor: `hsl(${210 + i * 15}, 60%, 50%, 0.1)`,
                                            borderColor: `hsl(${210 + i * 15}, 60%, 50%, 0.2)`,
                                            color: `hsl(${210 + i * 15}, 60%, 65%)`,
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 hover:border-amber-500/30 transition-all duration-500">
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-500" />
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                            <Zap className="w-6 h-6 text-amber-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-1">Lightning Fast</h3>
                        <p className="text-zinc-400 text-sm">Sub-100ms response times globally.</p>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden">
                                <div className="h-full w-[95%] bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                            </div>
                            <span className="text-amber-400 text-xs font-mono">95ms</span>
                        </div>
                    </div>

                    <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 hover:border-violet-500/30 transition-all duration-500">
                        <div className="absolute top-0 left-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-all duration-500" />
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Globe className="w-6 h-6 text-violet-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-1">Access Anywhere</h3>
                        <p className="text-zinc-400 text-sm">Sync across all your devices seamlessly.</p>
                        <div className="mt-3 flex items-center gap-3">
                            <div className="w-8 h-5 rounded bg-violet-500/10 border border-violet-500/20" />
                            <div className="w-4 h-6 rounded-sm bg-violet-500/10 border border-violet-500/20" />
                            <div className="w-6 h-4 rounded bg-violet-500/10 border border-violet-500/20" />
                        </div>
                    </div>

                    <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 flex flex-col hover:border-rose-500/30 transition-all duration-500">
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-all duration-500" />
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Share2 className="w-6 h-6 text-rose-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-100 mb-2">Selective Sharing</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Keep personal items private, share curated collections publicly.
                        </p>
                        <div className="mt-auto space-y-2">
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
                                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                    <Folder className="w-4 h-4 text-rose-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-zinc-200">Design Resources</div>
                                    <div className="text-[10px] text-zinc-500">Public • 24 items</div>
                                </div>
                                <Users className="w-4 h-4 text-rose-400" />
                            </div>
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                    <Lock className="w-4 h-4 text-zinc-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-zinc-200">Personal Notes</div>
                                    <div className="text-[10px] text-zinc-500">Private • 12 items</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-4 md:row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 hover:border-emerald-500/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500" />
                        <div className="flex flex-col md:flex-row md:items-start justify-between h-full gap-6">
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Code className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-zinc-100 mb-2">Open Source</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                                        Fully transparent and community-driven. Self-hostable for complete control.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="text-sm text-zinc-400">2.4k</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <GitFork className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm text-zinc-400">580</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Heart className="w-4 h-4 text-rose-400" />
                                        <span className="text-sm text-zinc-400">Sponsor</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col gap-3 font-mono text-xs flex-1 max-w-xs">
                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500/80" />
                                        <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                                        <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                                        <span className="text-zinc-600 text-[10px] ml-2">terminal</span>
                                    </div>
                                    <div className="text-zinc-500">
                                        <span className="text-emerald-400">$</span> git clone github.com/bookmarks
                                    </div>
                                    <div className="mt-1 text-zinc-500">
                                        <span className="text-emerald-400">$</span> docker compose up -d
                                    </div>
                                    <div className="mt-1 text-emerald-400">✓ Running on localhost:3000</div>
                                </div>
                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                    <div className="text-zinc-600 mb-1">{`// Contribute with us`}</div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className="w-6 h-6 rounded-full border-2 border-zinc-950"
                                                    style={{ backgroundColor: `hsl(${i * 60 + 120}, 50%, 40%)` }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-zinc-500">+86 contributors</span>
                                    </div>
                                    <div className="text-zinc-400">
                                        <span className="text-emerald-400">AGPL v3</span> licensed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
