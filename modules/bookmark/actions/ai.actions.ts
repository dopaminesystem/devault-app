"use server";

import metadata from "metadata-scraper";
import { enrichBookmark } from "@/modules/bookmark/services/ai.services";
import { getSession } from "@/shared/auth/auth";
import { prisma } from "@/shared/db/prisma";
import { normalizeUrl } from "@/shared/utils";

export async function magicGenerate(url: string, vaultId: string) {
  const session = await getSession();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    const normalizedUrl = normalizeUrl(url);

    let scrapedTitle = "";
    let scrapedDescription = "";
    let scrapedFavicon = "";

    try {
      const scrapePromise = metadata(normalizedUrl, {
        timeout: 9000,
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Scrape timeout")), 9000),
      );

      const data = (await Promise.race([scrapePromise, timeoutPromise])) as {
        title?: string;
        description?: string;
        icon?: string;
      };
      scrapedTitle = data.title || "";
      scrapedDescription = data.description || "";
      scrapedFavicon = data.icon || "";
    } catch {
      // Scrape failed - continue with empty values
    }

    const existingCategories = await prisma.category.findMany({
      where: { vaultId },
      select: { name: true },
    });
    const categoryNames = existingCategories.map((c) => c.name);

    const aiResult = await enrichBookmark(
      normalizedUrl,
      scrapedTitle,
      scrapedDescription,
      categoryNames,
    );

    // Priority: AI result > scraped data > empty
    return {
      title: aiResult?.title || scrapedTitle || "",
      description: aiResult?.description || scrapedDescription || "",
      category: aiResult?.category || "General",
      tags: aiResult?.tags || [],
      favicon: scrapedFavicon,
      success: true,
    };
  } catch (error) {
    console.error("Magic generation failed:", error);
    return { error: "Failed to generate data" };
  }
}
