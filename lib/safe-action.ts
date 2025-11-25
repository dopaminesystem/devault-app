import { z } from "zod";

export type ActionState<T> = {
    data?: T;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

export async function createSafeAction<TInput extends z.ZodType, TOutput>(
    schema: TInput,
    handler: (validatedData: z.infer<TInput>) => Promise<TOutput>
): Promise<ActionState<TOutput>> {
    try {
        // We can't validate here because we need the raw input, 
        // but usually this wrapper is called INSIDE the action with the raw data 
        // OR the action itself takes the raw data.
        // 
        // A better pattern for React Server Actions (invoked by forms):
        // The action receives FormData or plain objects.

        // For simplicity in this project structure setup, we will assume 
        // the handler is the one doing the work and this wrapper manages the try-catch 
        // and consistent return format.

        // NOTE: In a real usage, you'd parse the input before calling this, 
        // or pass the input to this function to parse.
        // Let's adjust to take the input data for validation.
        throw new Error("Use createSafeActionClient instead");
    } catch (error) {
        return { error: "Not implemented" };
    }
}

// Better Pattern: Action Client
export const actionClient = {
    // Wrapper for public actions
    action: async <TInput, TOutput>(
        schema: z.ZodType<TInput>,
        input: TInput,
        handler: (data: TInput) => Promise<TOutput>
    ): Promise<ActionState<TOutput>> => {
        const validation = schema.safeParse(input);
        if (!validation.success) {
            return {
                error: "Validation failed",
                fieldErrors: validation.error.flatten().fieldErrors as Record<string, string[]>,
            };
        }

        try {
            const data = await handler(validation.data);
            return { data };
        } catch (error) {
            console.error("Action error:", error);
            return { error: (error as Error).message || "Something went wrong" };
        }
    },
};
