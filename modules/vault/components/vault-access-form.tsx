"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { updateVaultSettings } from "@/modules/vault/actions/vault.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import type { ActionState } from "@/shared/types";

interface VaultAccessFormProps {
  vault: {
    id: string;
    accessType: "PUBLIC" | "PASSWORD" | "DISCORD_GATED";
    discordGuildId?: string | null;
  };
}

const initialState: ActionState = {
  message: "",
  success: false,
};

export function VaultAccessForm({ vault }: VaultAccessFormProps) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    updateVaultSettings,
    initialState,
  );
  const [accessType, setAccessType] = useState(vault.accessType);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="vaultId" value={vault.id} />

      <div className="space-y-4">
        <Label className="text-base font-medium text-zinc-200">Access Type</Label>
        <RadioGroup
          name="accessType"
          value={accessType}
          onValueChange={(val) => setAccessType(val as "PUBLIC" | "PASSWORD" | "DISCORD_GATED")}
          className="flex flex-col gap-3"
        >
          <label
            htmlFor="public"
            className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${accessType === "PUBLIC" ? "bg-indigo-500/10 border-indigo-500/50" : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"}`}
          >
            <RadioGroupItem value="PUBLIC" id="public" className="mt-1" />
            <div className="space-y-1">
              <span className="font-medium text-zinc-200 cursor-pointer">Public</span>
              <p className="text-xs text-zinc-500">Anyone with the link can view bookmarks.</p>
            </div>
          </label>

          <label
            htmlFor="password"
            className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${accessType === "PASSWORD" ? "bg-indigo-500/10 border-indigo-500/50" : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"}`}
          >
            <RadioGroupItem value="PASSWORD" id="password" className="mt-1" />
            <div className="space-y-1">
              <span className="font-medium text-zinc-200 cursor-pointer">Password Protected</span>
              <p className="text-xs text-zinc-500">Require a password to view bookmarks.</p>
            </div>
          </label>

          <label
            htmlFor="discord_gated"
            className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${accessType === "DISCORD_GATED" ? "bg-indigo-500/10 border-indigo-500/50" : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"}`}
          >
            <RadioGroupItem value="DISCORD_GATED" id="discord_gated" className="mt-1" />
            <div className="space-y-1">
              <span className="font-medium text-zinc-200 cursor-pointer">
                Discord Server Member
              </span>
              <p className="text-xs text-zinc-500">
                Only members of a specific Discord server can view.
              </p>
            </div>
          </label>
        </RadioGroup>
      </div>

      {accessType === "PASSWORD" && (
        <div className="space-y-3 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <Label htmlFor="password-input">Set Password</Label>
            <Input
              id="password-input"
              name="password"
              type="password"
              placeholder="Enter new password"
              className="bg-zinc-950 border-zinc-800"
            />
            <p className="text-xs text-zinc-500">Leave blank to keep existing password.</p>
          </div>
        </div>
      )}

      {accessType === "DISCORD_GATED" && (
        <div className="space-y-3 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <Label htmlFor="discordGuildId">Discord Server ID</Label>
            <Input
              id="discordGuildId"
              name="discordGuildId"
              placeholder="e.g. 123456789012345678"
              defaultValue={vault.discordGuildId || ""}
              required
              className="bg-zinc-950 border-zinc-800"
            />
            <p className="text-xs text-zinc-500">
              Right-click your server icon in Discord and select &quot;Copy Server ID&quot;.
            </p>
          </div>
        </div>
      )}

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
