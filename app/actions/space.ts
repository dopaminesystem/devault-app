"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkDiscordMembership } from "@/lib/discord";
import { headers } from "next/headers";
import { z } from "zod";

const createSpaceSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    accessType: z.enum(["PUBLIC", "PASSWORD", "DISCORD_GATED"]),
    discordGuildId: z.string().optional(),
    discordRoleId: z.string().optional(),
});

export async function createSpace(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const accessType = formData.get("accessType") as any;
    const discordGuildId = formData.get("discordGuildId") as string;
    const discordRoleId = formData.get("discordRoleId") as string;

    const validation = createSpaceSchema.safeParse({
        name,
        slug,
        accessType,
        discordGuildId,
        discordRoleId,
    });

    if (!validation.success) {
        return { error: "Validation failed" };
    }

    try {
        const space = await prisma.space.create({
            data: {
                name,
                slug,
                ownerId: session.user.id,
                accessType,
                discordGuildId: accessType === "DISCORD_GATED" ? discordGuildId : undefined,
                discordRoleId: accessType === "DISCORD_GATED" ? discordRoleId : undefined,
                members: {
                    create: {
                        userId: session.user.id,
                        role: "OWNER",
                    },
                },
            },
        });
        return { success: true, space };
    } catch (error) {
        console.error(error);
        return { error: "Failed to create space" };
    }
}

export async function getSpace(slug: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const space = await prisma.space.findUnique({
        where: { slug },
        include: {
            owner: true,
        },
    });

    if (!space) {
        return { error: "Space not found" };
    }

    // Access Check
    if (space.accessType === "PUBLIC") {
        return { space };
    }

    if (!session) {
        return { error: "Unauthorized" };
    }

    // Owner always has access
    if (space.ownerId === session.user.id) {
        return { space };
    }

    // Check membership
    const member = await prisma.spaceMember.findUnique({
        where: {
            spaceId_userId: {
                spaceId: space.id,
                userId: session.user.id,
            },
        },
    });

    if (member) {
        return { space };
    }

    if (space.accessType === "DISCORD_GATED") {
        if (!space.discordGuildId) {
            return { error: "Access denied" };
        }
        const hasAccess = await checkDiscordMembership(
            session.user.id,
            space.discordGuildId,
            space.discordRoleId || undefined
        );

        if (hasAccess) {
            return { space };
        }
    }

    return { error: "Access denied" };
}
