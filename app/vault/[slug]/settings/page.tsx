import { getVault } from "@/app/actions/vault";
import { getSession } from "@/lib/auth";
import { EditVaultForm } from "@/components/vault/edit-vault-form";
import { VaultAccessForm } from "@/components/vault/vault-access-form";
import { DeleteVaultForm } from "@/components/vault/delete-vault-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VaultSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await getSession();
    const result = await getVault(slug);

    if (result.error || !result.vault) {
        redirect("/dashboard");
    }

    const { vault } = result;

    if (vault.ownerId !== session?.user?.id) {
        redirect(`/vault/${slug}`);
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/vault/${slug}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Vault Settings</h1>
                    <p className="text-muted-foreground">Manage settings for {vault.name}</p>
                </div>
            </div>

            <div className="space-y-6">
                <EditVaultForm vault={vault} />
                <VaultAccessForm vault={vault} />
                <DeleteVaultForm vaultId={vault.id} vaultName={vault.name} />
            </div>
        </div>
    );
}
