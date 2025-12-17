"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

interface DiscordConnectionCardProps {
    isConnected: boolean;
    /** If provided, shows when the token expires */
    tokenExpiresAt?: Date | null;
}

export function DiscordConnectionCard({
    isConnected,
    tokenExpiresAt
}: DiscordConnectionCardProps) {
    const [isPending, setIsPending] = useState(false);

    const handleConnect = async () => {
        setIsPending(true);
        await authClient.signIn.social({
            provider: "discord",
            callbackURL: "/settings",
        });
    };

    // Check if token is expired or will expire soon (within 1 day)
    const isTokenExpiringSoon = tokenExpiresAt &&
        new Date(tokenExpiresAt).getTime() < Date.now() + 24 * 60 * 60 * 1000;

    return (
        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center">
                    <FaDiscord className="h-6 w-6 text-[#5865F2]" />
                </div>
                <div>
                    <p className="font-medium text-zinc-200">Discord</p>
                    <p className="text-sm text-zinc-500">
                        {isConnected
                            ? "Your Discord account is linked."
                            : "Connect to access Discord-gated vaults."}
                    </p>
                    {isConnected && isTokenExpiringSoon && (
                        <p className="text-xs text-amber-400 mt-1">
                            ⚠️ Connection needs refresh
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {isConnected ? (
                    <>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Connected
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleConnect}
                            disabled={isPending}
                            className="text-zinc-400 hover:text-[#5865F2] hover:bg-[#5865F2]/10"
                            title="Reconnect Discord to refresh permissions"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            <span className="ml-2 hidden sm:inline">Reconnect</span>
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={handleConnect}
                        disabled={isPending}
                        className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <FaDiscord className="mr-2 h-4 w-4" />
                        )}
                        Connect Discord
                    </Button>
                )}
            </div>
        </div>
    );
}
