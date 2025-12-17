"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";
import {
    DiscordErrorReason,
    DISCORD_ERROR_MESSAGES,
    needsDiscordReconnect
} from "@/lib/constants/discord-messages";

interface DiscordReconnectPromptProps {
    vaultName: string;
    reason: DiscordErrorReason;
}

/**
 * Full-page prompt shown when Discord-gated vault access fails.
 * Composes UI from constants and utility functions.
 */
export function DiscordReconnectPrompt({ vaultName, reason }: DiscordReconnectPromptProps) {
    const [isPending, setIsPending] = useState(false);
    const messages = DISCORD_ERROR_MESSAGES[reason];
    const shouldReconnect = needsDiscordReconnect(reason);

    const handleAction = async () => {
        setIsPending(true);

        if (shouldReconnect) {
            await authClient.signIn.social({
                provider: "discord",
                callbackURL: window.location.pathname,
            });
        } else {
            window.location.reload();
        }
    };

    const IconComponent = shouldReconnect ? RefreshCw : AlertTriangle;
    const iconColorClass = shouldReconnect ? "text-[#5865F2]" : "text-amber-500";
    const showRetryHint = reason === "not_in_guild" || reason === "no_role";

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#5865F2]/10">
                        <IconComponent className={`h-6 w-6 ${iconColorClass}`} />
                    </div>
                    <CardTitle>{messages.title}</CardTitle>
                    <CardDescription>{messages.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Trying to access: <strong>{vaultName}</strong>
                    </p>

                    <Button
                        onClick={handleAction}
                        disabled={isPending}
                        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <FaDiscord className="mr-2 h-4 w-4" />
                        )}
                        {messages.buttonText}
                    </Button>

                    <div className="flex justify-center gap-4 pt-2">
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>

                    {showRetryHint && (
                        <p className="text-xs text-muted-foreground pt-2">
                            After joining the server or getting the role, click the button above to retry.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
