import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export async function isDiscordMembership(userId: string, guildId: string, roleId?: string) {
    // 1. Get the user's Discord Account
    const account = await prisma.account.findFirst({
        where: {
            userId,
            providerId: "discord",
        },
    });

    if (!account) {
        return false;
    }

    // Strategy 1: Use Bot Token (Preferred)
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
    if (!account.accessToken) {
        return false;
    }

    try {
        // Check if user is in the guild
        const response = await fetch(`https://discord.com/api/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${account.accessToken}`,
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
                    Authorization: `Bearer ${account.accessToken}`,
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
