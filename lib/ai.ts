import OpenAI from 'openai';

// Initialize OpenAI client
// Ensure OPENAI_API_KEY is set in your .env file
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key', // Fallback to avoid crash on init, but calls will fail if missing
});

interface CategorizationResult {
    category: string;
    tags: string[];
    title: string;
    description: string;
    reasoning?: string;
}

export async function suggestCategory(
    url: string,
    title: string,
    description: string | undefined,
    existingCategories: string[]
): Promise<CategorizationResult | null> {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.warn("OPENAI_API_KEY is not set. Skipping auto-categorization.");
            return null;
        }

        const prompt = `
You are an intelligent bookmark organizer.
I will provide a bookmark (URL, Title, Description) and a list of existing categories.
The provided Title and Description might be empty or poor quality (e.g. from a scraper).

Your task is to:
1. Assign the BEST category for this bookmark.
2. Generate max 3 relevant tags (lowercase).
3. Provide a CLEAN, improved Title (if the provided one is empty/junk, infer from URL).
4. Provide a SHORT, useful Description (if the provided one is empty/junk, infer from URL).

Rules for Category:
1. Prefer using an Existing Category if it is a strong match.
2. If no Existing Category fits well, suggest a NEW, concise, and descriptive category name (Title Case, max 2-3 words).
3. Avoid generic categories like "General", "Misc" unless absolutely necessary.

Rules for Tags:
1. Max 3 tags.
2. Lowercase, single words or short phrases.
3. Relevant to the content (e.g. "design", "tools", "nextjs").

Bookmark:
URL: ${url}
Title: ${title || "MISSING"}
Description: ${description || "MISSING"}

Existing Categories:
${existingCategories.join(", ")}

Respond in JSON format:
{
  "category": "Name of the category",
  "tags": ["tag1", "tag2"],
  "title": "Improved Title",
  "description": "Improved Description",
  "reasoning": "Brief explanation"
}
`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini", // Use a fast/cheap model
            response_format: { type: "json_object" },
            temperature: 0.3,
        });

        const content = completion.choices[0].message.content;
        if (!content) return null;

        const result = JSON.parse(content) as CategorizationResult;
        return {
            category: result.category.trim(),
            tags: result.tags.slice(0, 3).map(t => t.toLowerCase().trim()),
            title: result.title?.trim() || title || "",
            description: result.description?.trim() || description || "",
            reasoning: result.reasoning
        };

    } catch (error) {
        console.error("AI Categorization failed:", error);
        return null;
    }
}
