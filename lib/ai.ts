import OpenAI from 'openai';
import { env } from "@/lib/env";
import { ActionState } from '@/lib/types';

const openai = env.OPENAI_API_KEY ? new OpenAI({
    apiKey: env.OPENAI_API_KEY,
}) : null;

export interface EnrichedBookmark {
    category: string;
    tags: string[];
    title: string;
    description: string;
    reasoning?: string;
}

export async function enrichBookmark(
    url: string,
    scrapedTitle: string,
    scrapedDescription: string,
    existingCategories: string[]
): Promise<EnrichedBookmark | null> {
    try {
        if (!openai) {
            console.warn("OPENAI_API_KEY is not set. Skipping AI enrichment.");
            return null;
        }

        const prompt = `
You are an intelligent bookmark organizer.
I will provide a bookmark (URL, Title, Description) and a list of existing categories.
The provided metadata might be poor quality.

Your task is to:
1. Assign the BEST category for this bookmark.
2. Generate max 3 relevant tags (lowercase).
3. Provide a CLEAN, improved Title.
4. Provide a SHORT, useful Description in ENGLISH (2-3 sentences).

Input Data:
URL: ${url}
Title: ${scrapedTitle || "MISSING"}
Meta Description: ${scrapedDescription || "MISSING"}

Existing Categories:
${existingCategories.join(", ")}

Rules:
- Category: Prefer existing if matches, else suggest new (Title Case, max 2 words).
- Tags: Lowercase, relevant.
- Title: Keep it concise.
- Description: ENGLISH language, informative, max 3 sentences.

Respond in JSON:
{
  "category": "Name",
  "tags": ["tag1", "tag2"],
  "title": "Clean Title",
  "description": "Description in English",
  "reasoning": "Why this category"
}
`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            temperature: 0.3,
        });

        const content = completion.choices[0].message.content;
        if (!content) return null;

        const result = JSON.parse(content) as EnrichedBookmark;
        return {
            category: result.category?.trim() || "General",
            tags: result.tags?.slice(0, 3).map(t => t.toLowerCase().trim()) || [],
            title: result.title?.trim() || scrapedTitle || "",
            description: result.description?.trim() || scrapedDescription || "",
            reasoning: result.reasoning
        };

    } catch (error) {
        console.error("AI Enrichment failed:", error);
        return null; // Fallback to basic scraped data
    }
}

export async function regenerateDescription(title: string, currentDescription: string, metaDescription: string): Promise<ActionState<string>> {
    if (!openai) {
        return {
            success: false,
            message: "AI config missing (OPENAI_API_KEY)"
        };
    }

    try {
        const prompt = `
        Rewrite this description to be more engaging and clear (in English):
        
        Title: ${title}
        Old Description: ${currentDescription}
        Meta: ${metaDescription}
        
        Make it different and unique.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
            temperature: 0.9,
        });

        const newDescription = completion.choices[0].message.content?.trim() || currentDescription;

        return {
            success: true,
            data: newDescription,
            message: "Description regenerated"
        };

    } catch {
        return {
            success: false,
            message: "Failed to regenerate description"
        };
    }
}
