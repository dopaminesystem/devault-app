"use server";

import { prisma } from "@/lib/prisma";
import { VaultMember } from "@prisma/client";
import { z } from "zod";
import { auth, getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { normalizeUrl } from "@/lib/utils";

import { ActionState } from "@/lib/types";

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
    tags: z.string().optional(),
    category: z.string().optional(),
});

export async function createBookmark(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    if (!session.user.emailVerified) {
        return { success: false, message: "Email not verified" };
    }

    // Check Free Tier Limit (100 bookmarks total)
    // NOTE: This assumes all users are on free tier currently. 
    // If premium exists, check subscription status here.
    const totalBookmarks = await prisma.bookmark.count({
        where: {
            category: {
                vault: {
                    ownerId: session.user.id
                }
            }
        }
    });

    if (totalBookmarks >= 100) {
        return {
            success: false,
            message: "Free tier limit reached (100 bookmarks). Please upgrade to add more."
        };
    }

    const rawUrl = formData.get("url") as string;
    const normalizedUrl = rawUrl ? normalizeUrl(rawUrl) : "";

    const validatedFields = createBookmarkSchema.safeParse({
        vaultId: formData.get("vaultId"),
        url: normalizedUrl,
        title: formData.get("title") || undefined,
        description: formData.get("description") || undefined,
        tags: formData.get("tags") || undefined,
        category: formData.get("category") || undefined,
    });

    if (!validatedFields.success) {
        console.error("Validation error:", validatedFields.error.flatten());
        return { success: false, message: "Invalid fields", fieldErrors: validatedFields.error.flatten().fieldErrors };
    }

    let { vaultId, url, title, description, tags, category: categoryName } = validatedFields.data;

    // Fallback for new category if passed separately
    const newCategoryName = formData.get("newCategoryName") as string;
    if (!categoryName && newCategoryName) {
        categoryName = newCategoryName;
    }

    // Parse tags
    const tagsArray = tags
        ? tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        : [];

    // Check access
    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
        include: { members: true },
    });

    if (!vault) {
        return { success: false, message: "Vault not found" };
    }

    const isOwner = vault.ownerId === session.user.id;

    if (!isOwner) {
        return { success: false, message: "You do not have permission to add bookmarks to this vault" };
    }

    try {
        // Find or create category
        let targetCategoryName = categoryName?.trim() || "General";

        // AI Magic: If category is General/Empty, try to auto-categorize
        if (targetCategoryName === "General" || !targetCategoryName) {
            try {
                // Fetch all existing categories for context
                const existingCategories = await prisma.category.findMany({
                    where: { vaultId },
                    select: { name: true }
                });

                const categoryNames = existingCategories.map(c => c.name).filter(n => n !== "General");

                // Only call AI if we have the AI module and key
                // Dynamic import to avoid issues if file doesn't exist yet in some envs
                const { suggestCategory } = await import("@/lib/ai");

                // We use title, description, and url for context
                const aiSuggestion = await suggestCategory(
                    url,
                    title || url,
                    description,
                    categoryNames
                );

                if (aiSuggestion) {
                    targetCategoryName = aiSuggestion.category;
                    // Note: We currently don't use the tags in this auto-cat flow, 
                    // but we could add them if we wanted to auto-tag excessively.
                    // For now, just fix the type error.
                }
            } catch (err) {
                console.error("Auto-categorization skipped:", err);
                // Fallback to "General" silently
            }
        }

        let category = await prisma.category.findFirst({
            where: {
                vaultId,
                name: targetCategoryName,
            },
        });

        if (!category) {
            // Get max order
            const lastCategory = await prisma.category.findFirst({
                where: { vaultId },
                orderBy: { order: 'desc' },
            });
            const newOrder = (lastCategory?.order ?? -1) + 1;

            category = await prisma.category.create({
                data: {
                    vaultId,
                    name: targetCategoryName,
                    order: newOrder,
                },
            });
        }

        await prisma.bookmark.create({
            data: {
                categoryId: category.id,
                url,
                title: title || url, // Default title to URL if empty
                description,
                tags: tagsArray,
            },
        });

        revalidatePath(`/v/${vault.slug}`);
        return { success: true, message: "Bookmark added successfully" };

    } catch (error) {
        console.error("Failed to create bookmark:", error);
        return { success: false, message: "Failed to create bookmark" };
    }
}

const updateBookmarkSchema = z.object({
    bookmarkId: z.string(),
    url: z.string().url("Please enter a valid URL"),
    title: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    tags: z.string().optional(),
});

export async function updateBookmark(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    if (!session.user.emailVerified) {
        return { success: false, message: "Email not verified" };
    }

    const rawUrl = formData.get("url") as string;
    const normalizedUrl = rawUrl ? normalizeUrl(rawUrl) : "";

    const validatedFields = updateBookmarkSchema.safeParse({
        bookmarkId: formData.get("bookmarkId"),
        url: normalizedUrl,
        title: formData.get("title"),
        description: formData.get("description"),
        categoryId: formData.get("categoryId"),
        tags: formData.get("tags"),
    });

    if (!validatedFields.success) {
        return { success: false, message: "Invalid fields" };
    }

    const { bookmarkId, url, title, description, categoryId, tags } = validatedFields.data;

    // Parse tags
    const tagsArray = tags
        ? tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        : [];

    const bookmark = await prisma.bookmark.findUnique({
        where: { id: bookmarkId },
        include: { category: { include: { vault: { include: { members: true } } } } },
    });

    if (!bookmark) {
        return { success: false, message: "Bookmark not found" };
    }

    const isOwner = bookmark.category.vault.ownerId === session.user.id;

    if (!isOwner) {
        return { success: false, message: "Unauthorized" };
    }

    // Verify new category belongs to same vault
    const newCategory = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!newCategory || newCategory.vaultId !== bookmark.category.vaultId) {
        return { success: false, message: "Invalid category" };
    }

    await prisma.bookmark.update({
        where: { id: bookmarkId },
        data: {
            url,
            title: title || url,
            description,
            categoryId,
            tags: tagsArray,
        },
    });

    revalidatePath(`/v/${bookmark.category.vault.slug}`);
    return { success: true, message: "Bookmark updated" };
}

export async function deleteBookmark(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const session = await getSession();

    if (!session?.user) {
        return { success: false, message: "Unauthorized" };
    }

    if (!session.user.emailVerified) {
        return { success: false, message: "Email not verified" };
    }

    const bookmarkId = formData.get("bookmarkId") as string;

    if (!bookmarkId) {
        return { success: false, message: "Missing bookmark ID" };
    }

    const bookmark = await prisma.bookmark.findUnique({
        where: { id: bookmarkId },
        include: { category: { include: { vault: { include: { members: true } } } } },
    });

    if (!bookmark) {
        return { success: false, message: "Bookmark not found" };
    }

    const isOwner = bookmark.category.vault.ownerId === session.user.id;

    if (!isOwner) {
        return { success: false, message: "Unauthorized" };
    }

    await prisma.bookmark.delete({
        where: { id: bookmarkId },
    });

    revalidatePath(`/v/${bookmark.category.vault.slug}`);
    return { success: true, message: "Bookmark deleted" };
}
