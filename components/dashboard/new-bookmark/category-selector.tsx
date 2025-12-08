"use client";

import React, { useRef, useEffect } from 'react';
import { Hash, Plus } from 'lucide-react';

interface CategorySelectorProps {
    categories: string[];
    selectedCategory: string | null;
    onSelect: (category: string) => void;
    isAddingCategory: boolean;
    setIsAddingCategory: (isAdding: boolean) => void;
    newCategoryName: string;
    setNewCategoryName: (name: string) => void;
    onAddCategory: () => void;
    isPending: boolean;
}

export function CategorySelector({
    categories,
    selectedCategory,
    onSelect,
    isAddingCategory,
    setIsAddingCategory,
    newCategoryName,
    setNewCategoryName,
    onAddCategory,
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
            onAddCategory();
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
                        key={cat}
                        type="button"
                        onClick={() => onSelect(cat)}
                        disabled={isPending}
                        className={`px-3 py-1.5 rounded-md border text-xs transition-all duration-200 ${selectedCategory === cat
                            ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                            : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
                {isAddingCategory ? (
                    <div className="relative flex items-center">
                        <input
                            ref={newCategoryInputRef}
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onBlur={onAddCategory}
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
                        onClick={() => setIsAddingCategory(true)}
                        disabled={isPending}
                        className="px-3 py-1.5 rounded-md border border-dashed border-zinc-800 text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors flex items-center gap-1"
                    >
                        <Plus size={10} /> New
                    </button>
                )}
            </div>
            <input type="hidden" name="category" value={selectedCategory || ''} />
            <input type="hidden" name="newCategoryName" value={newCategoryName} />
        </div>
    );
}
