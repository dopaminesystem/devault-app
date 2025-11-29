"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useActionState } from "react";
import { EditBookmarkDialog } from "./edit-bookmark-dialog";
import { deleteBookmark } from "@/app/actions/bookmark";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Category {
    id: string;
    name: string;
}

interface BookmarkCardProps {
    bookmark: {
        id: string;
        title: string | null;
        description: string | null;
        url: string;
        image: string | null;
        categoryId: string;
        tags: string[];
        category: {
            id: string;
            name: string;
        };
    };
    categories: Category[];
    canEdit: boolean;
}

export function BookmarkCard({ bookmark, categories, canEdit }: BookmarkCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteState, deleteAction, isDeletePending] = useActionState(deleteBookmark, { message: "", success: false });

    if (deleteState.success && isDeleting) {
        setIsDeleting(false);
    }

    return (
        <>
            <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow group relative">
                {canEdit && (
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-sm">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsDeleting(true)} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                {bookmark.image && (
                    <div className="relative h-48 w-full overflow-hidden">
                        <img
                            src={bookmark.image}
                            alt={bookmark.title || "Bookmark image"}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="line-clamp-2 text-lg">
                            {bookmark.title || bookmark.url}
                        </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-3">
                        {bookmark.description || "No description"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full w-fit">
                        {bookmark.category.name}
                    </div>
                    {bookmark.tags && bookmark.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {bookmark.tags.map((tag) => (
                                <span key={tag} className="text-[10px] text-muted-foreground border px-1.5 py-0.5 rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Link
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        Visit Link <ExternalLink className="h-3 w-3" />
                    </Link>
                </CardFooter>
            </Card>

            {isEditing && (
                <EditBookmarkDialog
                    bookmark={bookmark}
                    categories={categories}
                    open={isEditing}
                    onOpenChange={setIsEditing}
                />
            )}

            <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Bookmark?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this bookmark.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <form action={deleteAction}>
                            <input type="hidden" name="bookmarkId" value={bookmark.id} />
                            <AlertDialogAction
                                type="submit"
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={isDeletePending}
                            >
                                {isDeletePending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </form>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
