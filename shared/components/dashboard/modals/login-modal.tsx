"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  callbackUrl?: string;
}

export function LoginModal({
  open,
  onOpenChange,
  title = "Sign in to continue",
  description = "Create a free account to start saving bookmarks",
  callbackUrl = "/dashboard",
}: LoginModalProps) {
  const signInUrl = callbackUrl
    ? `/sign-in?callbackURL=${encodeURIComponent(callbackUrl)}`
    : "/sign-in";
  const signUpUrl = callbackUrl
    ? `/sign-up?callbackURL=${encodeURIComponent(callbackUrl)}`
    : "/sign-up";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" asChild>
            <Link href={signInUrl}>Sign In</Link>
          </Button>
          <Button asChild>
            <Link href={signUpUrl}>Create Account</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
