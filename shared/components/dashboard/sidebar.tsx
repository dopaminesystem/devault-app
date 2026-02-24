"use client";

import type { Category, Vault } from "@prisma/client";
import { Folder, Layout, LogOut, Menu, Plus, Settings } from "lucide-react";
import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { VaultSwitcher } from "./vault-switcher";

interface SidebarProps {
  vaults: Vault[];
  activeVault: Vault | null;
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  totalBookmarks: number;
  onVaultChange?: (vault: Vault) => void;
  onOpenCreateCategory?: () => void;
  onOpenSettings?: (category: Category) => void;
  isLoggedIn: boolean;
}

export function Sidebar(props: SidebarProps) {
  return (
    <aside className="hidden lg:block w-72 shrink-0 pt-8 pl-6">
      <SidebarContent {...props} />
    </aside>
  );
}

export function MobileSidebar(props: SidebarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-zinc-400 hover:text-zinc-100">
          <Menu size={24} />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-ds-canvas border-r border-ds-border p-0">
        <div className="pt-8 pl-6 h-full overflow-y-auto">
          <SidebarContent {...props} onAction={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SidebarContent({
  vaults,
  activeVault,
  categories,
  selectedCategory,
  onSelectCategory,
  totalBookmarks,
  onVaultChange,
  onOpenCreateCategory,
  onOpenSettings,
  isLoggedIn,
  onAction,
}: SidebarProps & { onAction?: () => void }) {
  const handleSignOut = async () => {
    const { authClient } = await import("@/shared/auth/auth-client");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in";
        },
      },
    });
  };

  return (
    <div className="sticky top-8 space-y-6">
      {/* Vault Switcher - shows login modal for guests on create */}
      <VaultSwitcher
        vaults={vaults}
        activeVault={activeVault}
        onVaultChange={(vault) => {
          onVaultChange?.(vault);
          onAction?.();
        }}
        isLoggedIn={isLoggedIn}
      />

      {/* Main Navigation */}
      <div className="space-y-1">
        <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">
          Library
        </h3>
        <Button
          variant="ghost"
          onClick={() => {
            onSelectCategory(null);
            onAction?.();
          }}
          className={`w-full justify-start gap-3 ${
            selectedCategory === null
              ? "bg-ds-brand-subtle text-ds-brand-text hover:bg-ds-brand-subtle hover:text-[--ds-brand-text-dim]"
              : "text-ds-text-secondary hover:text-ds-text-primary"
          }`}
        >
          <Layout size={16} />
          All Bookmarks
          <span
            className={`ml-auto text-[10px] ${selectedCategory === null ? "text-ds-brand-text" : "text-ds-text-muted"}`}
          >
            {totalBookmarks}
          </span>
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-1">
        <h3 className="text-[10px] font-semibold text-ds-text-tertiary uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
          Categories
          <button
            type="button"
            onClick={onOpenCreateCategory}
            className="hover:text-ds-text-primary transition-colors "
          >
            <Plus size={12} />
          </button>
        </h3>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="group flex items-center relative rounded-md hover:bg-ds-surface-hovered cursor-pointer"
            >
              <Button
                variant="ghost"
                onClick={() => {
                  onSelectCategory(cat.name);
                  onAction?.();
                }}
                className={`cursor-pointer w-full justify-start gap-3 hover:bg-transparent ${
                  selectedCategory === cat.name
                    ? "bg-ds-surface text-ds-text-primary"
                    : "text-ds-text-secondary group-hover:text-ds-text-primary"
                }`}
              >
                <Folder
                  size={16}
                  className={`transition-colors ${selectedCategory === cat.name ? "text-ds-brand-text fill-[--comp-sidebar-active-bg]" : "text-ds-text-muted group-hover:text-ds-text-tertiary"}`}
                />
                <span className="truncate">{cat.name}</span>
              </Button>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSettings(cat);
                  }}
                  className="cursor-pointer absolute right-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-all p-1.5 rounded"
                >
                  <Settings size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-xs text-zinc-600 italic">No categories yet</div>
        )}
      </div>

      {/* Bottom Actions - only show for logged in users */}
      {isLoggedIn && (
        <div className="pt-8 border-t border-zinc-800/50">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start gap-3 text-ds-text-secondary hover:text-ds-text-primary hover:bg-ds-surface-hovered"
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
}
