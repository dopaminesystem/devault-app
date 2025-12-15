import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface SearchInputProps {
    vaultName: string;
    search: string;
    setSearch: (value: string) => void;
    searchInputRef?: React.RefObject<HTMLInputElement | null>;
    onOpenCMDK?: () => void;
}

export function SearchInput({
    vaultName,
    search,
    setSearch,
    searchInputRef,
    onOpenCMDK
}: SearchInputProps) {
    return (
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
                <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 cursor-pointer"
                    onClick={onOpenCMDK}
                >
                    <kbd className="text-[10px] text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5 bg-zinc-900 font-sans pointer-events-none">
                        ⌘K
                    </kbd>
                </div>
            </div>
        </div>
    );
}
