"use client";

import type { Category } from "@prisma/client";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { deleteCategory, updateCategory } from "@/app/actions/category";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/types";

interface CategorySettingsDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState: ActionState = {
  message: "",
  success: false,
};

export function CategorySettingsDialog({
  category,
  open,
  onOpenChange,
}: CategorySettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Category Settings</DialogTitle>
          <DialogDescription>Manage your category settings.</DialogDescription>
        </DialogHeader>
        {category && <CategorySettingsContent category={category} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

function CategorySettingsContent({
  category,
  onOpenChange,
}: {
  category: Category;
  onOpenChange: (open: boolean) => void;
}) {
  const [updateState, updateAction, isUpdatePending] = useActionState<ActionState, FormData>(
    updateCategory,
    initialState,
  );
  const [deleteState, deleteAction, isDeletePending] = useActionState<ActionState, FormData>(
    deleteCategory,
    initialState,
  );
  const [name, setName] = useState(category.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Close on success
  useEffect(() => {
    if (updateState?.success || deleteState?.success) {
      onOpenChange(false);
    }
  }, [updateState?.success, deleteState?.success, onOpenChange]);

  return (
    <div className="space-y-6 pt-4">
      {/* Rename Section */}
      <form action={updateAction} className="space-y-4">
        <input type="hidden" name="categoryId" value={category.id} />
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <div className="flex gap-2">
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              autoFocus
            />
            <Button
              type="submit"
              disabled={isUpdatePending || !name.trim() || name === category.name}
              size="sm"
            >
              {isUpdatePending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
        {updateState?.message && !updateState.success && (
          <p className="text-sm text-red-500">{updateState.message}</p>
        )}
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-800" />
        </div>
      </div>

      {/* Delete Section */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-red-400 font-medium text-sm">
          <AlertTriangle size={16} /> Danger Zone
        </div>
        {!confirmDelete ? (
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">Delete this category and all its contents.</p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="h-8 text-xs"
            >
              Delete
            </Button>
          </div>
        ) : (
          <form action={deleteAction} className="space-y-2">
            <input type="hidden" name="categoryId" value={category.id} />
            <p className="text-xs text-red-300">
              Are you sure? This effectively deletes all bookmarks in this category.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmDelete(false)}
                className="h-8 flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:text-zinc-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                className="h-8 flex-1"
                disabled={isDeletePending}
              >
                {isDeletePending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm Delete"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
