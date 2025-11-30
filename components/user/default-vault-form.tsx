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
    isPro?: boolean;
}

const initialState = {
    success: false,
    message: "",
};

export function DefaultVaultForm({ vaults, defaultVaultId, isPro = false }: DefaultVaultFormProps) {
    const [state, formAction, pending] = useActionState(updateDefaultVault, initialState);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Default Vault</CardTitle>
                    {!isPro && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                            Pro Feature
                        </span>
                    )}
                </div>
                <CardDescription>
                    Select the vault where bookmarks from Discord will be saved by default.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="vaultId">Vault</Label>
                        <Select name="vaultId" defaultValue={defaultVaultId || undefined} disabled={!isPro || pending}>
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

                    {!isPro && (
                        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                            Default vault selection is available on the Pro plan.
                            Free users save to their first created vault by default.
                        </div>
                    )}

                    {state.message && (
                        <p className={`text-sm ${state.success ? "text-green-500" : "text-red-500"}`}>
                            {state.message}
                        </p>
                    )}

                    <Button type="submit" disabled={!isPro || pending}>
                        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
