"use server";

import * as cheerio from "cheerio";
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
        // 1. Fetch Metadata
        const res = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Cache-Control': 'max-age=0',
            },
            signal: AbortSignal.timeout(5000) // 5s timeout
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch page: ${res.statusText}`);
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        const title = $('title').text() || $('meta[property="og:title"]').attr('content') || new URL(targetUrl).hostname;
        const metaDesc = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || "";
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${targetUrl}&sz=64`;

        // Extract snippet (first meaningful paragraph)
        const snippet = $('p').first().text().substring(0, 300) || metaDesc;

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
