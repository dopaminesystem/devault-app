"use server";

import { z } from "zod";
import { auth, getSession } from "@/lib/auth";
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

export async function createVault(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const session = await getSession();

    if (!session?.user) {
        return {
            success: false,
            message: "Unauthorized",
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

export async function updateVaultSettings(prevState: any, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { message: "Unauthorized" };
    }

    const validatedFields = updateVaultSettingsSchema.safeParse({
        vaultId: formData.get("vaultId"),
        accessType: formData.get("accessType"),
        password: formData.get("password"),
        discordGuildId: formData.get("discordGuildId"),
    });

    if (!validatedFields.success) {
        console.error("Validation error:", validatedFields.error.flatten());
        return { message: "Invalid fields" };
    }

    const { vaultId, accessType, password, discordGuildId } = validatedFields.data;

    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
    });

    if (!vault) {
        return { message: "Vault not found" };
    }

    if (vault.ownerId !== session.user.id) {
        return { message: "Unauthorized" };
    }

    let passwordHash = vault.passwordHash;

    if (accessType === "PASSWORD") {
        if (password && password.length > 0) {
            passwordHash = await hash(password, 10);
        } else if (!passwordHash) {
            return { message: "Password is required for private vaults" };
        }
    } else if (accessType === "DISCORD_GATED") {
        if (!discordGuildId || discordGuildId.trim().length === 0) {
            return { message: "Discord Server ID is required for Discord-gated vaults" };
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

    revalidatePath(`/vault/${vault.slug}`);
    revalidatePath(`/vault/${vault.slug}/settings`);

    return { message: "Settings updated successfully" };
}

export async function joinVault(prevState: any, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
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
    } catch (error) {
        // Ignore unique constraint error if already member
        console.log("User might already be a member", error);
    }

    revalidatePath(`/vault/${vault.slug}`);
    return { success: true, message: "Joined successfully" };
}

const updateVaultSchema = z.object({
    vaultId: z.string(),
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
    description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

export async function updateVault(prevState: any, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { message: "Unauthorized" };
    }

    const validatedFields = updateVaultSchema.safeParse({
        vaultId: formData.get("vaultId"),
        name: formData.get("name"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return { message: "Invalid fields" };
    }

    const { vaultId, name, description } = validatedFields.data;

    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
    });

    if (!vault) {
        return { message: "Vault not found" };
    }

    if (vault.ownerId !== session.user.id) {
        return { message: "Unauthorized" };
    }

    await prisma.vault.update({
        where: { id: vaultId },
        data: {
            name,
            description,
        },
    });

    revalidatePath(`/vault/${vault.slug}`);
    revalidatePath(`/vault/${vault.slug}/settings`);
    revalidatePath("/dashboard");

    return { message: "Vault updated successfully" };
}

export async function deleteVault(prevState: any, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { message: "Unauthorized" };
    }

    const vaultId = formData.get("vaultId") as string;

    if (!vaultId) {
        return { message: "Missing vault ID" };
    }

    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
    });

    if (!vault) {
        return { message: "Vault not found" };
    }

    if (vault.ownerId !== session.user.id) {
        return { message: "Unauthorized" };
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
}
