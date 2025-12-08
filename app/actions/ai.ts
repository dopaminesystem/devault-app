"use server";

import getMetadata from "metadata-scraper";
import { OpenAI } from "openai";
import { env } from "@/lib/env";
import { z } from "zod";
import { ActionState } from "@/lib/types";
import { normalizeUrl } from "@/lib/utils";


const generatePreviewSchema = z.object({
    url: z.string().url("Invalid URL"),
});

export type PreviewData = {
    url: string;
    title: string;
    aiDescription: string;
    metaDescription: string;
    faviconUrl: string;
};

export async function generatePreview(url: string): Promise<ActionState<PreviewData>> {
    const validated = generatePreviewSchema.safeParse({ url });

    if (!validated.success) {
        return { success: false, message: "Invalid URL", fieldErrors: validated.error.flatten().fieldErrors };
    }

    const targetUrl = normalizeUrl(url);

    try {
        // 1. Fetch Metadata using metadata-scraper
        const metadata = await getMetadata(targetUrl);

        const title = metadata.title || metadata.provider || new URL(targetUrl).hostname;
        const metaDesc = metadata.description || "";
        const faviconUrl = metadata.icon || metadata.image || `https://www.google.com/s2/favicons?domain=${targetUrl}&sz=64`;

        // Use meta description as the snippet since we don't scrape full body content anymore
        const snippet = metaDesc;

        let aiDescription = "";

        // 2. Call LLM (Only if Key exists)
        if (env.OPENAI_API_KEY) {
            const openai = new OpenAI({
                apiKey: env.OPENAI_API_KEY,
            });

            const prompt = `
            Buatkan deskripsi singkat (2-3 kalimat) dalam Bahasa Indonesia untuk bookmark ini:
            
            URL: ${targetUrl}
            Judul: ${title}
            Meta Description: ${metaDesc}
            Konten: ${snippet}
            
            Deskripsi harus:
            - Informatif dan jelas
            - Menjelaskan isi/tujuan halaman
            - Membantu user mengingat konten ini nanti
            - Maksimal 3 kalimat
            `;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 200,
                temperature: 0.7,
            });

            aiDescription = completion.choices[0].message.content?.trim() || "";
        } else {
            console.warn("OPENAI_API_KEY missing, skipping AI generation.");
        }

        // Use AI description if available, otherwise fallback to meta description or empty
        const finalDescription = aiDescription || metaDesc || "No description available.";

        return {
            success: true,
            data: {
                url: targetUrl,
                title: title.trim(),
                aiDescription: finalDescription,
                metaDescription: metaDesc,
                faviconUrl
            }
        };

    } catch (error) {
        console.error("AI Generation Error:", error);

        // Fallback: Return basic data without AI
        const fallbackTitle = new URL(targetUrl).hostname;
        const fallbackFavicon = `https://www.google.com/s2/favicons?domain=${targetUrl}&sz=64`;

        return {
            success: true,
            message: "AI generation failed, using basic info.",
            data: {
                url: targetUrl,
                title: fallbackTitle,
                aiDescription: "",
                metaDescription: "",
                faviconUrl: fallbackFavicon
            }
        };
    }
}

export async function regenerateDescription(data: PreviewData): Promise<ActionState<string>> {
    if (!env.OPENAI_API_KEY) {
        return {
            success: false,
            message: "AI config missing (OPENAI_API_KEY)"
        };
    }

    const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
    });

    try {
        const prompt = `
        Tulis ulang deskripsi ini agar lebih menarik dan jelas (Bahasa Indonesia):
        
        Judul: ${data.title}
        Deskripsi Lama: ${data.aiDescription}
        Meta: ${data.metaDescription}
        
        Buat variasi yang berbeda.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
            temperature: 0.9, // Higher temperature for variety
        });

        const newDescription = completion.choices[0].message.content?.trim() || data.aiDescription;

        return {
            success: true,
            data: newDescription
        };

    } catch (error) {
        return {
            success: false,
            message: "Failed to regenerate description"
        };
    }
}
