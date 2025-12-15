import { getVault, getVaultPageData } from "@/app/actions/vault";
import { JoinVaultForm } from "@/components/vault/join-vault-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { VaultMember } from "@prisma/client";
import ClientVaultView from "./client-vault-view";
import { prisma } from "@/lib/prisma";

export default async function VaultPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const result = await getVault(slug);

    const session = await getSession();

    if (result.error === "Vault not found") {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Vault Not Found</CardTitle>
                        <CardDescription>
                            The vault you are looking for does not exist or has been removed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (result.error === "Access denied" || result.error === "Unauthorized") {
        const vaultCheck = await prisma.vault.findUnique({
            where: { slug },
            select: { id: true, name: true, accessType: true }
        });

        if (vaultCheck && vaultCheck.accessType === "PASSWORD") {
            return <JoinVaultForm vaultId={vaultCheck.id} vaultName={vaultCheck.name} />;
        }

        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Lock className="h-6 w-6" />
                        </div>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>
                            You do not have permission to view this vault.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            This vault is restricted. You may need to sign in or join a specific Discord server to access it.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button asChild variant="outline">
                                <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { vault } = result;
    if (!vault) return null;

    // ⚡ PERF: Fetch bookmarks, categories, and user vaults in PARALLEL
    // Now using a dedicated function for cleaner code and reusability
    const { bookmarks, categories, allVaults } = await getVaultPageData(
        vault.id,
        session?.user?.id
    );

    const isOwner = session?.user?.id === vault.ownerId;
    const isMember = vault.members.some((m: VaultMember) => m.userId === session?.user?.id);
    const isLoggedIn = !!session?.user;

    return (
        <ClientVaultView
            vault={vault}
            allVaults={allVaults}
            initialBookmarks={bookmarks}
            initialCategories={categories}
            isOwner={isOwner}
            isMember={isMember}
            isLoggedIn={isLoggedIn}
        />
    );
}
