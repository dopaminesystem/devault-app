import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

/**
 * Refreshes a Discord access token using the refresh token.
 * Discord access tokens expire after ~7 days, so this ensures seamless API access.
 * 
 * @returns The new access token, or null if refresh failed
 */
async function refreshDiscordToken(accountId: string, refreshToken: string): Promise<string | null> {
    try {
        const response = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: env.DISCORD_CLIENT_ID,
                client_secret: env.DISCORD_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            console.error("Failed to refresh Discord token:", await response.text());
            return null;
        }

        const data = await response.json();

        // Update the account with new tokens
        await prisma.account.update({
            where: { id: accountId },
            data: {
                accessToken: data.access_token,
                refreshToken: data.refresh_token, // Discord rotates refresh tokens
                accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
            },
        });

        return data.access_token;
    } catch (error) {
        console.error("Discord token refresh error:", error);
        return null;
    }
}

/**
 * Gets a valid Discord access token, refreshing if necessary.
 * Checks expiration with 5-minute buffer to prevent edge cases.
 */
async function getValidAccessToken(account: {
    id: string;
    accessToken: string | null;
    refreshToken: string | null;
    accessTokenExpiresAt: Date | null;
}): Promise<string | null> {
    if (!account.accessToken) {
        return null;
    }

    // Check if token is expired or will expire within 5 minutes
    const expirationBuffer = 5 * 60 * 1000; // 5 minutes in ms
    const isExpired = account.accessTokenExpiresAt &&
        new Date(account.accessTokenExpiresAt).getTime() < Date.now() + expirationBuffer;

    if (isExpired) {
        if (!account.refreshToken) {
            console.log("Discord access token expired and no refresh token available");
            return null;
        }

        console.log("Discord access token expired, attempting refresh...");
        return await refreshDiscordToken(account.id, account.refreshToken);
    }

    return account.accessToken;
}

export async function isDiscordMembership(userId: string, guildId: string, roleId?: string) {
    // 1. Get the user's Discord Account
    const account = await prisma.account.findFirst({
        where: {
            userId,
            providerId: "discord",
        },
        select: {
            id: true,
            accountId: true,
            accessToken: true,
            refreshToken: true,
            accessTokenExpiresAt: true,
        }
    });

    if (!account) {
        return false;
    }

    // Strategy 1: Use Bot Token (Preferred - doesn't rely on user's token)
    if (env.DISCORD_BOT_TOKEN) {
        try {
            const response = await fetch(`https://discord.com/api/guilds/${guildId}/members/${account.accountId}`, {
                headers: {
                    Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
                },
            });

            if (response.status === 404) {
                return false;
            }

            if (!response.ok) {
                console.error("Failed to fetch guild member with bot token", await response.text());
                // Fallback to user token if bot fails
            } else {
                const member = await response.json();
                if (roleId) {
                    return member.roles.includes(roleId);
                }
                return true;
            }
        } catch (error) {
            console.error("Discord Bot API error:", error);
            // Fallback to user token
        }
    }

    // Strategy 2: Use User Access Token (Fallback)
    // Get a valid token, refreshing if necessary
    const accessToken = await getValidAccessToken(account);
    if (!accessToken) {
        return false;
    }

    try {
        // Check if user is in the guild
        const response = await fetch(`https://discord.com/api/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch user guilds", await response.text());
            return false;
        }

        const guilds = await response.json();
        const isMember = guilds.some((g: { id: string }) => g.id === guildId);

        if (!isMember) {
            return false;
        }

        if (roleId) {
            const memberResponse = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!memberResponse.ok) {
                console.error("Failed to fetch guild member", await memberResponse.text());
                return false;
            }

            const member = await memberResponse.json();
            return member.roles.includes(roleId);
        }

        return true;
    } catch (error) {
        console.error("Discord API error:", error);
        return false;
    }
}
