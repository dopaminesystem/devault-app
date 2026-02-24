"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { checkDiscordMembership } from "@/modules/vault/services/vault.services";
import { getSession } from "@/shared/auth/auth";
import { prisma } from "@/shared/db/prisma";

import type { ActionState } from "@/shared/types";

const createVaultSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

import { getBookmarks } from "@/modules/bookmark/actions/bookmark.actions";
import { getCategories } from "@/modules/vault/actions/category.actions";

/** Fetch all vault page data in parallel for optimal performance */
export async function getVaultPageData(vaultId: string, userId?: string) {
  const [bookmarksResult, categoriesResult, userVaults] = await Promise.all([
    getBookmarks(vaultId),
    getCategories(vaultId),
    userId
      ? prisma.vault.findMany({
          where: {
            OR: [{ ownerId: userId }, { members: { some: { userId: userId } } }],
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  return {
    bookmarks: bookmarksResult.bookmarks || [],
    categories: categoriesResult.categories || [],
    allVaults: userVaults,
  };
}

export async function createVault(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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
    // Enforce 1 vault per user limit (free tier)
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
          },
        },
      },
    });

    // Set as default vault if user doesn't have one
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { defaultVaultId: true },
    });

    if (!user?.defaultVaultId) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { defaultVaultId: newVault.id },
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

  const isOwner = session?.user?.id === vault.ownerId;
  const isMember = vault.members.some((m: { userId: string }) => m.userId === session?.user?.id);

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

    const discordResult = await checkDiscordMembership(session.user.id, vault.discordGuildId);
    if (discordResult.hasAccess) {
      return { vault };
    }

    // Return detailed error for Discord-gated vaults
    return {
      error: "Access denied",
      discordReason: discordResult.reason,
      needsReconnect: discordResult.needsReconnect,
    };
  }

  return { error: "Access denied" };
}
