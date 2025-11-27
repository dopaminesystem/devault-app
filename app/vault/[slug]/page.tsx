import { getBookmarks } from "@/app/actions/bookmark";
import { getVault } from "@/app/actions/vault";
import { JoinVaultForm } from "@/components/vault/join-vault-form";
import { BookmarkList } from "@/components/bookmark/bookmark-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function VaultPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const result = await getVault(slug);

    if (result.error === "Vault not found") {
        notFound();
    }

    if (result.error === "Access denied" || result.error === "Unauthorized") {
        // If we have the vault object (even if access denied), we can check accessType
        // But getVault returns error string if denied.
        // We need to fetch basic info to know if it's password protected.
        // Let's modify getVault to return basic info even on error?
        // Or just fetch it here again? Fetching here is safer for now to avoid breaking getVault contract.

        const { prisma } = await import("@/lib/prisma");
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

    if (result.error) {
        return <div>Error: {result.error}</div>;
    }

    const { vault } = result;

    // Fetch bookmarks
    const bookmarksResult = await getBookmarks(vault!.id);
    const bookmarks = bookmarksResult.bookmarks || [];

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{vault?.name}</h1>
                <p className="text-muted-foreground text-lg">{vault?.description || "No description"}</p>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Bookmarks</h2>
                    {/* Add Bookmark Button could go here */}
                </div>

                <BookmarkList bookmarks={bookmarks} />
            </div>
        </div>
    );
}
