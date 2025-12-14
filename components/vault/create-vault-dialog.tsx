"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const CreateVaultForm = dynamic(
    () => import("./create-vault-form").then((mod) => mod.CreateVaultForm),
    {
        loading: () => (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                <p className="text-sm text-zinc-500">Loading form...</p>
            </div>
        ),
    }
);

export function CreateVaultDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors gap-4 cursor-pointer group h-full min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Plus size={24} className="text-zinc-500 group-hover:text-zinc-300" />
                    </div>
                    <p className="text-sm text-zinc-500 font-medium group-hover:text-zinc-300">Create New Vault</p>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Vault</DialogTitle>
                    <DialogDescription>
                        Create a new vault to organize your bookmarks.
                    </DialogDescription>
                </DialogHeader>
                <CreateVaultForm hideCardWrapper />
            </DialogContent>
        </Dialog>
    );
}
