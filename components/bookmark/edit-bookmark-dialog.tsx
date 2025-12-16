"use client";

import { useActionState, useEffect } from "react";
import { updateBookmark } from "@/app/actions/bookmark";
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
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
}

interface EditBookmarkDialogProps {
    bookmark: {
        id: string;
        url: string;
        title: string | null;
        description: string | null;
        categoryId: string;
        tags: string[];
    };
    categories: Category[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const initialState = {
    message: "",
    success: false,
};

export function EditBookmarkDialog({ bookmark, categories, open, onOpenChange }: EditBookmarkDialogProps) {
    const [state, action, isPending] = useActionState(updateBookmark, initialState);

    useEffect(() => {
        if (state.success && open) {
            onOpenChange(false);
        }
    }, [state.success, open, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Bookmark</DialogTitle>
                    <DialogDescription>
                        Update bookmark details.
                    </DialogDescription>
                </DialogHeader>
                <form action={action}>
                    <input type="hidden" name="bookmarkId" value={bookmark.id} />
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                name="url"
                                defaultValue={bookmark.url}
                                required
                                type="url"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={bookmark.title || ""}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={bookmark.description || ""}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="categoryId" defaultValue={bookmark.categoryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                name="tags"
                                defaultValue={bookmark.tags.join(", ")}
                                placeholder="Comma separated tags"
                            />
                        </div>
                        {state?.message && !state.success && (
                            <p className="text-sm text-red-500">{state.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
