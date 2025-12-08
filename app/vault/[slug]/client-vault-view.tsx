"use client";

import { useState } from 'react';
import { Vault, Category } from '@prisma/client';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DetailSheet } from '@/components/dashboard/detail-sheet';
import { NewBookmarkSheet } from '@/components/dashboard/new-bookmark-sheet';
import { BookmarkWithCategory } from '@/lib/types';
import { VaultHeader } from '@/components/dashboard/vault-view/vault-header';
import { BookmarkGrid } from '@/components/dashboard/vault-view/bookmark-grid';
import { VaultEmptyState } from '@/components/dashboard/vault-view/vault-empty-state';

interface ClientVaultViewProps {
    vault: Vault;
    allVaults: Vault[];
    initialBookmarks: BookmarkWithCategory[];
    initialCategories: Category[];
    isOwner: boolean;
    isMember: boolean;
}

export default function ClientVaultView({
    vault,
    allVaults,
    initialBookmarks,
    initialCategories,
    isOwner,
    isMember
}: ClientVaultViewProps) {
    const [search, setSearch] = useState('');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
    const [selectedBookmark, setSelectedBookmark] = useState<BookmarkWithCategory | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isNewBookmarkOpen, setIsNewBookmarkOpen] = useState(false);

    // Filter bookmarks
    const filteredBookmarks = initialBookmarks.filter(b => {
        const matchesSearch = (b.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (b.description && b.description.toLowerCase().includes(search.toLowerCase())) ||
            b.url.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = activeCategoryFilter ? b.category.name === activeCategoryFilter : true;

        return matchesSearch && matchesCategory;
    });

    const openDetail = (bookmark: BookmarkWithCategory) => {
        setSelectedBookmark(bookmark);
        setIsDetailOpen(true);
    };

    const categoryNames = initialCategories.map(c => c.name);
    const canEdit = isOwner || isMember;

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
                    categories={categoryNames}
                    selectedCategory={activeCategoryFilter}
                    onSelectCategory={setActiveCategoryFilter}
                    totalBookmarks={initialBookmarks.length}
                />

                {/* Main Content Area */}
                <main className="flex-1 px-6 pt-12 pb-10 min-w-0">

                    <VaultHeader
                        vaultName={vault.name}
                        vaultSlug={vault.slug}
                        activeCategory={activeCategoryFilter}
                        bookmarkCount={filteredBookmarks.length}
                        search={search}
                        setSearch={setSearch}
                        isOwner={isOwner}
                    />

                    {/* Content Grid */}
                    {filteredBookmarks.length > 0 ? (
                        <BookmarkGrid
                            bookmarks={filteredBookmarks}
                            canEdit={canEdit}
                            onOpenNew={() => setIsNewBookmarkOpen(true)}
                            onOpenDetail={openDetail}
                        />
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
                />
            )
            }

            <NewBookmarkSheet
                isOpen={isNewBookmarkOpen}
                onClose={() => setIsNewBookmarkOpen(false)}
                vaultId={vault.id}
                categories={categoryNames}
            />

        </div >
    );
}
