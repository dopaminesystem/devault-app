"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionState } from "@/lib/types";


const updateDefaultVaultSchema = z.object({
    vaultId: z.string().min(1, "Vault ID is required"),
});

export async function updateDefaultVault(prevState: ActionState, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    const validation = updateDefaultVaultSchema.safeParse({
        vaultId: formData.get("vaultId"),
    });

    if (!validation.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validation.error.flatten().fieldErrors,
        };
    }

    const { vaultId } = validation.data;

    try {
        const vault = await prisma.vault.findUnique({
            where: { id: vaultId },
            select: { ownerId: true, members: { where: { userId: session.user.id }, select: { userId: true }, take: 1 } },
        });

        if (!vault) {
            return { success: false, message: "Vault not found" };
        }

        const isOwner = vault.ownerId === session.user.id;
        const isMember = vault.members.length > 0;

        if (!isOwner && !isMember) {
            return { success: false, message: "You do not have access to this vault" };
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { defaultVaultId: vaultId },
        });

        revalidatePath("/settings");
        return { success: true, message: "Default vault updated successfully" };
    } catch (error) {
        console.error("Failed to update default vault:", error);
        return { success: false, message: "Failed to update default vault" };
    }
}
