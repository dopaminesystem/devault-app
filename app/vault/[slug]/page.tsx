import { getBookmarks } from "@/app/actions/bookmark";
import { getVault } from "@/app/actions/vault";
import { getCategories } from "@/app/actions/category";
import { JoinVaultForm } from "@/components/vault/join-vault-form";
import { CreateBookmarkForm } from "@/components/bookmark/create-bookmark-form";
import { BookmarkList } from "@/components/bookmark/bookmark-list";
import { VaultSidebar } from "@/components/vault/vault-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Settings } from "lucide-react";
import Link from "next/link";
import { auth, getSession } from "@/lib/auth";
import { Bookmark, VaultMember } from "@prisma/client";

export default async function VaultPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ category?: string }> }) {
    const { slug } = await params;
    const { category: categoryId } = await searchParams;
    const result = await getVault(slug);
    const session = await getSession();
    const { prisma } = await import("@/lib/prisma");

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
        // If we have the vault object (even if access denied), we can check accessType
        // But getVault returns error string if denied.
        // We need to fetch basic info to know if it's password protected.
        // Let's modify getVault to return basic info even on error?
        // Or just fetch it here again? Fetching here is safer for now to avoid breaking getVault contract.

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
    if (!vault) return null; // Should not happen given checks above

    // Fetch bookmarks
    const { bookmarks } = await getBookmarks(vault.id);
    const { categories } = await getCategories(vault.id);

    const isOwner = session?.user?.id === vault.ownerId;
    const isMember = vault.members.some((m: VaultMember) => m.userId === session?.user?.id);
    const canEdit = isOwner || isMember;

    // Filter bookmarks if category selected
    const filteredBookmarks = categoryId
        ? bookmarks?.filter((b: Bookmark) => b.categoryId === categoryId)
        : bookmarks;

    return (
        <div className="flex min-h-screen">
            <VaultSidebar
                vaultId={vault.id}
                slug={slug}
                categories={categories || []}
                canEdit={canEdit}
            />
            <div className="flex-1 container mx-auto py-8 px-4">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{vault.name}</h1>
                        {vault.description && (
                            <p className="mt-2 text-muted-foreground">{vault.description}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {canEdit && <CreateBookmarkForm vaultId={vault.id} />}
                        {isOwner && (
                            <Button variant="outline" size="icon" asChild>
                                <Link href={`/vault/${slug}/settings`}>
                                    <Settings className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <BookmarkList bookmarks={filteredBookmarks || []} categories={categories || []} canEdit={canEdit} />
            </div>
        </div>
    );
}
