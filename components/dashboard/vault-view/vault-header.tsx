import React, { useCallback, useMemo } from 'react';
import { Search, Settings as SettingsIcon, LayoutGrid, List, Share2, UserPlus } from 'lucide-react';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToVault } from "@/app/actions/vault";
import { AccessType } from "@prisma/client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface VaultHeaderProps {
    vaultName: string;
    vaultSlug: string;
    vaultId: string;
    accessType: AccessType;
    activeCategory: string | null;
    bookmarkCount: number;
    search: string;
    setSearch: (value: string) => void;
    isOwner: boolean;
    isMember: boolean;
    isLoggedIn: boolean;
    onOpenCMDK?: () => void;
    searchInputRef?: React.RefObject<HTMLInputElement | null>;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

export function VaultHeader({
    vaultName,
    vaultSlug,
    vaultId,
    accessType,
    activeCategory,
    bookmarkCount,
    search,
    setSearch,
    isOwner,
    isMember,
    isLoggedIn,
    onOpenCMDK,
    searchInputRef,
    viewMode,
    setViewMode
}: VaultHeaderProps) {
    const [isSubscribing, setIsSubscribing] = React.useState(false);
    const [showLoginModal, setShowLoginModal] = React.useState(false);

    // ⚡ PERF: useCallback for event handlers
    const handleShare = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Vault link copied to clipboard");
    }, []);

    // ⚡ PERF: useMemo for computed values
    const showSubscribeButton = useMemo(() =>
        accessType === "PUBLIC" && !isOwner && !isMember
        , [accessType, isOwner, isMember]);

    const handleSubscribe = useCallback(async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        setIsSubscribing(true);
        try {
            const result = await subscribeToVault(vaultId);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Failed to subscribe");
        } finally {
            setIsSubscribing(false);
        }
    }, [isLoggedIn, vaultId]);

    // ⚡ PERF: Memoize callback URL (only changes when slug changes)
    const callbackUrl = useMemo(() =>
        encodeURIComponent(`/v/${vaultSlug}`)
        , [vaultSlug]);

    return (
        <>
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
                            {activeCategory ? activeCategory : 'All Bookmarks'}
                        </h1>
                        <p className="text-zinc-500 mt-2 text-sm">
                            Showing {bookmarkCount} bookmarks
                        </p>
                    </div>

                    {/* Search Bar & Settings */}
                    <div className="flex items-center gap-3 w-full max-w-md">
                        {/* View Toggle */}
                        <div className="flex items-center p-1 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-lg shrink-0">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <List size={16} />
                            </button>
                        </div>

                        {/* Subscribe Button - for public vaults */}
                        {showSubscribeButton && (
                            <Button
                                onClick={handleSubscribe}
                                disabled={isSubscribing}
                                size="sm"
                                className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white border-0 gap-1.5"
                            >
                                {isSubscribing ? (
                                    <>
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Subscribing...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={14} />
                                        <span>Subscribe</span>
                                    </>
                                )}
                            </Button>
                        )}

                        {/* Share URL */}
                        <button
                            onClick={handleShare}
                            title="Share Vault"
                            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
                        >
                            <Share2 size={16} />
                        </button>

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
                                <a href={`/v/${vaultSlug}/settings`}>
                                    <SettingsIcon size={18} />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Login Modal for Subscribe */}
            <AlertDialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <AlertDialogContent showCloseButton>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sign in to subscribe</AlertDialogTitle>
                        <AlertDialogDescription>
                            Save <span className="text-zinc-200 font-medium">{vaultName}</span> to your dashboard
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Link href={`/sign-in?callbackURL=${callbackUrl}`}>
                                Sign In
                            </Link>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Link href={`/sign-up?callbackURL=${callbackUrl}`}>
                                Create Account
                            </Link>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
