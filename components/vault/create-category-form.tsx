"use client";

import { Plus } from "lucide-react";
import { useActionState, useState } from "react";
import { createCategory } from "@/app/actions/category";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateCategoryFormProps = {
  vaultId: string;
};

const initialState = {
  message: "",
  success: false,
};

import type { ActionState } from "@/lib/types";

// ... (existing imports, but I need to be careful with replace)

export function CreateCategoryForm({ vaultId }: CreateCategoryFormProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const result = await createCategory(prev, formData);
      if (result.success) {
        setOpen(false);
      }
      return result;
    },
    initialState,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>Create a new category to organize your bookmarks.</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="vaultId" value={vaultId} />
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="e.g., Design, Development" required />
            </div>
          </div>
          {state.message && !state.success && (
            <p className="text-sm text-red-500 mb-4">{state.message}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
