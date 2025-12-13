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

    // Parse tags
    const tagsArray = tags
        ? tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        : [];

    try {
        // DUAL FIELD LOGIC (Option 2)
        const categoryId = formData.get("categoryId") as string;
        const newCategoryName = formData.get("newCategoryName") as string;

        let info_categoryId: string | null = categoryId || null;

        // If no ID provided, but we have a new name, create it
        if (!info_categoryId && newCategoryName) {
            const targetName = newCategoryName.trim();

            // Reuse existing if found by name (safety check)
            const existing = await prisma.category.findFirst({
                where: { vaultId, name: targetName }
            });

            if (existing) {
                info_categoryId = existing.id;
            } else {
                // Create real new one
                const lastCategory = await prisma.category.findFirst({
                    where: { vaultId },
                    orderBy: { order: 'desc' },
                });
                const newOrder = (lastCategory?.order ?? -1) + 1;

                const newCat = await prisma.category.create({
                    data: {
                        vaultId,
                        name: targetName,
                        order: newOrder,
                    },
                });
                info_categoryId = newCat.id;
            }
        } else if (!info_categoryId) {
            // Fallback: If logic 1 & 2 failed, maybe Zod 'category' field was used (e.g. from old code path or fallback)
            // Or use "General" / AI.

            let targetCategoryName = newCategoryName || categoryName || "General";

            // AI Magic Fallback only if we really have no category
            if (!categoryId && !newCategoryName && !categoryName) {
                try {
                    const existingCategories = await prisma.category.findMany({
                        where: { vaultId },
                        select: { name: true }
                    });
                    const categoryNames = existingCategories.map(c => c.name).filter(n => n !== "General");
                    const { suggestCategory } = await import("@/lib/ai");
                    const aiSuggestion = await suggestCategory(url, title || url, description, categoryNames);
                    if (aiSuggestion) targetCategoryName = aiSuggestion.category;
                } catch (e) { }
            }

            // Find or create "General" or AI suggestion or Legacy name
            let cat = await prisma.category.findFirst({ where: { vaultId, name: targetCategoryName } });
            if (!cat) {
                const lastCategory = await prisma.category.findFirst({ where: { vaultId }, orderBy: { order: 'desc' } });
                cat = await prisma.category.create({
                    data: { vaultId, name: targetCategoryName, order: (lastCategory?.order ?? -1) + 1 },
                });
            }
            info_categoryId = cat.id;
        }

        if (!info_categoryId) throw new Error("Category resolution failed");

        await prisma.bookmark.create({
            data: {
                categoryId: info_categoryId,
                url,
                title: title || url,
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
    categoryName: z.string().optional(),
    categoryId: z.string().optional(),
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
        categoryName: formData.get("categoryName"),
        categoryId: formData.get("categoryId"),
        tags: formData.get("tags"),
    });

    if (!validatedFields.success) {
        return { success: false, message: "Invalid fields" };
    }

    const { bookmarkId, url, title, description, categoryName, categoryId, tags } = validatedFields.data;

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

    // Parse tags
    const tagsArray = tags
        ? tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        : [];

    // DUAL FIELD LOGIC for Update
    // 1. If categoryId provided -> link to it.
    // 2. If newCategoryName provided -> create & link.
    // 3. Else -> keep existing.

    // Note: Zod parses them as optional strings logic above, but createBookmark handled it manually from formData
    // because Zod schema names might not match form names perfectly in my previous step diffs. 
    // Let's rely on manually getting from formData for consistency with createBookmark change

    const targetCategoryId = formData.get("categoryId") as string;
    const targetCategoryName = formData.get("newCategoryName") as string;

    let finalCategoryId = bookmark.categoryId;

    if (targetCategoryId) {
        // Option A: User picked an existing category
        // Verify it belongs to same vault
        const cat = await prisma.category.findUnique({ where: { id: targetCategoryId } });
        if (cat && cat.vaultId === bookmark.category.vaultId) {
            finalCategoryId = targetCategoryId;
        }
    } else if (targetCategoryName) {
        // Option B: User typed a new name
        const vaultId = bookmark.category.vaultId;
        // Reuse existing if found by name (safety check)
        const existing = await prisma.category.findFirst({
            where: { vaultId, name: targetCategoryName.trim() }
        });

        if (existing) {
            finalCategoryId = existing.id;
        } else {
            // Create real new one
            const lastCategory = await prisma.category.findFirst({
                where: { vaultId },
                orderBy: { order: 'desc' },
            });
            const newOrder = (lastCategory?.order ?? -1) + 1;

            const newCat = await prisma.category.create({
                data: {
                    vaultId,
                    name: targetCategoryName.trim(),
                    order: newOrder,
                },
            });
            finalCategoryId = newCat.id;
        }
    }

    await prisma.bookmark.update({
        where: { id: bookmarkId },
        data: {
            url,
            title: title || url,
            description,
            categoryId: finalCategoryId,
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
