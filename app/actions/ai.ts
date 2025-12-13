"use server";

import { normalizeUrl } from "@/lib/utils";
import { suggestCategory } from "@/lib/ai";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import metadata from "metadata-scraper";

export async function magicGenerate(url: string, vaultId: string) {
    const session = await getSession();
    if (!session?.user) return { error: "Unauthorized" };

    try {
        const normalizedUrl = normalizeUrl(url);

        // 1. Scrape Metadata with Fail-Fast Timeout (3s)
        // Note: metadata-scraper might fail on some sites, so we fail fast to let AI take over.
        let title = "";
        let description = "";
        try {
            const scrapePromise = metadata(normalizedUrl);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Scrape timeout")), 3000)
            );

            const data = await Promise.race([scrapePromise, timeoutPromise]) as any;
            title = data.title || "";
            description = data.description || "";
        } catch (e) {
            console.log("Metadata scrape skipped (fail-fast or error):", e instanceof Error ? e.message : e);
        }

        // 2. Fetch Existing Categories
        const existingCategories = await prisma.category.findMany({
            where: { vaultId },
            select: { name: true }
        });
        const categoryNames = existingCategories.map(c => c.name);

        // 3. AI Magic
        const aiResult = await suggestCategory(normalizedUrl, title, description, categoryNames);

        return {
            title: aiResult?.title || title,
            description: aiResult?.description || description,
            category: aiResult?.category || "General",
            tags: aiResult?.tags || [],
            success: true
        };

    } catch (error) {
        console.error("Magic generation failed:", error);
        return { error: "Failed to generate data" };
    }
}
