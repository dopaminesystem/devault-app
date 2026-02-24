"use client";

import { Folder, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { deleteCategory } from "@/app/actions/category";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateCategoryForm } from "@/components/vault/create-category-form";
import { cn } from "@/lib/utils";
import { EditCategoryDialog } from "./edit-category-dialog";

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
  const searchParams = useSearchParams();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Delete action
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteCategory, {
    message: "",
    success: false,
  });

  // Close delete dialog on success
  if (deleteState.success && deletingCategory) {
    setDeletingCategory(null);
  }

  return (
    <div className="w-64 flex-shrink-0 border-r bg-muted/10 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Categories</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={
                pathname === `/v/${slug}` && !searchParams.get("category") ? "secondary" : "ghost"
              }
              className="w-full justify-start"
            >
              <Link href={`/v/${slug}`}>
                <Folder className="mr-2 h-4 w-4" />
                All Bookmarks
              </Link>
            </Button>
            {categories.map((category) => (
              <div key={category.id} className="group flex items-center">
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    searchParams.get("category") === category.id &&
                      "bg-accent text-accent-foreground",
                  )}
                >
                  <Link href={`/v/${slug}?category=${category.id}`} className="flex-1 truncate">
                    <Folder className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{category.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {category._count.bookmarks}
                    </span>
                  </Link>
                </Button>
                {canEdit && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingCategory(category)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </div>
        {canEdit && (
          <div className="px-3 py-2">
            <CreateCategoryForm vaultId={vaultId} />
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
        />
      )}

      {/* Delete Alert */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category &quot;{deletingCategory?.name}&quot;.
              Bookmarks in this category will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={deleteAction}>
              <input type="hidden" name="categoryId" value={deletingCategory?.id} />
              <AlertDialogAction
                type="submit"
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
