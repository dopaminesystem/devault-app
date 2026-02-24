"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { updateCategory } from "@/app/actions/category";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/types";

interface EditCategoryDialogProps {
  category: {
    id: string;
    name: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState: ActionState = {
  message: "",
  success: false,
};

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    updateCategory,
    initialState,
  );

  useEffect(() => {
    if (state.success && open) {
      onOpenChange(false);
    }
  }, [state.success, open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Rename your category.</DialogDescription>
        </DialogHeader>
        <form action={action}>
          <input type="hidden" name="categoryId" value={category.id} />
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={category.name}
                required
                minLength={1}
                maxLength={50}
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
