import type { Vault } from "@prisma/client";
import { Globe, Lock, Shield } from "lucide-react";
import Link from "next/link";
import { CreateVaultDialog } from "@/modules/vault/components/create-vault-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

interface VaultGridProps {
  vaults: Vault[];
  hasOwnedVault: boolean;
}

export function VaultGrid({ vaults, hasOwnedVault }: VaultGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {vaults.map((vault: Vault) => (
        <Card
          key={vault.id}
          className="group hover:border-zinc-700 transition-all duration-300 flex flex-col"
        >
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5">
                <CardTitle className="group-hover:text-indigo-400 transition-colors">
                  {vault.name}
                </CardTitle>
                <CardDescription>/{vault.slug}</CardDescription>
              </div>
              {vault.accessType === "PUBLIC" && (
                <div
                  className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  title="Public Access"
                >
                  <Globe size={16} />
                </div>
              )}
              {vault.accessType === "PASSWORD" && (
                <div
                  className="p-2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  title="Password Protected"
                >
                  <Lock size={16} />
                </div>
              )}
              {vault.accessType === "DISCORD_GATED" && (
                <div
                  className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  title="Server Gated"
                >
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
              <Link href={`/v/${vault.slug}`} className="block h-full">
                <Button className="w-full bg-zinc-100 text-zinc-950 hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Open Vault
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add New Vault Card - Show if user doesn't own a vault yet */}
      {!hasOwnedVault ? (
        <CreateVaultDialog />
      ) : (
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/10 gap-4 h-full min-h-[200px] opacity-60 cursor-not-allowed relative overflow-hidden group">
          <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
  );
}
