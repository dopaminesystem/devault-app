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

            const data = await Promise.race([scrapePromise, timeoutPromise]) as any;
            scrapedTitle = data.title || "";
            scrapedDescription = data.description || "";
            scrapedFavicon = data.icon || "";

            console.log("[MagicGen] Scraped metadata:", {
                title: scrapedTitle?.slice(0, 50),
                description: scrapedDescription?.slice(0, 50)
            });
        } catch (e) {
            console.log("[MagicGen] Metadata scrape skipped/failed:", e instanceof Error ? e.message : e);
        }

        // 2. Fetch Existing Categories for Context
        const existingCategories = await prisma.category.findMany({
            where: { vaultId },
            select: { name: true }
        });
        const categoryNames = existingCategories.map(c => c.name);
        console.log("[MagicGen] Existing categories:", categoryNames);

        // 3. AI Enrichment (Scraped Data -> AI -> Final Data)
        const aiResult = await enrichBookmark(
            normalizedUrl,
            scrapedTitle,
            scrapedDescription,
            categoryNames
        );

        console.log("[MagicGen] AI result:", aiResult ? {
            category: aiResult.category,
            tags: aiResult.tags,
            title: aiResult.title?.slice(0, 30),
            description: aiResult.description?.slice(0, 30)
        } : "null (AI failed or skipped)");

        // 4. Return Final Logic (AI > Scraped > Empty)
        const finalResult = {
            title: aiResult?.title || scrapedTitle || "",
            description: aiResult?.description || scrapedDescription || "",
            category: aiResult?.category || "General",
            tags: aiResult?.tags || [],
            favicon: scrapedFavicon,
            success: true
        };

        console.log("[MagicGen] Final result:", {
            category: finalResult.category,
            tags: finalResult.tags,
            hasTitle: !!finalResult.title,
            hasDescription: !!finalResult.description
        });

        return finalResult;

    } catch (error) {
        console.error("[MagicGen] Failed:", error);
        return { error: "Failed to generate data" };
    }
}
