import { ArrowLeft, Link as LinkIcon, Settings, Shield, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DefaultVaultForm } from "@/modules/auth/components/default-vault-form";
import { DiscordConnectionCard } from "@/modules/auth/components/discord-connection-card";
import { SignOutButton } from "@/modules/auth/components/sign-out-button";
import { getSession } from "@/shared/auth/auth";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { prisma } from "@/shared/db/prisma";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Fetch user with default vault and accounts
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      defaultVaultId: true,
      accounts: true,
    },
  });

  const discordAccount = user?.accounts.find((a) => a.providerId === "discord");

  // Fetch available vaults
  const vaults = await prisma.vault.findMany({
    where: {
      OR: [{ ownerId: session.user.id }, { members: { some: { userId: session.user.id } } }],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />

      <div className="relative z-10 container max-w-4xl mx-auto py-12 px-6 space-y-10">
        <div className="flex flex-col gap-6 border-b border-white/5 pb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-fit text-zinc-400 hover:text-zinc-100 -ml-2"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                Settings
              </h1>
              <p className="text-zinc-400">Manage your account preferences and integrations.</p>
            </div>
            <SignOutButton />
          </div>
        </div>

        <div className="grid gap-8">
          {/* Profile Section */}
          <Card className="bg-zinc-900/20 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <User size={20} />
                </div>
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your personal account information.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center overflow-hidden">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User size={32} className="text-zinc-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-zinc-200">{user?.name || "User"}</h3>
                  <p className="text-sm text-zinc-500">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card className="bg-zinc-900/20 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Settings size={20} />
                </div>
                <div>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Manage your default vault and other settings.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DefaultVaultForm
                vaults={vaults}
                defaultVaultId={user?.defaultVaultId}
                isPro={false}
              />
            </CardContent>
          </Card>

          {/* Integrations Section */}
          <Card className="bg-zinc-900/20 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <LinkIcon size={20} />
                </div>
                <div>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Connect with third-party services.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <DiscordConnectionCard
                isConnected={!!discordAccount}
                tokenExpiresAt={discordAccount?.accessTokenExpiresAt}
              />
            </CardContent>
          </Card>
          {/* Danger Zone */}
          <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                  <Shield size={20} />
                </div>
                <div>
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                  <CardDescription>Irreversible account actions.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <div>
                  <p className="font-medium text-zinc-200">Delete Account</p>
                  <p className="text-sm text-zinc-500">
                    Permanently delete your account and all data.
                  </p>
                  <p className="text-xs text-amber-400 mt-2">
                    ⚠️ Delete account is currently unavailable. Please contact administrator.
                  </p>
                </div>
                <Button variant="destructive" disabled title="Contact support to delete account">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
