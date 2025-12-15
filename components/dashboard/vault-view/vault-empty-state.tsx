import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VaultEmptyStateProps {
    search: string;
    setSearch: (val: string) => void;
    canEdit: boolean;
    onOpenNew: () => void;
}

export function VaultEmptyState({
    search,
    setSearch,
    canEdit,
    onOpenNew
}: VaultEmptyStateProps) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
            {search ? (
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900/50 border border-zinc-800 shadow-xl">
                        <Search size={24} className="text-zinc-600" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-zinc-200">No results found</h3>
                        <p className="text-zinc-500">
                            We couldn&apos;t find anything matching &quot;{search}&quot;
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setSearch('')}
                        className="mt-4"
                    >
                        Clear search
                    </Button>
                </div>
            ) : (
                <div
                    onClick={() => canEdit && onOpenNew()}
                    className={`group relative w-full max-w-md flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10 transition-all text-center space-y-4 ${canEdit ? 'hover:bg-zinc-900/30 hover:border-zinc-700 cursor-pointer' : 'cursor-default opacity-50'
                        }`}
                >
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                        <Plus size={32} className="text-zinc-500 group-hover:text-zinc-300" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-zinc-200 group-hover:text-white transition-colors">
                            No bookmarks in this category
                        </h3>
                        <p className="text-zinc-500 max-w-xs mx-auto group-hover:text-zinc-400 transition-colors">
                            {canEdit
                                ? "Add a new bookmark to this category to get started."
                                : "This category is empty."}
                        </p>
                    </div>
                    {canEdit && (
                        <Button className="mt-4 bg-zinc-100 text-zinc-950 hover:bg-white shadow-lg shadow-indigo-500/10">
                            Create Bookmark
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
