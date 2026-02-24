"use client";

import { Lock } from "lucide-react";
import { useActionState } from "react";
import { joinVault } from "@/modules/vault/actions/vault-member.actions";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { ActionState } from "@/shared/types";

type JoinVaultFormProps = {
  vaultId: string;
  vaultName: string;
};

const initialState: ActionState = {
  message: "",
  success: false,
};

export function JoinVaultForm({ vaultId, vaultName }: JoinVaultFormProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    joinVault,
    initialState,
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle>Join {vaultName}</CardTitle>
          <CardDescription>
            This vault is password protected. Please enter the password to continue.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <input type="hidden" name="vaultId" value={vaultId} />
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter vault password"
                required
              />
            </div>

            {state.message && <p className="text-sm text-red-500 text-center">{state.message}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Joining..." : "Join Vault"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
