"use client";

import React from 'react';
import { Layout, Folder, Plus, Trash2, LogOut } from 'lucide-react';
import { VaultSwitcher } from './vault-switcher';
import { Vault, Category } from '@prisma/client';
import { Button } from "@/components/ui/button";

interface SidebarProps {
    vaults: Vault[];
    activeVault: Vault | null;
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (cat: string | null) => void;
    totalBookmarks: number;
    onVaultChange?: (vault: Vault) => void;
    onOpenCreateCategory?: () => void;
    onDeleteCategory?: (category: Category) => void;
}

export function Sidebar({
    vaults,
    activeVault,
    categories,
    selectedCategory,
    onSelectCategory,
    totalBookmarks,
    onVaultChange,
    onOpenCreateCategory,
    onDeleteCategory
}: SidebarProps) {
    const handleSignOut = async () => {
        const { authClient } = await import("@/lib/auth-client");
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/sign-in";
                },
            },
        });
    };

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

                </div>

                {/* Categories */}
                <div className="space-y-1">
                    <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
                        Categories
                        <button
                            onClick={onOpenCreateCategory}
                            className="hover:text-zinc-300 transition-colors"
                        >
                            <Plus size={12} />
                        </button>
                    </h3>
                    {categories.length > 0 ? (
                        categories.map(cat => (
                            <div key={cat.id} className="group flex items-center relative">
                                <Button
                                    variant="ghost"
                                    onClick={() => onSelectCategory(cat.name)}
                                    className={`w-full justify-start gap-3 ${selectedCategory === cat.name
                                        ? 'bg-zinc-900 text-zinc-100'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                >
                                    <Folder size={16} className={`transition-colors ${selectedCategory === cat.name ? 'text-indigo-400 fill-indigo-500/20' : 'text-zinc-600 group-hover:text-zinc-500'}`} />
                                    <span className="truncate">{cat.name}</span>
                                </Button>
                                {onDeleteCategory && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteCategory(cat);
                                        }}
                                        className="absolute right-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-4 text-xs text-zinc-600 italic">No categories yet</div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-8 border-t border-zinc-800/50">
                    <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="w-full justify-start gap-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    );
}
