"use server";

import { auth, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isDiscordMembership } from "@/lib/discord";

import { z } from "zod";

const createSpaceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
    accessType: z.enum(["PUBLIC", "PASSWORD", "DISCORD_GATED"]),
    discordGuildId: z.string().optional(),
    discordRoleId: z.string().optional(),
}).refine((data) => {
    if (data.accessType === "DISCORD_GATED" && !data.discordGuildId) {
        return false;
    }
    return true;
}, {
    message: "Discord Guild ID is required for Discord Gated spaces",
    path: ["discordGuildId"],
});

export type State = {
    errors?: {
        name?: string[];
        slug?: string[];
        accessType?: string[];
        discordGuildId?: string[];
        discordRoleId?: string[];
    };
    message?: string | null;
    success?: boolean;
};

export async function createSpace(prevState: State, formData: FormData): Promise<State> {
    const session = await getSession();

    if (!session) {
        return { message: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const accessType = formData.get("accessType") as any;
    const discordGuildId = formData.get("discordGuildId") as string;
    const discordRoleId = formData.get("discordRoleId") as string;

    const validatedFields = createSpaceSchema.safeParse({
        name,
        slug,
        accessType,
        discordGuildId,
        discordRoleId,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Space.",
        };
    }

    const { data } = validatedFields;

    try {
        const space = await prisma.space.create({
            data: {
                name: data.name,
                slug: data.slug,
                ownerId: session.user.id,
                accessType: data.accessType,
                discordGuildId: data.accessType === "DISCORD_GATED" ? data.discordGuildId : undefined,
                discordRoleId: data.accessType === "DISCORD_GATED" ? data.discordRoleId : undefined,
                members: {
                    create: {
                        userId: session.user.id,
                        role: "OWNER",
                    },
                },
            },
        });
        return { success: true, message: "Space created successfully" };
    } catch (error) {
        console.error(error);
        // Check for unique constraint violation on slug
        if ((error as any).code === 'P2002') {
            return {
                errors: {
                    slug: ["Slug already exists"]
                },
                message: "Failed to create space"
            }
        }
        return { message: "Failed to create space" };
    }
}

export async function getSpace(slug: string) {
    const session = await getSession();

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
        const hasAccess = await isDiscordMembership(
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
