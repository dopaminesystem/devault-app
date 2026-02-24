import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/shared/db/prisma";

const saveBookmarkSchema = z.object({
  discordId: z.string(),
  guildId: z.string().optional(),
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the request
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.DISCORD_BOT_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = saveBookmarkSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 },
      );
    }

    const { discordId, guildId, url, title, description, tags } = validation.data;

    // 2. Identify the user
    const account = await prisma.account.findFirst({
      where: {
        providerId: "discord",
        accountId: discordId,
      },
      include: {
        user: true,
      },
    });

    if (!account || !account.user) {
      return NextResponse.json(
        { error: "User not found. Please link your Discord account first." },
        { status: 404 },
      );
    }

    const user = account.user;
    let targetVaultId = user.defaultVaultId;

    // 3. Resolve Vault (Check for Guild Link)
    if (guildId) {
      // Find a vault linked to this guild where the user is a member/owner
      const linkedVault = await prisma.vault.findFirst({
        where: {
          discordGuildId: guildId,
          OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
        },
      });

      if (linkedVault) {
        targetVaultId = linkedVault.id;
      }
    }

    if (!targetVaultId) {
      return NextResponse.json(
        {
          error: "Default vault not set and no linked vault found. Please configure your settings.",
        },
        { status: 400 },
      );
    }

    // 4. Check/Create "Discord Imports" category
    let category = await prisma.category.findFirst({
      where: {
        vaultId: targetVaultId,
        name: "Discord Imports",
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          vaultId: targetVaultId,
          name: "Discord Imports",
          order: 0, // Put it at the top
        },
      });
    }

    // 5. Create the bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        categoryId: category.id,
        url,
        title: title || url,
        description,
        tags: tags || [],
      },
    });

    return NextResponse.json({ success: true, bookmark });
  } catch (error) {
    console.error("Discord save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
