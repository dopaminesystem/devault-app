"use client";

import { useActionState, useState } from "react";
import { deleteVault } from "@/app/actions/vault";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                    Irreversible actions for your vault.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Deleting this vault will permanently remove all categories and bookmarks associated with it. This action cannot be undone.
                </p>
                {state?.message && (
                    <p className="mt-2 text-sm text-red-500">
                        {state.message}
                    </p>
                )}
            </CardContent>
            <CardFooter>
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
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
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <form action={action}>
                                <input type="hidden" name="vaultId" value={vaultId} />
                                <AlertDialogAction
                                    type="submit"
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={isPending}
                                >
                                    {isPending ? "Deleting..." : "Delete Vault"}
                                </AlertDialogAction>
                            </form>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
