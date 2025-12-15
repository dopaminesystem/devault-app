"use server";

import { normalizeUrl } from "@/lib/utils";
import { enrichBookmark } from "@/lib/ai";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import metadata from "metadata-scraper";

export async function magicGenerate(url: string, vaultId: string) {
    const session = await getSession();
    if (!session?.user) return { error: "Unauthorized" };

    try {
        const normalizedUrl = normalizeUrl(url);

        // 1. Scrape Metadata (Fail-Fast: 5s)
        let scrapedTitle = "";
        let scrapedDescription = "";
        let scrapedFavicon = "";

        try {
            const scrapePromise = metadata(normalizedUrl);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Scrape timeout")), 5000)
            );

            const data = await Promise.race([scrapePromise, timeoutPromise]) as { title?: string; description?: string; icon?: string };
            scrapedTitle = data.title || "";
            scrapedDescription = data.description || "";
            scrapedFavicon = data.icon || "";
        } catch {
            // Metadata scrape failed or timed out - continue with empty values
        }

        // 2. Fetch Existing Categories for Context
        const existingCategories = await prisma.category.findMany({
            where: { vaultId },
            select: { name: true }
        });
        const categoryNames = existingCategories.map(c => c.name);

        // 3. AI Enrichment (Scraped Data -> AI -> Final Data)
        const aiResult = await enrichBookmark(
            normalizedUrl,
            scrapedTitle,
            scrapedDescription,
            categoryNames
        );

        // 4. Return Final Logic (AI > Scraped > Empty)
        return {
            title: aiResult?.title || scrapedTitle || "",
            description: aiResult?.description || scrapedDescription || "",
            category: aiResult?.category || "General",
            tags: aiResult?.tags || [],
            favicon: scrapedFavicon,
            success: true
        };

    } catch (error) {
        console.error("Magic generation failed:", error);
        return { error: "Failed to generate data" };
    }
}
