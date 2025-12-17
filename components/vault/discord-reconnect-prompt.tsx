"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";

interface DiscordReconnectPromptProps {
    vaultName: string;
    reason: "no_discord_account" | "token_expired" | "not_in_guild" | "no_role" | "api_error";
}

const REASON_MESSAGES = {
    no_discord_account: {
        title: "Connect Discord Account",
        description: "This vault requires Discord server membership. Please connect your Discord account to continue.",
        buttonText: "Connect Discord",
    },
    token_expired: {
        title: "Reconnect Discord",
        description: "Your Discord connection needs to be refreshed. This usually happens when permissions have been updated.",
        buttonText: "Reconnect Discord",
    },
    not_in_guild: {
        title: "Join the Discord Server",
        description: "You need to be a member of the required Discord server to access this vault.",
        buttonText: "I've Joined - Retry",
    },
    no_role: {
        title: "Missing Required Role",
        description: "You are in the Discord server, but you don't have the required role to access this vault.",
        buttonText: "I Have the Role - Retry",
    },
    api_error: {
        title: "Connection Error",
        description: "There was an issue checking your Discord membership. Please try reconnecting.",
        buttonText: "Reconnect Discord",
    },
};

export function DiscordReconnectPrompt({ vaultName, reason }: DiscordReconnectPromptProps) {
    const [isPending, setIsPending] = useState(false);
    const messages = REASON_MESSAGES[reason];

    const needsReconnect = reason === "no_discord_account" || reason === "token_expired" || reason === "api_error";

    const handleAction = async () => {
        setIsPending(true);

        if (needsReconnect) {
            // Reconnect to Discord with new scopes
            await authClient.signIn.social({
                provider: "discord",
                callbackURL: window.location.pathname, // Return to same vault page
            });
        } else {
            // Just refresh the page to retry
            window.location.reload();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#5865F2]/10">
                        {needsReconnect ? (
                            <RefreshCw className="h-6 w-6 text-[#5865F2]" />
                        ) : (
                            <AlertTriangle className="h-6 w-6 text-amber-500" />
                        )}
                    </div>
                    <CardTitle>{messages.title}</CardTitle>
                    <CardDescription>
                        {messages.description}
                    </CardDescription>
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

                    {(reason === "not_in_guild" || reason === "no_role") && (
                        <p className="text-xs text-muted-foreground pt-2">
                            After joining the server or getting the role, click the button above to retry.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
