"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Vault, Category } from '@prisma/client';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DetailSheet } from '@/components/dashboard/detail-sheet';
import { BookmarkSheet } from '@/components/dashboard/bookmark-sheet';
import { BookmarkWithCategory } from '@/lib/types';
import { VaultHeader } from '@/components/dashboard/vault-view/vault-header';
import { MobileSidebar } from '@/components/dashboard/sidebar';
import { BookmarkGrid } from '@/components/dashboard/vault-view/bookmark-grid';
import { BookmarkList } from '@/components/dashboard/vault-view/bookmark-list';
import { VaultEmptyState } from '@/components/dashboard/vault-view/vault-empty-state';
import { CreateCategoryDialog } from '@/components/dashboard/create-category-dialog';
import { CategorySettingsDialog } from '@/components/dashboard/category-settings-dialog';

interface ClientVaultViewProps {
    vault: Vault;
    allVaults: Vault[];
    initialBookmarks: BookmarkWithCategory[];
    initialCategories: Category[];
    isOwner: boolean;
    isMember: boolean;
    isLoggedIn: boolean;
}

export default function ClientVaultView({
    vault,
    allVaults,
    initialBookmarks,
    initialCategories,
    isOwner,
    isMember,
    isLoggedIn
}: ClientVaultViewProps) {
    const [search, setSearch] = useState('');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
    const [selectedBookmark, setSelectedBookmark] = useState<BookmarkWithCategory | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isNewBookmarkOpen, setIsNewBookmarkOpen] = useState(false);
    const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingBookmark, setEditingBookmark] = useState<BookmarkWithCategory | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter bookmarks
    // ... (keep filtering logic)

    // ... (keep handlers)

    // Listen for Cmd+K to focus search
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // ⚡ PERF: Debounce search to reduce filtering during rapid typing
    // 150ms delay provides snappy feel while avoiding excessive recalculations
    const debouncedSearch = useDebounce(search, 150);

    // Filter bookmarks - memoized to prevent unnecessary recalculations
    // ⚡ PERF: Only recomputes when dependencies change, not on every render
    // Uses debounced search to avoid filtering on every keystroke
    const filteredBookmarks = useMemo(() => {
        return initialBookmarks.filter(b => {
            const matchesSearch = (b.title?.toLowerCase() || '').includes(debouncedSearch.toLowerCase()) ||
                (b.description && b.description.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
                b.url.toLowerCase().includes(debouncedSearch.toLowerCase());

            const matchesCategory = activeCategoryFilter ? b.category.name === activeCategoryFilter : true;

            return matchesSearch && matchesCategory;
        });
    }, [initialBookmarks, debouncedSearch, activeCategoryFilter]);

    const openDetail = (bookmark: BookmarkWithCategory) => {
        setSelectedBookmark(bookmark);
        setIsDetailOpen(true);
    };



    const canEdit = isOwner;

    // Listen for Cmd+K to toggle CMDK


    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 flex justify-center overflow-hidden">

            {/* Decorative Gradients */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-radial-gradient from-blue-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Main Container Layout (Flex) */}
            <div className="relative w-full max-w-7xl flex gap-10 z-10">

                {/* Sidebar Component */}
                <Sidebar
                    vaults={allVaults}
                    activeVault={vault}
                    categories={initialCategories}
                    selectedCategory={activeCategoryFilter}
                    onSelectCategory={setActiveCategoryFilter}
                    totalBookmarks={initialBookmarks.length}
                    onOpenCreateCategory={() => setIsCreateCategoryOpen(true)}
                    onOpenSettings={isOwner ? setEditingCategory : undefined}
                    isLoggedIn={isLoggedIn}
                />

                {/* Main Content Area */}
                <main className="flex-1 px-6 pt-12 pb-10 min-w-0">
                    {/* Mobile Header */}
                    <div className="flex items-center gap-4 mb-4 lg:hidden">
                        <MobileSidebar
                            vaults={allVaults}
                            activeVault={vault}
                            categories={initialCategories}
                            selectedCategory={activeCategoryFilter}
                            onSelectCategory={setActiveCategoryFilter}
                            totalBookmarks={initialBookmarks.length}
                            onOpenCreateCategory={() => setIsCreateCategoryOpen(true)}
                            onOpenSettings={isOwner ? setEditingCategory : undefined}
                            isLoggedIn={isLoggedIn}
                        />
                        <h2 className="text-lg font-bold text-zinc-100 truncate">{vault.name}</h2>
                    </div>

                    {/* Experimental Mobile Mode Banner */}
                    <div className="lg:hidden mb-4 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span>Mobile mode is experimental. Some features may not work as expected.</span>
                    </div>

                    <VaultHeader
                        vaultName={vault.name}
                        vaultSlug={vault.slug}
                        vaultId={vault.id}
                        accessType={vault.accessType}
                        activeCategory={activeCategoryFilter}
                        bookmarkCount={filteredBookmarks.length}
                        search={search}
                        setSearch={setSearch}
                        isOwner={isOwner}
                        isMember={isMember}
                        isLoggedIn={isLoggedIn}
                        onOpenCMDK={() => searchInputRef.current?.focus()}
                        searchInputRef={searchInputRef}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />

                    {/* Content Grid/List */}
                    {filteredBookmarks.length > 0 ? (
                        viewMode === 'grid' ? (
                            <BookmarkGrid
                                bookmarks={filteredBookmarks}
                                canEdit={canEdit}
                                onOpenNew={() => setIsNewBookmarkOpen(true)}
                                onOpenDetail={openDetail}
                                onEdit={(b) => {
                                    setEditingBookmark(b);
                                    setIsNewBookmarkOpen(true);
                                }}
                            />
                        ) : (
                            <BookmarkList
                                bookmarks={filteredBookmarks}
                                canEdit={canEdit}
                                onOpenNew={() => setIsNewBookmarkOpen(true)}
                                onOpenDetail={openDetail}
                                onEdit={(b) => {
                                    setEditingBookmark(b);
                                    setIsNewBookmarkOpen(true);
                                }}
                            />
                        )
                    ) : (
                        <VaultEmptyState
                            search={search}
                            setSearch={setSearch}
                            canEdit={canEdit}
                            onOpenNew={() => setIsNewBookmarkOpen(true)}
                        />
                    )}

                </main>

            </div>


            {selectedBookmark && (
                <DetailSheet
                    key={selectedBookmark.id}
                    bookmark={selectedBookmark}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    isOwner={isOwner}
                    isMember={isMember}
                    onEdit={(b) => {
                        setEditingBookmark(b);
                        setIsNewBookmarkOpen(true);
                        setIsDetailOpen(false); // also close detail so they don't overlap awkwardly
                    }}
                />
            )
            }

            <BookmarkSheet
                isOpen={isNewBookmarkOpen}
                onClose={() => {
                    setIsNewBookmarkOpen(false);
                    setEditingBookmark(null);
                }}
                vaultId={vault.id}
                categories={initialCategories}
                bookmarkToEdit={editingBookmark}
            />

            <CreateCategoryDialog
                vaultId={vault.id}
                open={isCreateCategoryOpen}
                onOpenChange={setIsCreateCategoryOpen}
            />

            {editingCategory && (
                <CategorySettingsDialog
                    category={editingCategory}
                    open={true}
                    onOpenChange={(open) => !open && setEditingCategory(null)}
                />
            )}




        </div>
    );
}
