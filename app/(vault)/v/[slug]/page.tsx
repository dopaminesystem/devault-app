import type { VaultMember } from "@prisma/client";
import { Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getVault, getVaultPageData } from "@/app/actions/vault";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscordReconnectPrompt } from "@/components/vault/discord-reconnect-prompt";
import { JoinVaultForm } from "@/components/vault/join-vault-form";
import { getSession } from "@/lib/auth";
import { SITE_CONFIG } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import ClientVaultView from "./client-vault-view";

// Dynamic OG metadata for each vault
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const vault = await prisma.vault.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!vault) {
    return {
      title: "Vault Not Found | Devault",
      description: "The vault you are looking for does not exist.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${vault.name} | Devault`;
  const description =
    vault.description || `Explore ${vault.name} on Devault - a curated collection of bookmarks.`;
  const vaultUrl = `${SITE_CONFIG.url}/v/${slug}`;
  const ogImageUrl = `/api/og/${slug}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: vaultUrl,
    },
    openGraph: {
      title,
      description,
      url: vaultUrl,
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: vault.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

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
      select: { id: true, name: true, accessType: true },
    });

    if (vaultCheck && vaultCheck.accessType === "PASSWORD") {
      return <JoinVaultForm vaultId={vaultCheck.id} vaultName={vaultCheck.name} />;
    }

    // Show Discord reconnect prompt for Discord-gated vaults when reconnection is needed
    if (
      vaultCheck &&
      vaultCheck.accessType === "DISCORD_GATED" &&
      result.discordReason &&
      result.discordReason !== "success"
    ) {
      return <DiscordReconnectPrompt vaultName={vaultCheck.name} reason={result.discordReason} />;
    }

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this vault.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              This vault is restricted. You may need to sign in or join a specific Discord server to
              access it.
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
  const { bookmarks, categories, allVaults } = await getVaultPageData(vault.id, session?.user?.id);

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
