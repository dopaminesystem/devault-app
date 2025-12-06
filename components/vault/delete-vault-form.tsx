"use client";

import { useActionState, useState } from "react";
import { deleteVault } from "@/app/actions/vault";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteVaultFormProps {
    vaultId: string;
    vaultName: string;
}

const initialState = {
    message: "",
};

export function DeleteVaultForm({ vaultId, vaultName }: DeleteVaultFormProps) {
    const [state, action, isPending] = useActionState(deleteVault, initialState);
    const [isOpen, setIsOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <p className="text-sm text-zinc-400">
                    Deleting this vault will permanently remove all categories and bookmarks associated with it. This action cannot be undone.
                </p>
                {state?.message && (
                    <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
                        {state.message}
                    </p>
                )}
            </div>

            <div className="flex justify-start">
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Vault
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the vault
                                <span className="font-semibold text-foreground"> {vaultName} </span>
                                and remove all data from our servers.
                            </AlertDialogDescription>
                            <div className="py-4 space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Please type <span className="font-mono font-bold select-all">delete {vaultName}</span> to confirm.
                                </p>
                                <Input
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder={`delete ${vaultName}`}
                                />
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <form action={action}>
                                <input type="hidden" name="vaultId" value={vaultId} />
                                <AlertDialogAction
                                    type="submit"
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={isPending || confirmText !== `delete ${vaultName}`}
                                >
                                    {isPending ? "Deleting..." : "Delete Vault"}
                                </AlertDialogAction>
                            </form>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
