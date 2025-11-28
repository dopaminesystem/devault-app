"use client";

import { useActionState, useEffect, useState } from "react";
import { createVault, CreateVaultState } from "@/app/actions/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: CreateVaultState = {
    message: "",
    errors: {},
};

export function CreateVaultForm() {
    const [state, formAction, isPending] = useActionState(createVault, initialState);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    // Auto-generate slug from name
    useEffect(() => {
        const generatedSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        setSlug(generatedSlug);
    }, [name]);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create Vault</CardTitle>
                <CardDescription>Create a new vault to organize your bookmarks.</CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Vault Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="My Awesome Vault"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={3}
                            maxLength={50}
                        />
                        {state.errors?.name && (
                            <p className="text-sm text-red-500">{state.errors.name.join(", ")}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Vault URL</Label>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">devault.app/</span>
                            <Input
                                id="slug"
                                name="slug"
                                placeholder="my-awesome-vault"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                minLength={3}
                                maxLength={50}
                            />
                        </div>
                        {state.errors?.slug && (
                            <p className="text-sm text-red-500">{state.errors.slug.join(", ")}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="A place for my design resources..."
                            maxLength={200}
                        />
                        {state.errors?.description && (
                            <p className="text-sm text-red-500">{state.errors.description.join(", ")}</p>
                        )}
                    </div>

                    {state.message && (
                        <p className={`text-sm ${state.errors ? "text-red-500" : "text-green-500"}`}>
                            {state.message}
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Vault"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
