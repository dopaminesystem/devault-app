import React from 'react';
import { Search, Settings as SettingsIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VaultHeaderProps {
    vaultName: string;
    vaultSlug: string;
    activeCategory: string | null;
    bookmarkCount: number;
    search: string;
    setSearch: (value: string) => void;
    isOwner: boolean;
    onOpenCMDK?: () => void;
    searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function VaultHeader({
    vaultName,
    vaultSlug,
    activeCategory,
    bookmarkCount,
    search,
    setSearch,
    isOwner,
    onOpenCMDK,
    searchInputRef
}: VaultHeaderProps) {
    return (
        <div className="flex flex-col items-start justify-center mb-10 space-y-6">
            {/* Greeting / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <a href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors">Dashboard</a>
                <span className="text-zinc-700">/</span>
                <span className="text-zinc-500">{vaultName}</span>
                <span className="text-zinc-700">/</span>
                <span className="text-zinc-200 font-medium">
                    {activeCategory || 'All Bookmarks'}
                </span>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-6 md:items-end justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                        {activeCategory ? `${activeCategory} Collection` : 'My Collection'}
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm">
                        Showing {bookmarkCount} bookmarks
                    </p>
                </div>

                {/* Search Bar & Settings */}
                <div className="flex items-center gap-3 w-full max-w-md">
                    <div className="relative group flex-1">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder={`Search in ${vaultName}...`}
                                className="pl-10 bg-zinc-900/80 backdrop-blur-xl border-zinc-800"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                                ref={searchInputRef}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 cursor-pointer" onClick={onOpenCMDK}>
                                <kbd className="text-[10px] text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5 bg-zinc-900 font-sans pointer-events-none">⌘K</kbd>
                            </div>
                        </div>
                    </div>
                    {isOwner && (
                        <Button variant="outline" size="icon" asChild className="shrink-0 bg-zinc-900/80 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100">
                            <a href={`/vault/${vaultSlug}/settings`}>
                                <SettingsIcon size={18} />
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
