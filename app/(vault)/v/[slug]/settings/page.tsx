import { ArrowLeft, Settings, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getVault } from "@/app/actions/vault";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteVaultForm } from "@/components/vault/delete-vault-form";
import { EditVaultForm } from "@/components/vault/edit-vault-form";
import { VaultAccessForm } from "@/components/vault/vault-access-form";
import { getSession } from "@/lib/auth";

export default async function VaultSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();
  const result = await getVault(slug);

  if (result.error || !result.vault) {
    redirect("/dashboard");
  }

  const { vault } = result;

  if (vault.ownerId !== session?.user?.id) {
    redirect(`/v/${slug}`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />

      <div className="relative z-10 container max-w-4xl mx-auto py-12 px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-white/5 pb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-fit text-zinc-400 hover:text-zinc-100 -ml-2"
          >
            <Link href={`/v/${slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vault
            </Link>
          </Button>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              Vault Settings
            </h1>
            <p className="text-zinc-400">
              Manage configuration and access for{" "}
              <span className="text-zinc-200 font-medium">{vault.name}</span>.
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* General Settings */}
          <Card className="bg-zinc-900/20 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Settings size={20} />
                </div>
                <div>
                  <CardTitle>General</CardTitle>
                  <CardDescription>Update vault name and basic details.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <EditVaultForm vault={vault} />
            </CardContent>
          </Card>

          {/* Access Control */}
          <Card className="bg-zinc-900/20 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Shield size={20} />
                </div>
                <div>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>Manage visibility and password protection.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <VaultAccessForm vault={vault} />
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                  <Trash2 size={20} />
                </div>
                <div>
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for this vault.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DeleteVaultForm vaultId={vault.id} vaultName={vault.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
