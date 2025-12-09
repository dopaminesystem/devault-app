import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { VerifyEmailView } from "@/components/auth/verify-email-view";
import { Settings as SettingsIcon } from "lucide-react";

// Sub-components
import { VaultGrid } from "@/components/dashboard/overview/vault-grid";
import { VaultEmptyState } from "@/components/dashboard/overview/vault-empty-state";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    if (!session.user.emailVerified) {
        return <VerifyEmailView />;
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
                    <VaultEmptyState />
                ) : (
                    <VaultGrid vaults={vaults} />
                )}
            </div>
        </div>
    );
}
