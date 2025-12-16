"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VaultMember } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hash, compare } from "bcryptjs";
import { isDiscordMembership } from "@/lib/discord";

import { ActionState } from "@/lib/types";

const createVaultSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").max(50, "Slug must be less than 50 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

import { getBookmarks } from "@/app/actions/bookmark";
import { getCategories } from "@/app/actions/category";

/**
 * ⚡ PERF: Fetch all vault page data in parallel
 * Extracts data fetching logic from the page component for reusability and cleanliness
 */
export async function getVaultPageData(vaultId: string, userId?: string) {
    // Run these 3 independent queries in parallel
    const [bookmarksResult, categoriesResult, userVaults] = await Promise.all([
        getBookmarks(vaultId),
        getCategories(vaultId),
        userId
            ? prisma.vault.findMany({
                where: {
                    OR: [
                        { ownerId: userId },
                        { members: { some: { userId: userId } } }
                    ]
                },
                orderBy: { createdAt: "desc" }
            })
            : Promise.resolve([])
    ]);

    return {
        bookmarks: bookmarksResult.bookmarks || [],
        categories: categoriesResult.categories || [],
        allVaults: userVaults
    };
}

export async function createVault(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const session = await getSession();

    if (!session?.user) {
        return {
            success: false,
            message: "Unauthorized",
        };
    }

    if (!session.user.emailVerified) {
        return {
            success: false,
            message: "Email not verified",
        };
    }

    const validatedFields = createVaultSchema.safeParse({
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            fieldErrors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid fields",
        };
    }

    const { name, slug, description } = validatedFields.data;

    try {
        // Enforce 1 vault per user limit
        const existingVault = await prisma.vault.findFirst({
            where: {
                ownerId: session.user.id,
            },
        });

        if (existingVault) {
            return {
                success: false,
                message: "You can only create one vault.",
            };
        }

        // Check if slug is unique
        const existingSlug = await prisma.vault.findUnique({
            where: {
                slug,
            },
        });

        if (existingSlug) {
            return {
                success: false,
                fieldErrors: {
                    slug: ["This URL is already taken."],
                },
                message: "Slug already exists",
            };
        }

        const newVault = await prisma.vault.create({
            data: {
                name,
                slug,
                description,
                ownerId: session.user.id,
                members: {
                    create: {
                        userId: session.user.id,
                        role: "OWNER",
                    }
                }
            },
        });

        // Check if user has a default vault, if not set this one
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { defaultVaultId: true }
        });

        if (!user?.defaultVaultId) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { defaultVaultId: newVault.id }
            });
        }

    } catch (error) {
        console.error("Failed to create vault:", error);
        return {
            success: false,
            message: "Failed to create vault. Please try again.",
        };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
    // This part is unreachable due to redirect, but good for type safety if redirect wasn't here
    return { success: true, message: "Vault created" };
}

export async function getVault(slug: string) {
    const session = await getSession();

    const vault = await prisma.vault.findUnique({
        where: { slug },
        include: {
            owner: true,
            members: true,
        },
    });

    if (!vault) {
        return { error: "Vault not found" };
    }

    // Check access
    const isOwner = session?.user?.id === vault.ownerId;
    const isMember = vault.members.some((m: VaultMember) => m.userId === session?.user?.id);

    if (vault.accessType === "PUBLIC") {
        return { vault };
    }

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    if (isOwner || isMember) {
        return { vault };
    }

    if (vault.accessType === "DISCORD_GATED" && vault.discordGuildId) {
        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const hasAccess = await isDiscordMembership(session.user.id, vault.discordGuildId);
        if (hasAccess) {
            return { vault };
        }
    }

    return { error: "Access denied" };
}

const updateVaultSettingsSchema = z.object({
    vaultId: z.string(),
    accessType: z.enum(["PUBLIC", "PASSWORD", "DISCORD_GATED"]),
    password: z.string().nullable().optional(),
    discordGuildId: z.string().nullable().optional(),
});

export async function updateVaultSettings(prevState: ActionState, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    if (!session.user.emailVerified) {
        return { success: false, message: "Email not verified" };
    }

    const validatedFields = updateVaultSettingsSchema.safeParse({
        vaultId: formData.get("vaultId"),
        accessType: formData.get("accessType"),
        password: formData.get("password"),
        discordGuildId: formData.get("discordGuildId"),
    });

    if (!validatedFields.success) {
        console.error("Validation error:", validatedFields.error.flatten());
        return { success: false, message: "Invalid fields" };
    }

    const { vaultId, accessType, password, discordGuildId } = validatedFields.data;

    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
    });

    if (!vault) {
        return { success: false, message: "Vault not found" };
    }

    if (vault.ownerId !== session.user.id) {
        return { success: false, message: "Unauthorized" };
    }

    let passwordHash = vault.passwordHash;

    if (accessType === "PASSWORD") {
        if (password && password.length > 0) {
            passwordHash = await hash(password, 10);
        } else if (!passwordHash) {
            return { success: false, message: "Password is required for private vaults" };
        }
    } else if (accessType === "DISCORD_GATED") {
        if (!discordGuildId || discordGuildId.trim().length === 0) {
            return { success: false, message: "Discord Server ID is required for Discord-gated vaults" };
        }
        passwordHash = null;
    } else {
        passwordHash = null;
    }

    await prisma.vault.update({
        where: { id: vaultId },
        data: {
            accessType,
            passwordHash,
            discordGuildId: discordGuildId || null, // Allow clearing it
        },
    });

    revalidatePath(`/v/${vault.slug}`);
    revalidatePath(`/v/${vault.slug}/settings`);

    return { success: true, message: "Settings updated successfully" };
}

export async function joinVault(prevState: ActionState, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    if (!session.user.emailVerified) {
        return { success: false, message: "Email not verified" };
    }

    const vaultId = formData.get("vaultId") as string;
    const password = formData.get("password") as string;

    if (!vaultId || !password) {
        return { success: false, message: "Missing fields" };
    }

    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
    });

    if (!vault) {
        return { success: false, message: "Vault not found" };
    }

    if (vault.accessType !== "PASSWORD") {
        return { success: false, message: "This vault does not require a password" };
    }

    if (!vault.passwordHash) {
        // Should not happen if logic is correct, but safe fallback
        return { success: false, message: "Vault configuration error" };
    }

    const isValid = await compare(password, vault.passwordHash);

    if (!isValid) {
        return { success: false, message: "Invalid password" };
    }

    try {
        await prisma.vaultMember.create({
            data: {
                vaultId,
                userId: session.user.id,
                role: "MEMBER",
            },
        });
    } catch {
        // Ignore unique constraint error if already member
    }

    revalidatePath(`/v/${vault.slug}`);
    return { success: true, message: "Joined successfully" };
}

/**
 * ⚡ PERF: Subscribe to a PUBLIC vault (no password required)
 * Uses upsert for single-query operation - idempotent and fast
 */
export async function subscribeToVault(vaultId: string): Promise<ActionState> {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Please sign in to subscribe" };
    }

    if (!session.user.emailVerified) {
        return { success: false, message: "Please verify your email first" };
    }

    // ⚡ PERF: Use select to only fetch needed fields
    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
        select: { id: true, slug: true, accessType: true, ownerId: true }
    });

    if (!vault) {
        return { success: false, message: "Vault not found" };
    }

    if (vault.accessType !== "PUBLIC") {
        return { success: false, message: "This vault is not public" };
    }

    // Don't allow owner to subscribe to their own vault
    if (vault.ownerId === session.user.id) {
        return { success: false, message: "You already own this vault" };
    }

    try {
        // ⚡ PERF: Use upsert for single-query idempotent operation
        // This handles both "already subscribed" and "new subscription" cases
        await prisma.vaultMember.upsert({
            where: {
                vaultId_userId: {
                    vaultId,
                    userId: session.user.id
                }
            },
            update: {}, // No update needed if exists
            create: {
                vaultId,
                userId: session.user.id,
                role: "MEMBER",
            },
        });

        revalidatePath(`/v/${vault.slug}`);
        revalidatePath("/dashboard");
        return { success: true, message: "Subscribed! Vault added to your dashboard." };

    } catch (error) {
        console.error("Subscribe error:", error);
        return { success: false, message: "Failed to subscribe" };
    }
}

/**
 * Unsubscribe from a vault (for non-owner members only)
 */
export async function unsubscribeFromVault(vaultId: string): Promise<ActionState> {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Please sign in" };
    }

    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
        select: { id: true, slug: true, ownerId: true }
    });

    if (!vault) {
        return { success: false, message: "Vault not found" };
    }

    // Owner cannot unsubscribe from their own vault
    if (vault.ownerId === session.user.id) {
        return { success: false, message: "You cannot unsubscribe from your own vault" };
    }

    try {
        await prisma.vaultMember.delete({
            where: {
                vaultId_userId: {
                    vaultId,
                    userId: session.user.id
                }
            }
        });

        revalidatePath(`/v/${vault.slug}`);
        revalidatePath("/dashboard");
        return { success: true, message: "Unsubscribed from vault" };

    } catch {
        return { success: false, message: "Failed to unsubscribe" };
    }
}

const updateVaultSchema = z.object({
    vaultId: z.string(),
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
    description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

export async function updateDefaultVault(prevState: ActionState, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    if (!session.user.emailVerified) {
        return { success: false, message: "Email not verified" };
    }

    const defaultVaultId = formData.get("defaultVaultId") as string | null;

    if (defaultVaultId === undefined) {
        return { success: false, message: "Missing defaultVaultId" };
    }

    // If defaultVaultId is provided, ensure it's a valid vault owned by the user
    if (defaultVaultId) {
        const vault = await prisma.vault.findUnique({
            where: { id: defaultVaultId },
            select: { ownerId: true }
        });

        if (!vault || vault.ownerId !== session.user.id) {
            return { success: false, message: "Invalid vault selected as default" };
        }
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            defaultVaultId: defaultVaultId || null, // Set to null if empty string or not provided
        },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Default vault updated successfully" };
}

export async function updateVault(prevState: ActionState, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    if (!session.user.emailVerified) {
        return { success: false, message: "Email not verified" };
    }

    const validatedFields = updateVaultSchema.safeParse({
        vaultId: formData.get("vaultId"),
        name: formData.get("name"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return { success: false, message: "Invalid fields" };
    }

    const { vaultId, name, description } = validatedFields.data;

    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
    });

    if (!vault) {
        return { success: false, message: "Vault not found" };
    }

    if (vault.ownerId !== session.user.id) {
        return { success: false, message: "Unauthorized" };
    }

    await prisma.vault.update({
        where: { id: vaultId },
        data: {
            name,
            description,
        },
    });

    revalidatePath(`/v/${vault.slug}`);
    revalidatePath(`/v/${vault.slug}/settings`);
    revalidatePath("/dashboard");

    return { success: true, message: "Vault updated successfully" };
}

export async function deleteVault(prevState: ActionState, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    if (!session.user.emailVerified) {
        return { success: false, message: "Email not verified" };
    }

    const vaultId = formData.get("vaultId") as string;

    if (!vaultId) {
        return { success: false, message: "Missing vault ID" };
    }

    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
    });

    if (!vault) {
        return { success: false, message: "Vault not found" };
    }

    if (vault.ownerId !== session.user.id) {
        return { success: false, message: "Unauthorized" };
    }

    // Check if this is the default vault
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { defaultVaultId: true }
    });

    if (user?.defaultVaultId === vaultId) {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { defaultVaultId: null }
        });
    }

    await prisma.vault.delete({
        where: { id: vaultId },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
    return { success: true, message: "Vault deleted" };
}
