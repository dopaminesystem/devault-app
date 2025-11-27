"use client";

import { useActionState, useState } from "react";
import { createBookmark } from "@/app/actions/bookmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type CreateBookmarkFormProps = {
    vaultId: string;
};

type CreateBookmarkState = {
    message: string;
    success: boolean;
    errors?: {
        url?: string[];
        title?: string[];
        description?: string[];
    };
};

const initialState: CreateBookmarkState = {
    message: "",
    success: false,
};

export function CreateBookmarkForm({ vaultId }: CreateBookmarkFormProps) {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        const result = await createBookmark(prev, formData);
        if (result.success) {
            setOpen(false);
        }
        return result;
    }, initialState);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bookmark
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Bookmark</DialogTitle>
                    <DialogDescription>
                        Add a new bookmark to your vault.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction}>
                    <input type="hidden" name="vaultId" value={vaultId} />
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                name="url"
                                placeholder="https://example.com"
                                required
                            />
                            {state.errors?.url && (
                                <p className="text-sm text-red-500">{state.errors.url[0]}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title (Optional)</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="My Bookmark"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="A short description..."
                            />
                        </div>
                    </div>
                    {state.message && !state.success && (
                        <p className="text-sm text-red-500 mb-4">{state.message}</p>
                    )}
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Adding..." : "Add Bookmark"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
