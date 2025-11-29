"use client";

import { useActionState, useState } from "react";
import { updateVaultSettings } from "@/app/actions/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface VaultAccessFormProps {
    vault: {
        id: string;
        accessType: "PUBLIC" | "PASSWORD" | "DISCORD_GATED";
    };
}

const initialState = {
    message: "",
};

export function VaultAccessForm({ vault }: VaultAccessFormProps) {
    const [state, action, isPending] = useActionState(updateVaultSettings, initialState);
    const [accessType, setAccessType] = useState(vault.accessType);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Settings</CardTitle>
                <CardDescription>
                    Control who can access your vault.
                </CardDescription>
            </CardHeader>
            <form action={action}>
                <CardContent className="space-y-4">
                    <input type="hidden" name="vaultId" value={vault.id} />
                    <div className="space-y-2">
                        <Label>Access Type</Label>
                        <RadioGroup
                            name="accessType"
                            defaultValue={vault.accessType}
                            onValueChange={(val) => setAccessType(val as any)}
                            className="flex flex-col space-y-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="PUBLIC" id="public" />
                                <Label htmlFor="public">Public (Anyone with the link)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="PASSWORD" id="password" />
                                <Label htmlFor="password">Password Protected</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {accessType === "PASSWORD" && (
                        <div className="space-y-2">
                            <Label htmlFor="password-input">Password</Label>
                            <Input
                                id="password-input"
                                name="password"
                                type="password"
                                placeholder="Set a new password"
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave blank to keep existing password.
                            </p>
                        </div>
                    )}

                    {state?.message && (
                        <p className={`text-sm ${state.message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                            {state.message}
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Access Settings
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
