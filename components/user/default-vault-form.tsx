"use client";

import { useActionState } from "react";
import { updateDefaultVault } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Vault } from "@prisma/client";

interface DefaultVaultFormProps {
    vaults: Vault[];
    defaultVaultId?: string | null;
}

const initialState = {
    success: false,
    message: "",
};

export function DefaultVaultForm({ vaults, defaultVaultId }: DefaultVaultFormProps) {
    const [state, formAction, pending] = useActionState(updateDefaultVault, initialState);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Default Vault</CardTitle>
                <CardDescription>
                    Select the vault where bookmarks from Discord will be saved by default.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="vaultId">Vault</Label>
                        <Select name="vaultId" defaultValue={defaultVaultId || undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a vault" />
                            </SelectTrigger>
                            <SelectContent>
                                {vaults.map((vault) => (
                                    <SelectItem key={vault.id} value={vault.id}>
                                        {vault.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {state.message && (
                        <p className={`text-sm ${state.success ? "text-green-500" : "text-red-500"}`}>
                            {state.message}
                        </p>
                    )}

                    <Button type="submit" disabled={pending}>
                        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
