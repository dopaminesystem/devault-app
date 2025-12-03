"use client";

import React from 'react';
import { Layout, Star, Clock, Folder, Plus, Trash2 } from 'lucide-react';
import { VaultSwitcher } from './vault-switcher';
import { Vault } from '@prisma/client';
import { Button } from "@/components/ui/button";

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
                    <Button
                        variant="ghost"
                        onClick={() => onSelectCategory(null)}
                        className={`w-full justify-start gap-3 ${selectedCategory === null
                            ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300'
                            : 'text-zinc-400 hover:text-zinc-100'
                            }`}
                    >
                        <Layout size={16} />
                        All Bookmarks
                        <span className={`ml-auto text-[10px] ${selectedCategory === null ? 'text-indigo-400' : 'text-zinc-600'}`}>
                            {totalBookmarks}
                        </span>
                    </Button>

                    <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-400 hover:text-zinc-100">
                        <Star size={16} />
                        Favorites
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-400 hover:text-zinc-100">
                        <Clock size={16} />
                        Recent
                    </Button>
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
                            <Button
                                key={cat}
                                variant="ghost"
                                onClick={() => onSelectCategory(cat)}
                                className={`w-full justify-start gap-3 group ${selectedCategory === cat
                                    ? 'bg-zinc-900 text-zinc-100'
                                    : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                            >
                                <Folder size={16} className={`transition-colors ${selectedCategory === cat ? 'text-indigo-400 fill-indigo-500/20' : 'text-zinc-600 group-hover:text-zinc-500'}`} />
                                {cat}
                            </Button>
                        ))
                    ) : (
                        <div className="px-3 py-4 text-xs text-zinc-600 italic">No categories yet</div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-8 border-t border-zinc-800/50">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-400 hover:text-red-400 hover:bg-red-950/20">
                        <Trash2 size={16} />
                        Trash
                    </Button>
                </div>
            </div>
        </aside>
    );
}
