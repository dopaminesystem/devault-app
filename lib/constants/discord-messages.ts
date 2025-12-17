export type DiscordErrorReason =
    | "no_discord_account"
    | "token_expired"
    | "not_in_guild"
    | "no_role"
    | "api_error";

interface ReasonMessage {
    title: string;
    description: string;
    buttonText: string;
}

/**
 * Maps Discord error reasons to user-friendly messages.
 * Single responsibility: Message content only.
 */
export const DISCORD_ERROR_MESSAGES: Record<DiscordErrorReason, ReasonMessage> = {
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

/**
 * Check if a Discord error reason requires OAuth reconnection.
 */
export function needsDiscordReconnect(reason: DiscordErrorReason): boolean {
    return reason === "no_discord_account" || reason === "token_expired" || reason === "api_error";
}
