"use server";

import { z } from "zod";
import { auth, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const createCategorySchema = z.object({
    vaultId: z.string(),
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
});

export async function createCategory(prevState: any, formData: FormData) {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    const validatedFields = createCategorySchema.safeParse({
        vaultId: formData.get("vaultId"),
        name: formData.get("name"),
    });

    if (!validatedFields.success) {
        return { success: false, message: "Invalid fields", errors: validatedFields.error.flatten().fieldErrors };
    }

    const { vaultId, name } = validatedFields.data;

    // Check access
    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
        include: { members: true },
    });

    if (!vault) {
        return { success: false, message: "Vault not found" };
    }

    const isOwner = vault.ownerId === session.user.id;
    const isMember = vault.members.some((m: any) => m.userId === session.user.id);

    if (!isOwner && !isMember) {
        return { success: false, message: "You do not have permission to add categories to this vault" };
    }

    try {
        await prisma.category.create({
            data: {
                vaultId,
                name,
                order: 0, // Default order, can be updated later
            },
        });

        revalidatePath(`/vault/${vault.slug}`);
        return { success: true, message: "Category created successfully" };

    } catch (error) {
        console.error("Failed to create category:", error);
        return { success: false, message: "Failed to create category" };
    }
}

export async function getCategories(vaultId: string) {
    try {
        const categories = await prisma.category.findMany({
            where: {
                vaultId,
            },
            orderBy: {
                createdAt: "asc", // Or order field if we implement reordering
            },
            include: {
                _count: {
                    select: { bookmarks: true },
                },
            },
        });
        return { categories };
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return { error: "Failed to fetch categories" };
    }
}
