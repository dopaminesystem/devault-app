import Link from "next/link";
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

interface LoginPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaultName: string;
  callbackUrl: string;
}

export function LoginPromptModal({
  open,
  onOpenChange,
  vaultName,
  callbackUrl,
}: LoginPromptModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent showCloseButton>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign in to subscribe</AlertDialogTitle>
          <AlertDialogDescription>
            Save <span className="text-zinc-200 font-medium">{vaultName}</span> to your dashboard
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Link href={`/sign-in?callbackURL=${callbackUrl}`}>Sign In</Link>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href={`/sign-up?callbackURL=${callbackUrl}`}>Create Account</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
