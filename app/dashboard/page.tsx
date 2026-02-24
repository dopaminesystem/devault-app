import type { Vault } from "@prisma/client";
import { Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/modules/auth/components/sign-out-button";
import { VerifyEmailView } from "@/modules/auth/components/verify-email-view";
import { VaultEmptyState } from "@/shared/components/dashboard/overview/vault-empty-state";
// Sub-components
import { VaultGrid } from "@/shared/components/dashboard/overview/vault-grid";
import { Button } from "@/shared/components/ui/button";
import { getSession } from "@/shared/auth/auth";
import { prisma } from "@/shared/db/prisma";

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
      OR: [{ ownerId: session.user.id }, { members: { some: { userId: session.user.id } } }],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const hasOwnedVault = vaults.some((v: Vault) => v.ownerId === session.user.id);

  return (
    <div className="min-h-screen bg-ds-canvas text-ds-text-primary font-sans selection:bg-[--ds-selection] relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-[--ds-gradient-hero] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-radial-gradient from-[--ds-brand-subtle] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-8 max-w-5xl mx-auto space-y-12">
        <div className="flex justify-between items-end border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              Dashboard
            </h1>
            <p className="text-zinc-400">Manage your vaults and bookmarks.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-zinc-400 hover:text-zinc-100"
            >
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
          <VaultGrid vaults={vaults} hasOwnedVault={hasOwnedVault} />
        )}
      </div>
    </div>
  );
}
