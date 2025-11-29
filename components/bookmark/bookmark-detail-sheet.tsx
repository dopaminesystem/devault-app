"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Tag, Folder } from "lucide-react";
import Link from "next/link";

interface Bookmark {
    id: string;
    title: string | null;
    url: string;
    description: string | null;
    category: {
        name: string;
    };
    tags?: string[];
    createdAt?: Date;
}

interface BookmarkDetailSheetProps {
    bookmark: Bookmark | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BookmarkDetailSheet({ bookmark, open, onOpenChange }: BookmarkDetailSheetProps) {
    if (!bookmark) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-xl font-bold leading-tight">
                        {bookmark.title || "Untitled Bookmark"}
                    </SheetTitle>
                    <SheetDescription className="break-all">
                        <Link
                            href={bookmark.url}
                            target="_blank"
                            className="flex items-center hover:underline text-primary"
                        >
                            {bookmark.url}
                            <ExternalLink className="ml-2 h-3 w-3" />
                        </Link>
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Description */}
                    {bookmark.description && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {bookmark.description}
                            </p>
                        </div>
                    )}

                    {/* Category */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                            <Folder className="mr-2 h-4 w-4" />
                            Category
                        </h3>
                        <Badge variant="secondary">{bookmark.category.name}</Badge>
                    </div>

                    {/* Tags */}
                    {bookmark.tags && bookmark.tags.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                <Tag className="mr-2 h-4 w-4" />
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {bookmark.tags.map((tag) => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-6 mt-6 border-t">
                        <Button asChild className="w-full">
                            <Link href={bookmark.url} target="_blank">
                                Open Link
                            </Link>
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
