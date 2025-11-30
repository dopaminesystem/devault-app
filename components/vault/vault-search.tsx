"use client";

import * as React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BookmarkDetailSheet } from "@/components/bookmark/bookmark-detail-sheet";

interface Bookmark {
    id: string;
    title: string | null;
    url: string;
    description: string | null;
    category: {
        name: string;
    };
    tags: string[];
}

interface VaultSearchProps {
    bookmarks: Bookmark[];
}

export function VaultSearch({ bookmarks }: VaultSearchProps) {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    const [selectedBookmark, setSelectedBookmark] = React.useState<Bookmark | null>(null);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Search bookmarks...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Bookmarks">
                        {bookmarks.map((bookmark) => (
                            <CommandItem
                                key={bookmark.id}
                                value={`${bookmark.title || ""} ${bookmark.url} ${bookmark.description || ""} ${bookmark.category.name} ${bookmark.tags.join(" ")}`}
                                onSelect={() => {
                                    setOpen(false);
                                    setTimeout(() => {
                                        setSelectedBookmark(bookmark);
                                    }, 100);
                                }}
                            >
                                <div className="flex flex-col">
                                    <span>{bookmark.title || bookmark.url}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {bookmark.category.name}
                                    </span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
            <BookmarkDetailSheet
                bookmark={selectedBookmark}
                open={!!selectedBookmark}
                onOpenChange={(open) => !open && setSelectedBookmark(null)}
            />
        </>
    );
}
