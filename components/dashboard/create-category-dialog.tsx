"use client";

import { useState, useActionState, useEffect } from "react";
import { createCategory } from "@/app/actions/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface CreateCategoryDialogProps {
    vaultId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const initialState = {
    message: "",
    success: false,
};

export function CreateCategoryDialog({ vaultId, open, onOpenChange }: CreateCategoryDialogProps) {
    const [state, formAction, isPending] = useActionState(createCategory, initialState);
    const [name, setName] = useState("");

    // Close on success
    useEffect(() => {
        if (state?.success) {
            onOpenChange(false);
            setName(""); // Reset form
        }
    }, [state?.success, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                    <DialogDescription>
                        Create a new category to organize your bookmarks.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction}>
                    <input type="hidden" name="vaultId" value={vaultId} />
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g. Design Resources"
                                autoFocus
                            />
                        </div>
                    </div>
                    {state?.message && !state.success && (
                        <p className="text-sm text-red-500 mb-4">{state.message}</p>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || !name.trim()}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
