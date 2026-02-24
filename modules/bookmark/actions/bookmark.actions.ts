"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/shared/auth/auth";
import { prisma } from "@/shared/db/prisma";
import type { ActionState } from "@/shared/types";
import { normalizeUrl } from "@/shared/utils";

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

export async function createBookmark(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  if (!session.user.emailVerified) {
    return { success: false, message: "Email not verified" };
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
    return {
      success: false,
      message: "Invalid fields",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { vaultId, url, title, description, tags, category: categoryName } = validatedFields.data;

  // Parallelize independent DB queries: free tier check and vault details
  const [totalBookmarks, vault] = await Promise.all([
    prisma.bookmark.count({
      where: {
        category: {
          vault: {
            ownerId: session.user.id,
          },
        },
      },
    }),
    prisma.vault.findUnique({
      where: { id: vaultId },
      include: { members: true },
    }),
  ]);

  if (totalBookmarks >= 100) {
    return {
      success: false,
      message: "Free tier limit reached (100 bookmarks). Please upgrade to add more.",
    };
  }

  if (!vault) {
    return { success: false, message: "Vault not found" };
  }

  const isOwner = vault.ownerId === session.user.id;

  if (!isOwner) {
    return { success: false, message: "You do not have permission to add bookmarks to this vault" };
  }

  const tagsArray = tags
    ? tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    : [];

  try {
    /*
     * Category Resolution Logic:
     * Priority 1: Use provided categoryId (existing category selected)
     * Priority 2: Create category from newCategoryName (user typed new name)
     * Priority 3: AI suggestion based on URL/content, falling back to "General"
     */
    const categoryId = formData.get("categoryId") as string;
    const newCategoryName = formData.get("newCategoryName") as string;

    let info_categoryId: string | null = categoryId || null;

    if (!info_categoryId && newCategoryName) {
      const targetName = newCategoryName.trim();

      const existing = await prisma.category.findFirst({
        where: { vaultId, name: targetName },
      });

      if (existing) {
        info_categoryId = existing.id;
      } else {
        const lastCategory = await prisma.category.findFirst({
          where: { vaultId },
          orderBy: { order: "desc" },
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
      // AI fallback: suggest category and tags when nothing is provided
      let targetCategoryName = newCategoryName || categoryName || "General";
      let aiSuggestedTags: string[] = [];

      if (!categoryId && !newCategoryName && !categoryName) {
        try {
          const existingCategories = await prisma.category.findMany({
            where: { vaultId },
            select: { name: true },
          });
          const categoryNames = existingCategories
            .map((c: { name: string }) => c.name)
            .filter((n: string) => n !== "General");
          const { enrichBookmark } = await import("@/modules/bookmark/services/ai.services");
          const aiSuggestion = await enrichBookmark(
            url,
            title || url,
            description || "",
            categoryNames,
          );
          if (aiSuggestion) {
            targetCategoryName = aiSuggestion.category;
            aiSuggestedTags = aiSuggestion.tags || [];
          }
        } catch {}
      }

      if (tagsArray.length === 0 && aiSuggestedTags.length > 0) {
        tagsArray.push(...aiSuggestedTags);
      }

      let cat = await prisma.category.findFirst({ where: { vaultId, name: targetCategoryName } });
      if (!cat) {
        const lastCategory = await prisma.category.findFirst({
          where: { vaultId },
          orderBy: { order: "desc" },
        });
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

export async function updateBookmark(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    categoryName: formData.get("categoryName") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    tags: formData.get("tags") || undefined,
  });

  if (!validatedFields.success) {
    return { success: false, message: "Invalid fields" };
  }

  const { bookmarkId, url, title, description, tags } = validatedFields.data;

  const bookmark = await prisma.bookmark.findUnique({
    where: { id: bookmarkId },
    select: {
      categoryId: true,
      category: { select: { vaultId: true, vault: { select: { ownerId: true, slug: true } } } },
    },
  });

  if (!bookmark) {
    return { success: false, message: "Bookmark not found" };
  }

  const isOwner = bookmark.category.vault.ownerId === session.user.id;

  if (!isOwner) {
    return { success: false, message: "Unauthorized" };
  }

  const tagsArray = tags
    ? tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    : [];

  /*
   * Category Resolution: categoryId → newCategoryName → keep existing
   */
  const targetCategoryId = formData.get("categoryId") as string;
  const targetCategoryName = formData.get("newCategoryName") as string;

  let finalCategoryId = bookmark.categoryId;

  if (targetCategoryId) {
    const cat = await prisma.category.findUnique({ where: { id: targetCategoryId } });
    if (cat && cat.vaultId === bookmark.category.vaultId) {
      finalCategoryId = targetCategoryId;
    }
  } else if (targetCategoryName) {
    const vaultId = bookmark.category.vaultId;
    const existing = await prisma.category.findFirst({
      where: { vaultId, name: targetCategoryName.trim() },
    });

    if (existing) {
      finalCategoryId = existing.id;
    } else {
      const lastCategory = await prisma.category.findFirst({
        where: { vaultId },
        orderBy: { order: "desc" },
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

export async function deleteBookmark(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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
    select: { category: { select: { vault: { select: { ownerId: true, slug: true } } } } },
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
