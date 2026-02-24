"use client";

import { LogOut } from "lucide-react";
import { useState, useTransition } from "react";
import { unsubscribeFromVault } from "@/modules/vault/actions/vault-member.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";

interface UnsubscribeButtonProps {
  vaultId: string;
  vaultName: string;
}

export function UnsubscribeButton({ vaultId, vaultName }: UnsubscribeButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUnsubscribe = () => {
    startTransition(async () => {
      const result = await unsubscribeFromVault(vaultId);
      if (result.success) {
        window.location.href = "/dashboard";
      }
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
      >
        <LogOut size={16} className="mr-2" />
        Unsubscribe
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsubscribe from {vaultName}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will no longer see this vault in your dashboard. You can rejoin anytime if the
              vault is public.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnsubscribe}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Leaving..." : "Unsubscribe"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
