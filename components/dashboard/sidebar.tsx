"use client";

import React from 'react';
import { Layout, Star, Clock, Folder, Plus, Trash2 } from 'lucide-react';
import { VaultSwitcher } from './vault-switcher';
import { Vault } from '@prisma/client';

interface SidebarProps {
    vaults: Vault[];
    activeVault: Vault | null;
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (cat: string | null) => void;
    totalBookmarks: number;
    onVaultChange?: (vault: Vault) => void;
}

export function Sidebar({
    vaults,
    activeVault,
    categories,
    selectedCategory,
    onSelectCategory,
    totalBookmarks,
    onVaultChange
}: SidebarProps) {
    return (
        <aside className="hidden lg:block w-72 shrink-0 pt-8 pl-6">
            <div className="sticky top-8 space-y-6">

                {/* Vault Switcher */}
                <VaultSwitcher
                    vaults={vaults}
                    activeVault={activeVault}
                    onVaultChange={onVaultChange}
                />

                {/* Main Navigation */}
                <div className="space-y-1">
                    <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">
                        Library
                    </h3>
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group ${selectedCategory === null
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 border border-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Layout size={16} />
                            All Bookmarks
                        </div>
                        <span className={`text-[10px] ${selectedCategory === null ? 'text-indigo-400' : 'text-zinc-600'}`}>
                            {totalBookmarks}
                        </span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 transition-all border border-transparent">
                        <Star size={16} />
                        Favorites
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 transition-all border border-transparent">
                        <Clock size={16} />
                        Recent
                    </button>
                </div>

                {/* Categories */}
                <div className="space-y-1">
                    <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
                        Collections
                        <button className="hover:text-zinc-300 transition-colors">
                            <Plus size={12} />
                        </button>
                    </h3>
                    {categories.length > 0 ? (
                        categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => onSelectCategory(cat)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${selectedCategory === cat
                                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-sm'
                                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent hover:bg-zinc-900/30'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Folder size={16} className={`transition-colors ${selectedCategory === cat ? 'text-indigo-400 fill-indigo-500/20' : 'text-zinc-600 group-hover:text-zinc-500'}`} />
                                    {cat}
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="px-3 py-4 text-xs text-zinc-600 italic">No categories yet</div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-8 border-t border-zinc-800/50">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-all border border-transparent">
                        <Trash2 size={16} />
                        Trash
                    </button>
                </div>
            </div>
        </aside>
    );
}
