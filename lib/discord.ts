import { prisma } from "@/lib/prisma";

export async function isDiscordMembership(userId: string, guildId: string, roleId?: string) {
    const account = await prisma.account.findFirst({
        where: {
            userId,
            providerId: "discord",
        },
    });

    if (!account || !account.accessToken) {
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
        const isMember = guilds.some((g: any) => g.id === guildId);

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
