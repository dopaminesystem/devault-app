import { CreateVaultDialog } from "@/components/vault/create-vault-dialog";

export function VaultEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-zinc-200">No vaults found</h2>
                <p className="text-zinc-500 max-w-sm mx-auto">
                    Create your first vault to start collecting your bookmarks in a distraction-free environment.
                </p>
            </div>
            <CreateVaultDialog />
        </div>
    );
}
