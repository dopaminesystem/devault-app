"use client";

import React, { useState } from 'react';
import { Search, Plus, Command, Globe, Layout, Star, Clock, Folder, Trash2 } from 'lucide-react';
import { Vault, Bookmark, Category } from '@prisma/client';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DetailSheet } from '@/components/dashboard/detail-sheet';
import { NewBookmarkSheet } from '@/components/dashboard/new-bookmark-sheet';
import { BookmarkWithCategory } from '@/components/dashboard/bookmark-card';
import { deleteBookmark } from '@/app/actions/bookmark';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Helper for badge colors (same as in BookmarkCard)
const getCategoryColor = (categoryName: string) => {
    const colors = [
        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'bg-rose-500/10 text-rose-400 border-rose-500/20',
    ];
    const index = categoryName.length % colors.length;
    return colors[index];
};

interface ClientVaultViewProps {
    vault: Vault;
    allVaults: Vault[];
    initialBookmarks: BookmarkWithCategory[];
    initialCategories: Category[];
}

export default function ClientVaultView({
    vault,
    allVaults,
    initialBookmarks,
    initialCategories
}: ClientVaultViewProps) {
    const [search, setSearch] = useState('');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
    const [selectedBookmark, setSelectedBookmark] = useState<BookmarkWithCategory | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isNewBookmarkOpen, setIsNewBookmarkOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDeleteBookmark = async (id: string) => {
        setIsDeleting(true);
        try {
            const formData = new FormData();
            formData.append("bookmarkId", id);
            await deleteBookmark(null, formData);
            setIsDetailOpen(false);
            // Optimistic update or router refresh could happen here, 
            // but for now we rely on server action revalidation
        } catch (error) {
            console.error("Failed to delete bookmark", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const categoryNames = initialCategories.map(c => c.name);

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

                    {/* Header Section */}
                    <div className="flex flex-col items-start justify-center mb-10 space-y-6">

                        {/* Greeting / Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-500">{vault.name}</span>
                            <span className="text-zinc-700">/</span>
                            <span className="text-zinc-200 font-medium">
                                {activeCategoryFilter || 'All Bookmarks'}
                            </span>
                        </div>

                        <div className="w-full flex flex-col md:flex-row gap-6 md:items-end justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                                    {activeCategoryFilter ? `${activeCategoryFilter} Collection` : 'My Collection'}
                                </h1>
                                <p className="text-zinc-500 mt-2 text-sm">
                                    Showing {filteredBookmarks.length} bookmarks
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="w-full max-w-md relative group">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <Input
                                        type="text"
                                        placeholder={`Search in ${vault.name}...`}
                                        className="pl-10 bg-zinc-900/80 backdrop-blur-xl border-zinc-800"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                        <kbd className="text-[10px] text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5 bg-zinc-900 font-sans">⌘K</kbd>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* Add New Button */}
                        <button
                            onClick={() => setIsNewBookmarkOpen(true)}
                            className="group flex flex-col items-center justify-center h-[180px] border border-dashed border-zinc-800 rounded-2xl hover:bg-zinc-900/30 hover:border-zinc-700 transition-all cursor-pointer bg-zinc-900/10"
                        >
                            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                                <Plus size={20} className="text-zinc-500 group-hover:text-zinc-300" />
                            </div>
                            <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300">New Bookmark</span>
                        </button>

                        {/* Render Bookmarks */}
                        {filteredBookmarks.map((bookmark) => {
                            const hostname = new URL(bookmark.url).hostname;
                            const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`;
                            const categoryColor = getCategoryColor(bookmark.category.name);

                            return (
                                <Card
                                    key={bookmark.id}
                                    onClick={() => openDetail(bookmark)}
                                    className="h-[180px] group hover:-translate-y-1 hover:shadow-indigo-500/10"
                                >
                                    <CardContent className="p-5 h-full flex flex-col justify-between">
                                        <div className="flex items-start justify-between">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-950/50 border border-zinc-800/50 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                                                <img
                                                    src={faviconUrl}
                                                    alt="icon"
                                                    className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                                                />
                                            </div>
                                            <Badge className={`${categoryColor} border opacity-70 group-hover:opacity-100`}>
                                                {bookmark.category.name}
                                            </Badge>
                                        </div>

                                        <div className="mt-2">
                                            <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                                                {bookmark.title}
                                            </h3>
                                            <p className="text-sm text-zinc-500 mt-1 line-clamp-2 group-hover:text-zinc-400 transition-colors">
                                                {bookmark.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 text-xs text-zinc-600 group-hover:text-indigo-400 transition-colors mt-auto pt-2">
                                            <Globe size={10} />
                                            <span className="truncate">{hostname}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredBookmarks.length === 0 && (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900/50 border border-zinc-800 mb-4 shadow-xl">
                                <Command size={24} className="text-zinc-600" />
                            </div>
                            <p className="text-zinc-500">No bookmarks found in this category.</p>
                            <Button variant="link" onClick={() => setActiveCategoryFilter(null)} className="text-indigo-400 mt-2">
                                Clear filter
                            </Button>
                        </div>
                    )}

                </main>

            </div>

            <DetailSheet
                bookmark={selectedBookmark}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onDelete={handleDeleteBookmark}
                isDeleting={isDeleting}
            />

            <NewBookmarkSheet
                isOpen={isNewBookmarkOpen}
                onClose={() => setIsNewBookmarkOpen(false)}
                vaultId={vault.id}
                categories={categoryNames}
            />

        </div>
    );
}
