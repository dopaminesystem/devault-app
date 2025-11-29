"use client";

import { useActionState } from "react";
import { updateVault } from "@/app/actions/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EditVaultFormProps {
    vault: {
        id: string;
        name: string;
        description: string | null;
    };
}

const initialState = {
    message: "",
};

export function EditVaultForm({ vault }: EditVaultFormProps) {
    const [state, action, isPending] = useActionState(updateVault, initialState);

    return (
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                    Update your vault's name and description.
                </CardDescription>
            </CardHeader>
            <form action={action}>
                <CardContent className="space-y-4">
                    <input type="hidden" name="vaultId" value={vault.id} />
                    <div className="space-y-2">
                        <Label htmlFor="name">Vault Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={vault.name}
                            placeholder="My Awesome Vault"
                            required
                            minLength={3}
                            maxLength={50}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={vault.description || ""}
                            placeholder="What's this vault about?"
                            maxLength={200}
                        />
                    </div>
                    {state?.message && (
                        <p className={`text-sm ${state.message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                            {state.message}
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
