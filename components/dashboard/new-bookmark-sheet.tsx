"use client";

import { useState, useEffect, useTransition } from 'react';
import { Save, X } from 'lucide-react';
import { ActionState } from '@/lib/types';
import { createBookmark } from '@/app/actions/bookmark';
import { useActionState } from 'react';
import { SheetShell } from "@/components/ui/sheet-shell";
import { generatePreview } from "@/app/actions/ai";
import { normalizeUrl, cn } from "@/lib/utils";
import { URLInputSection } from './new-bookmark/url-input-section';
import { CategorySelector } from './new-bookmark/category-selector';
import { BookmarkFormFields } from './new-bookmark/bookmark-form-fields';
import { Button } from '@/components/ui/button';
import { TOKENS } from '@/lib/constants';

interface NewBookmarkSheetProps {
    isOpen: boolean;
    onClose: () => void;
    vaultId: string;
    categories: string[];
}

export function NewBookmarkSheet({ isOpen, onClose, vaultId, categories: initialCategories }: NewBookmarkSheetProps) {
    const [categories, setCategories] = useState<string[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Form State
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [isGenerating, startGeneration] = useTransition();
    const initialState: ActionState = { message: "", success: false };
    const [state, formAction, isPending] = useActionState(createBookmark, initialState);

    useEffect(() => {
        if (state?.success) {
            handleClose();
        }
    }, [state]);

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    const handleClose = () => {
        setUrl("");
        setTitle("");
        setDescription("");
        setSelectedCategory(null);
        onClose();
    };

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

    const handleGenerate = () => {
        if (!url) return;
        const urlToGenerate = normalizeUrl(url);
        if (urlToGenerate !== url) setUrl(urlToGenerate);

        startGeneration(async () => {
            const result = await generatePreview(urlToGenerate);
            if (result.success && result.data) {
                setTitle(result.data.title || "");
                setDescription(result.data.aiDescription || "");
            }
        });
    };

    return (
        <SheetShell isOpen={isOpen} onClose={handleClose}>
            <form action={formAction} className="flex flex-col h-full">
                <input type="hidden" name="vaultId" value={vaultId} />

                <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
                    <h2 className="text-lg font-semibold text-zinc-100">Add to Vault</h2>
                    <button type="button" onClick={handleClose} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <URLInputSection
                        url={url}
                        onUrlChange={setUrl}
                        isGenerating={isGenerating}
                        onGenerate={handleGenerate}
                        isPending={isPending}
                    />

                    <BookmarkFormFields
                        title={title}
                        onTitleChange={setTitle}
                        description={description}
                        onDescriptionChange={setDescription}
                        isPending={isPending}
                        isGenerating={isGenerating}
                    />

                    <CategorySelector
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelect={setSelectedCategory}
                        isAddingCategory={isAddingCategory}
                        setIsAddingCategory={setIsAddingCategory}
                        newCategoryName={newCategoryName}
                        setNewCategoryName={setNewCategoryName}
                        onAddCategory={handleAddCategory}
                        isPending={isPending}
                    />

                    {state?.message && !state.success && (
                        <div className="text-sm p-3 rounded-lg bg-red-500/10 text-red-400">
                            {state.message}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/30 flex justify-end gap-3 rounded-b-2xl mt-auto">
                    <Button variant="ghost" type="button" onClick={handleClose} className="text-zinc-400 hover:text-zinc-200">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Adding..." : "Add Bookmark"}
                    </Button>
                </div>
            </form>
        </SheetShell>
    );
}
