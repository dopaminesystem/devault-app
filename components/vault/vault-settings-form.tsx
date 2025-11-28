"use client";

import { useActionState, useState } from "react";
import { updateVaultSettings } from "@/app/actions/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type VaultSettingsFormProps = {
    vault: {
        id: string;
        accessType: "PUBLIC" | "PASSWORD" | "DISCORD_GATED";
    };
};

const initialState = {
    message: "",
};

export function VaultSettingsForm({ vault }: VaultSettingsFormProps) {
    const [state, formAction, isPending] = useActionState(updateVaultSettings, initialState);
    const [accessType, setAccessType] = useState(vault.accessType);

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Vault Access Settings</CardTitle>
                <CardDescription>Control who can access your vault.</CardDescription>
            </CardHeader>
            <form action={formAction}>
                <input type="hidden" name="vaultId" value={vault.id} />
                <CardContent className="space-y-6">
                    <RadioGroup
                        name="accessType"
                        defaultValue={vault.accessType}
                        onValueChange={(value) => setAccessType(value as any)}
                        className="flex flex-col space-y-4"
                    >
                        <div className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value="PUBLIC" id="public" />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="public" className="font-medium">
                                    Public
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Anyone with the link can view this vault.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value="PASSWORD" id="password" />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="password" className="font-medium">
                                    Password Protected
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Users must enter a password to join and view.
                                </p>
                            </div>
                        </div>
                    </RadioGroup>

                    {accessType === "PASSWORD" && (
                        <div className="space-y-2 pl-7">
                            <Label htmlFor="password">Set Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter a secure password"
                                required={accessType === "PASSWORD"}
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave empty to keep existing password (if already set).
                            </p>
                        </div>
                    )}

                    {state.message && (
                        <p className={`text-sm ${state.message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                            {state.message}
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
