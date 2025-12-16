"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface LimitAlertModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LimitAlertModal({ open, onOpenChange }: LimitAlertModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Free Tier Limit Reached</DialogTitle>
                    <DialogDescription>
                        You have reached the limit of vaults for the Free tier.
                        Please upgrade to the Pro plan to create unlimited vaults.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/settings">Upgrade to Pro</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
