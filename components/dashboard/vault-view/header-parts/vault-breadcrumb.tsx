import React from 'react';

interface VaultBreadcrumbProps {
    vaultName: string;
    activeCategory: string | null;
}

export function VaultBreadcrumb({
    vaultName,
    activeCategory
}: VaultBreadcrumbProps) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <a href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                Dashboard
            </a>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-500">{vaultName}</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-200 font-medium">
                {activeCategory || 'All Bookmarks'}
            </span>
        </div>
    );
}
