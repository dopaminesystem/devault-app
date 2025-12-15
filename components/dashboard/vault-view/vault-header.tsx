import React, { useCallback, useMemo } from 'react';
import { Settings as SettingsIcon, Share2 } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { subscribeToVault } from "@/app/actions/vault";
import { AccessType } from "@prisma/client";
import { VaultBreadcrumb } from "./header-parts/vault-breadcrumb";
import { ViewToggle } from "./header-parts/view-toggle";
import { SubscribeButton } from "./header-parts/subscribe-button";
import { SearchInput } from "./header-parts/search-input";
import { LoginPromptModal } from "./header-parts/login-prompt-modal";

// ============================================================================
// Main Component
// ============================================================================

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

    const callbackUrl = useMemo(() =>
        encodeURIComponent(`/v/${vaultSlug}`)
        , [vaultSlug]);

    return (
        <>
            <div className="flex flex-col items-start justify-center mb-10 space-y-6">
                {/* Breadcrumb */}
                <VaultBreadcrumb vaultName={vaultName} activeCategory={activeCategory} />

                <div className="w-full flex flex-col md:flex-row gap-6 md:items-end justify-between">
                    {/* Title Section */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                            {activeCategory || 'All Bookmarks'}
                        </h1>
                        <p className="text-zinc-500 mt-2 text-sm">
                            Showing {bookmarkCount} bookmarks
                        </p>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-3 w-full max-w-md">
                        {showSubscribeButton && (
                            <SubscribeButton
                                isLoadingSubscription={isSubscribing}
                                onClick={handleSubscribe}
                            />
                        )}
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />


                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            title="Share Vault"
                            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
                        >
                            <Share2 size={16} />
                        </button>

                        <SearchInput
                            vaultName={vaultName}
                            search={search}
                            setSearch={setSearch}
                            searchInputRef={searchInputRef}
                            onOpenCMDK={onOpenCMDK}
                        />

                        {isOwner && (
                            <Button
                                variant="outline"
                                size="icon"
                                asChild
                                className="shrink-0 bg-zinc-900/80 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100"
                            >
                                <a href={`/v/${vaultSlug}/settings`}>
                                    <SettingsIcon size={18} />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            <LoginPromptModal
                open={showLoginModal}
                onOpenChange={setShowLoginModal}
                vaultName={vaultName}
                callbackUrl={callbackUrl}
            />
        </>
    );
}
