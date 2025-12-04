import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Vault } from "@prisma/client";
import { redirect } from "next/navigation";
import { CreateVaultDialog } from "@/components/vault/create-vault-dialog";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Globe, Lock, Shield } from "lucide-react";

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
                    <SignOutButton />
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
                        <CreateVaultDialog />
                    </div>
                )}
            </div>
        </div>
    );
}
