"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/shared/auth/auth";
import { prisma } from "@/shared/db/prisma";

import type { ActionState } from "@/shared/types";

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

const updateVaultSchema = z.object({
    vaultId: z.string(),
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be less than 50 characters"),
    description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

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

    const [vault, user] = await Promise.all([
        prisma.vault.findUnique({ where: { id: vaultId }, select: { ownerId: true } }),
        prisma.user.findUnique({ where: { id: session.user.id }, select: { defaultVaultId: true } }),
    ]);

    if (!vault) {
        return { success: false, message: "Vault not found" };
    }

    if (vault.ownerId !== session.user.id) {
        return { success: false, message: "Unauthorized" };
    }

    // Clear default vault reference if this is the user's default
    if (user?.defaultVaultId === vaultId) {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { defaultVaultId: null },
        });
    }

    await prisma.vault.delete({
        where: { id: vaultId },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
    return { success: true, message: "Vault deleted" };
}
