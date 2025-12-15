import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

export function ViewToggle({
    viewMode,
    setViewMode
}: ViewToggleProps) {
    return (
        <div className="flex items-center p-1 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-lg shrink-0">
            <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <LayoutGrid size={16} />
            </button>
            <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <List size={16} />
            </button>
        </div>
    );
}
