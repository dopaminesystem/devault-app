"use client";

import { useActionState, useState } from "react";
import { createVault } from "@/app/actions/vault";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {
  message: "",
  success: false,
};

export function CreateVaultForm({ hideCardWrapper = false }: { hideCardWrapper?: boolean }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createVault,
    initialState,
  );
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    const generatedSlug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const content = (
    <form action={formAction} className={hideCardWrapper ? "space-y-4" : ""}>
      <div className={hideCardWrapper ? "space-y-4" : "space-y-4 p-6 pt-0"}>
        <div className="space-y-2">
          <Label htmlFor="name">Vault Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="My Awesome Vault"
            value={name}
            onChange={handleNameChange}
            required
            minLength={3}
            maxLength={50}
          />
          {state.fieldErrors?.name && (
            <p className="text-sm text-red-500">{state.fieldErrors.name.join(", ")}</p>
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
          {state.fieldErrors?.slug && (
            <p className="text-sm text-red-500">{state.fieldErrors.slug.join(", ")}</p>
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
          {state.fieldErrors?.description && (
            <p className="text-sm text-red-500">{state.fieldErrors.description.join(", ")}</p>
          )}
        </div>

        {state.message && (
          <p
            className={`text-sm ${state.fieldErrors || state.error ? "text-red-500" : "text-green-500"}`}
          >
            {state.message}
          </p>
        )}
      </div>
      <div className={hideCardWrapper ? "pt-4" : "p-6 pt-0 flex items-center"}>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create Vault"}
        </Button>
      </div>
    </form>
  );

  if (hideCardWrapper) {
    return content;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Vault</CardTitle>
        <CardDescription>Create a new vault to organize your bookmarks.</CardDescription>
      </CardHeader>
      {content}
    </Card>
  );
}
