"use client";

import { useState } from 'react';
import { ChevronsUpDown, Check, Plus, Box, Briefcase, Lock } from 'lucide-react';
import { Vault } from '@prisma/client';
import { useRouter } from 'next/navigation';

// Helper to get icon and color based on vault index or hash
const getVaultStyle = (index: number) => {
    const styles = [
        { icon: Box, color: 'bg-emerald-500', shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
        { icon: Briefcase, color: 'bg-blue-500', shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]' },
        { icon: Lock, color: 'bg-rose-500', shadow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]' },
        { icon: Box, color: 'bg-purple-500', shadow: 'shadow-[0_0_10px_rgba(168,85,247,0.5)]' },
        { icon: Briefcase, color: 'bg-amber-500', shadow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
    ];
    return styles[index % styles.length];
};

interface VaultSwitcherProps {
    vaults: Vault[];
    activeVault: Vault | null;
    onVaultChange?: (vault: Vault) => void;
}

export function VaultSwitcher({
    vaults,
    activeVault,
    onVaultChange
}: VaultSwitcherProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleVaultChange = (vault: Vault) => {
        if (onVaultChange) {
            onVaultChange(vault);
        }
        router.push(`/vault/${vault.slug}`);
        setIsOpen(false);
    };

    const vaultIndex = activeVault ? vaults.findIndex(v => v.id === activeVault.id) : -1;
    const activeStyle = activeVault ? getVaultStyle(vaultIndex >= 0 ? vaultIndex : 0) : getVaultStyle(0);
    const ActiveIcon = activeStyle.icon;

    return (
        <div className="relative mb-8">
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative z-50 w-full flex items-center justify-between p-2 rounded-xl border transition-all duration-200 group ${isOpen ? 'bg-zinc-900 border-zinc-700' : 'bg-transparent border-transparent hover:bg-zinc-900/50 hover:border-zinc-800'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition-colors`}>
                        {activeVault ? <ActiveIcon size={14} className="text-zinc-400" /> : <Box size={14} className="text-zinc-400" />}
                    </div>
                    <div className="text-left">
                        <div className="text-xs text-zinc-500 font-medium">Vault</div>
                        <div className="text-sm font-bold text-zinc-100 leading-none truncate max-w-[120px]">
                            {activeVault ? activeVault.name : "Select Vault"}
                        </div>
                    </div>
                </div>
                <ChevronsUpDown size={14} className="text-zinc-500" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-zinc-950/95 border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden animation-in fade-in zoom-in-95 duration-200 p-1">
                    <div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                        Select Vault
                    </div>
                    {vaults.map((vault, index) => {
                        const style = getVaultStyle(index);
                        const isActive = activeVault?.id === vault.id;
                        return (
                            <button
                                key={vault.id}
                                onClick={() => handleVaultChange(vault)}
                                className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-all mb-0.5 ${isActive
                                    ? 'bg-zinc-800 text-zinc-100'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${style.color} ${isActive ? style.shadow : ''}`} />
                                    <span className="truncate">{vault.name}</span>
                                </div>
                                {isActive && <Check size={14} className="text-zinc-400 shrink-0" />}
                            </button>
                        );
                    })}
                    <div className="h-px bg-zinc-800 my-1" />
                    <button
                        onClick={() => router.push('/dashboard?newVault=true')}
                        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all"
                    >
                        <Plus size={14} />
                        Create new vault
                    </button>
                </div>
            )}
        </div>
    );
}
