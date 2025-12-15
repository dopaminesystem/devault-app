"use client";

import { useState, useEffect, useTransition } from 'react';
import { Save, X } from 'lucide-react';
import { ActionState } from '@/lib/types';
import { createBookmark, updateBookmark } from '@/app/actions/bookmark';
import { magicGenerate } from "@/app/actions/ai";
import { useActionState } from 'react';
import { SheetShell } from "@/components/ui/sheet-shell";
import { normalizeUrl, cn } from "@/lib/utils";
import { URLInputSection } from './new-bookmark/url-input-section';
import { CategorySelector } from './new-bookmark/category-selector';
import { BookmarkFormFields } from './new-bookmark/bookmark-form-fields';
import { Button } from '@/components/ui/button';
import { TOKENS } from '@/lib/constants';
import { BookmarkWithCategory } from '@/lib/types';

import { Category } from '@prisma/client';

interface BookmarkSheetProps {
    isOpen: boolean;
    onClose: () => void;
    vaultId: string;
    categories: Category[]; // Now accepts full objects
    bookmarkToEdit?: BookmarkWithCategory | null;
}

export function BookmarkSheet({ isOpen, onClose, vaultId, categories: initialCategories, bookmarkToEdit }: BookmarkSheetProps) {
    const isEditMode = !!bookmarkToEdit;

    // Manage Categories Locally (just in case they add one mid-flow, though redundant with dual-field)
    // Actually, for Dual Field, we just need to know if they selected an existing ID or typed a new name.
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    // DUAL FIELD STATE
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    // UI Logic for adding
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    // Form State
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");

    const [isGenerating, startGeneration] = useTransition();
    const initialState: ActionState = { message: "", success: false };

    // We need to wrap the action to pass extra arguments if editing
    const action = isEditMode ? updateBookmark : createBookmark;
    const [state, formAction, isPending] = useActionState(action, initialState);

    useEffect(() => {
        if (state?.success) {
            handleClose();
        }
    }, [state]);

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    // Initialize fields when opening in edit mode
    useEffect(() => {
        if (isOpen && bookmarkToEdit) {
            setUrl(bookmarkToEdit.url);
            setTitle(bookmarkToEdit.title || "");
            setDescription(bookmarkToEdit.description || "");
            setTags(bookmarkToEdit.tags.join(", "));

            // Pre-select existing category ID
            if (bookmarkToEdit.categoryId) {
                setSelectedCategoryId(bookmarkToEdit.categoryId);
                setNewCategoryName("");
            }
        } else if (isOpen && !bookmarkToEdit) {
            // Reset if opening in create mode
            setUrl("");
            setTitle("");
            setDescription("");
            setTags("");
            setSelectedCategoryId(null);
            setNewCategoryName("");
        }
    }, [isOpen, bookmarkToEdit]);

    const handleClose = () => {
        onClose();
        // Delay reset slightly to avoid UI flicker during close animation
        setTimeout(() => {
            setUrl("");
            setTitle("");
            setDescription("");
            setTags("");
            setSelectedCategoryId(null);
            setNewCategoryName("");
        }, 300);
    };

    // When selecting an existing ID
    const handleSelectId = (id: string) => {
        setSelectedCategoryId(id);
        setNewCategoryName("");
        setIsAddingCategory(false);
    };

    // When adding a new name (just confirms the input, doesn't add to list yet)
    const handleAddNew = () => {
        if (newCategoryName.trim()) {
            setSelectedCategoryId(null); // Clear ID, we are using name now
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
            const result = await magicGenerate(urlToGenerate, vaultId);

            // Type narrowing: check for error first
            if ('error' in result) {
                console.error("Magic generate failed:", result.error);
                return;
            }

            // Now TypeScript knows result has success properties
            if (result.title) setTitle(result.title);
            if (result.description) setDescription(result.description);

            // Handle Category - always try to set it
            if (result.category) {
                const matched = categories.find(c => c.name.toLowerCase() === result.category.toLowerCase());

                if (matched) {
                    setSelectedCategoryId(matched.id);
                    setNewCategoryName("");
                } else {
                    // New Category Suggestion from AI
                    setSelectedCategoryId(null);
                    setNewCategoryName(result.category);
                }
            }

            // Always try to set tags if available
            if (result.tags && result.tags.length > 0) {
                setTags(result.tags.join(", "));
            }
        });
    };

    return (
        <SheetShell isOpen={isOpen} onClose={handleClose}>
            <form action={formAction} className="flex flex-col h-full">
                <input type="hidden" name="vaultId" value={vaultId} />

                {/* DUAL FIELD INPUTS: One of these will be populated */}
                <input type="hidden" name="categoryId" value={selectedCategoryId || ""} />
                <input type="hidden" name="newCategoryName" value={newCategoryName} />

                {isEditMode && bookmarkToEdit && (
                    <input type="hidden" name="bookmarkId" value={bookmarkToEdit.id} />
                )}

                <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
                    <h2 className="text-lg font-semibold text-zinc-100">
                        {isEditMode ? "Edit Bookmark" : "Add to Vault"}
                    </h2>
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
                        tags={tags}
                        onTagsChange={setTags}
                        isPending={isPending}
                        isGenerating={isGenerating}
                    />

                    <CategorySelector
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectId={handleSelectId}
                        isAddingCategory={isAddingCategory}
                        setIsAddingCategory={setIsAddingCategory}
                        newCategoryName={newCategoryName}
                        setNewCategoryName={setNewCategoryName}
                        onAddNew={handleAddNew}
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
                        {isPending ? "Saving..." : (isEditMode ? "Save Changes" : "Add Bookmark")}
                    </Button>
                </div>
            </form>
        </SheetShell >
    );
}
