"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Link as LinkIcon, Type, List, Hash, Save, Plus, X } from 'lucide-react';
import { createBookmark } from '@/app/actions/bookmark';
import { useActionState } from 'react';
import { SheetShell } from "@/components/ui/sheet-shell";
import { INPUT_STYLES } from '@/lib/constants';

interface NewBookmarkSheetProps {
    isOpen: boolean;
    onClose: () => void;
    vaultId: string;
    categories: string[]; // Existing categories to choose from
}

export function NewBookmarkSheet({ isOpen, onClose, vaultId, categories: initialCategories }: NewBookmarkSheetProps) {
    const [categories, setCategories] = useState<string[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const newCategoryInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [state, formAction, isPending] = useActionState(createBookmark, null);

    useEffect(() => {
        if (isAddingCategory && newCategoryInputRef.current) {
            newCategoryInputRef.current.focus();
        }
    }, [isAddingCategory]);

    useEffect(() => {
        if (state?.success) {
            onClose();
            // Reset form or show success toast?
        }
    }, [state, onClose]);

    // Update local categories when props change
    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const formattedName = newCategoryName.trim();
            if (!categories.includes(formattedName)) {
                setCategories([...categories, formattedName]);
            }
            setSelectedCategory(formattedName);
            setNewCategoryName('');
            setIsAddingCategory(false);
        } else {
            setIsAddingCategory(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCategory();
        } else if (e.key === 'Escape') {
            setIsAddingCategory(false);
            setNewCategoryName('');
        }
    };

    return (
        <SheetShell isOpen={isOpen} onClose={onClose}>
            <form action={formAction} className="flex flex-col h-full">
                <input type="hidden" name="vaultId" value={vaultId} />
                {/* Hidden input for category since we use state for selection */}
                <input type="hidden" name="category" value={selectedCategory || ''} />

                <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
                    <h2 className="text-lg font-semibold text-zinc-100">Add to Vault</h2>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            <LinkIcon size={12} /> URL
                        </label>
                        <input
                            name="url"
                            type="text"
                            placeholder="https://example.com"
                            className={INPUT_STYLES}
                            autoFocus
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            <Type size={12} /> Title
                        </label>
                        <input
                            name="title"
                            type="text"
                            placeholder="e.g., Amazing Design Tool"
                            className={INPUT_STYLES}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            <List size={12} /> Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="What makes this link special?"
                            className={`${INPUT_STYLES} resize-none`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            <Hash size={12} /> Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
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
                                        onBlur={handleAddCategory}
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
                                    className="px-3 py-1.5 rounded-md border border-dashed border-zinc-800 text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors flex items-center gap-1"
                                >
                                    <Plus size={10} /> New
                                </button>
                            )}
                        </div>
                    </div>

                    {state?.message && (
                        <div className={`text-sm p-3 rounded-lg ${state.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {state.message}
                        </div>
                    )}

                </div>
                <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/30 flex justify-end gap-3 rounded-b-2xl mt-auto">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors"
                    >
                        {isPending ? 'Saving...' : <><Save size={16} /> Save Bookmark</>}
                    </button>
                </div>
            </form>
        </SheetShell>
    );
}
