"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { updateVault } from "@/app/actions/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState } from "@/lib/types";

interface EditVaultFormProps {
  vault: {
    id: string;
    name: string;
    description: string | null;
  };
}

const initialState: ActionState = {
  message: "",
  success: false,
};

export function EditVaultForm({ vault }: EditVaultFormProps) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    updateVault,
    initialState,
  );

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="vaultId" value={vault.id} />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium text-zinc-200">
            Vault Name
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={vault.name}
            placeholder="My Awesome Vault"
            required
            minLength={3}
            maxLength={50}
            className="bg-zinc-950 border-zinc-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium text-zinc-200">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={vault.description || ""}
            placeholder="What's this vault about?"
            maxLength={200}
            className="bg-zinc-950 border-zinc-800 resize-none h-24"
          />
        </div>
      </div>

      {state?.message && (
        <p
          className={`text-sm p-3 rounded-lg ${state.message.includes("success") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-start pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-zinc-100 text-zinc-950 hover:bg-white"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
