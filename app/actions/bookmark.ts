"use server";

import { prisma } from "@/lib/prisma";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getBookmarks(vaultId: string) {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: {
                category: {
                    vaultId: vaultId,
                },
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return { bookmarks };
    } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        return { error: "Failed to fetch bookmarks" };
    }
}

const createBookmarkSchema = z.object({
    vaultId: z.string(),
    url: z.string().url("Please enter a valid URL"),
    title: z.string().optional(),
    description: z.string().optional(),
});

export async function createBookmark(prevState: any, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    const validatedFields = createBookmarkSchema.safeParse({
        vaultId: formData.get("vaultId"),
        url: formData.get("url"),
        title: formData.get("title"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return { success: false, message: "Invalid fields", errors: validatedFields.error.flatten().fieldErrors };
    }

    const { vaultId, url, title, description } = validatedFields.data;

    // Check access
    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
        include: { members: true },
    });

    if (!vault) {
        return { success: false, message: "Vault not found" };
    }

    const isOwner = vault.ownerId === session.user.id;
    const isMember = vault.members.some(m => m.userId === session.user.id);

    if (!isOwner && !isMember) {
        return { success: false, message: "You do not have permission to add bookmarks to this vault" };
    }

    try {
        // Find or create "General" category
        let category = await prisma.category.findFirst({
            where: {
                vaultId,
                name: "General",
            },
        });

        if (!category) {
            category = await prisma.category.create({
                data: {
                    vaultId,
                    name: "General",
                    order: 0,
                },
            });
        }

        await prisma.bookmark.create({
            data: {
                categoryId: category.id,
                url,
                title: title || url, // Default title to URL if empty
                description,
            },
        });

        revalidatePath(`/vault/${vault.slug}`);
        return { success: true, message: "Bookmark added successfully" };

    } catch (error) {
        console.error("Failed to create bookmark:", error);
        return { success: false, message: "Failed to create bookmark" };
    }
}
