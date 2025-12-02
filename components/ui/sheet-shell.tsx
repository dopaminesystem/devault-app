"use client";

import React from 'react';

interface SheetShellProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function SheetShell({ isOpen, onClose, children }: SheetShellProps) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`fixed top-2 right-2 bottom-2 w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-[110%]'}`}>
                {children}
            </div>
        </>
    );
}
