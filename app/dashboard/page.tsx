import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Vault } from "@prisma/client";
import { redirect } from "next/navigation";
import { CreateVaultDialog } from "@/components/vault/create-vault-dialog";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Globe, Lock, Shield, Settings as SettingsIcon } from "lucide-react";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    const vaults = await prisma.vault.findMany({
        where: {
            OR: [
                { ownerId: session.user.id },
                { members: { some: { userId: session.user.id } } }
            ]
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Decorative Gradients */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-radial-gradient from-blue-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-8 max-w-5xl mx-auto space-y-12">
                <div className="flex justify-between items-end border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                            Dashboard
                        </h1>
                        <p className="text-zinc-400">Manage your vaults and bookmarks.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-zinc-100">
                            <Link href="/settings">
                                <SettingsIcon size={20} />
                            </Link>
                        </Button>
                        <SignOutButton />
                    </div>
                </div>

                {vaults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-zinc-200">No vaults found</h2>
                            <p className="text-zinc-500 max-w-sm mx-auto">
                                Create your first vault to start collecting your bookmarks in a distraction-free environment.
                            </p>
                        </div>
                        <CreateVaultDialog />
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {vaults.map((vault: Vault) => (
                            <Card key={vault.id} className="group hover:border-zinc-700 transition-all duration-300 flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-1.5">
                                            <CardTitle className="group-hover:text-indigo-400 transition-colors">{vault.name}</CardTitle>
                                            <CardDescription>/{vault.slug}</CardDescription>
                                        </div>
                                        {vault.accessType === "PUBLIC" && (
                                            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Public Access">
                                                <Globe size={16} />
                                            </div>
                                        )}
                                        {vault.accessType === "PASSWORD" && (
                                            <div className="p-2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Password Protected">
                                                <Lock size={16} />
                                            </div>
                                        )}
                                        {vault.accessType === "DISCORD_GATED" && (
                                            <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" title="Server Gated">
                                                <Shield size={16} />
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col gap-4">
                                    <p className="text-sm text-zinc-400 line-clamp-2 min-h-[2.5rem]">
                                        {vault.description || "No description provided."}
                                    </p>
                                    <div className="mt-auto pt-4">
                                        <Link href={`/vault/${vault.slug}`} passHref>
                                            <Button className="w-full bg-zinc-100 text-zinc-950 hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                                Open Vault
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Add New Vault Card */}
                        {vaults.length < 1 ? (
                            <CreateVaultDialog />
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/10 gap-4 h-full min-h-[200px] opacity-60 cursor-not-allowed relative overflow-hidden group">
                                <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-xs font-medium text-zinc-400 shadow-xl">
                                        Free Tier Limit Reached
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                    <Lock size={24} className="text-zinc-600" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm text-zinc-500 font-medium">Create New Vault</p>
                                    <p className="text-xs text-indigo-400 font-medium">Pro Feature</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
