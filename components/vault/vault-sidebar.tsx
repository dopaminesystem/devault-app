"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreateCategoryForm } from "@/components/vault/create-category-form";
import { Folder } from "lucide-react";

type Category = {
    id: string;
    name: string;
    _count: {
        bookmarks: number;
    };
};

type VaultSidebarProps = {
    vaultId: string;
    slug: string;
    categories: Category[];
    canEdit: boolean;
};

export function VaultSidebar({ vaultId, slug, categories, canEdit }: VaultSidebarProps) {
    const pathname = usePathname();

    return (
        <div className="w-64 flex-shrink-0 border-r bg-muted/10 min-h-[calc(100vh-4rem)] p-4">
            <div className="space-y-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Categories
                    </h2>
                    <div className="space-y-1">
                        <Button
                            asChild
                            variant={pathname === `/vault/${slug}` ? "secondary" : "ghost"}
                            className="w-full justify-start"
                        >
                            <Link href={`/vault/${slug}`}>
                                <Folder className="mr-2 h-4 w-4" />
                                All Bookmarks
                            </Link>
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                asChild
                                variant="ghost" // TODO: Highlight if category selected (need query param or route)
                                className="w-full justify-start"
                            >
                                <Link href={`/vault/${slug}?category=${category.id}`}>
                                    <Folder className="mr-2 h-4 w-4" />
                                    {category.name}
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        {category._count.bookmarks}
                                    </span>
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                {canEdit && (
                    <div className="px-3 py-2">
                        <CreateCategoryForm vaultId={vaultId} />
                    </div>
                )}
            </div>
        </div>
    );
}
