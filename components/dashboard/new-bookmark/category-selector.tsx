import React, { useRef, useEffect } from 'react';
import { Hash, Plus } from 'lucide-react';
import { Category } from '@prisma/client';

interface CategorySelectorProps {
    categories: Category[]; // Now full objects
    selectedCategoryId: string | null;
    onSelectId: (categoryId: string) => void;

    // New Category Logic
    isAddingCategory: boolean;
    setIsAddingCategory: (isAdding: boolean) => void;
    newCategoryName: string;
    setNewCategoryName: (name: string) => void;
    onAddNew: () => void;

    isPending: boolean;
}

export function CategorySelector({
    categories,
    selectedCategoryId,
    onSelectId,
    isAddingCategory,
    setIsAddingCategory,
    newCategoryName,
    setNewCategoryName,
    onAddNew,
    isPending
}: CategorySelectorProps) {
    const newCategoryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAddingCategory && newCategoryInputRef.current) {
            newCategoryInputRef.current.focus();
        }
    }, [isAddingCategory]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onAddNew();
        } else if (e.key === 'Escape') {
            setIsAddingCategory(false);
            setNewCategoryName('');
        }
    };

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <Hash size={12} /> Category
            </label>
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelectId(cat.id)}
                        disabled={isPending}
                        className={`px-3 py-1.5 rounded-md border text-xs transition-all duration-200 ${selectedCategoryId === cat.id
                            ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                            : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}

                {/* Visual feedback for a "New Pending" category that isn't saved yet */}
                {!isAddingCategory && newCategoryName && !selectedCategoryId && (
                    <button
                        type="button"
                        onClick={() => setIsAddingCategory(true)} // Allow editing it
                        className="px-3 py-1.5 rounded-md border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 text-xs shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                    >
                        {newCategoryName} (New)
                    </button>
                )}

                {isAddingCategory ? (
                    <div className="relative flex items-center">
                        <input
                            ref={newCategoryInputRef}
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onBlur={onAddNew}
                            onKeyDown={handleKeyDown}
                            className="w-24 px-3 py-1.5 rounded-md border border-indigo-500/50 bg-zinc-900 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                            placeholder="Type..."
                        />
                        <div className="absolute right-2 pointer-events-none">
                            <span className="text-[9px] text-zinc-500">↵</span>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingCategory(true);
                            onSelectId(""); // Clear selection when starting to add new
                        }}
                        disabled={isPending}
                        className="px-3 py-1.5 rounded-md border border-dashed border-zinc-800 text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors flex items-center gap-1"
                    >
                        <Plus size={10} /> New
                    </button>
                )}
            </div>
        </div>
    );
}
