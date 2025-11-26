import { z } from "zod";

const serverSchema = z.object({
    DATABASE_URL: z.string().url().trim(),
    BETTER_AUTH_SECRET: z.string().min(1).trim(),
    DISCORD_CLIENT_ID: z.string().min(1).trim(),
    DISCORD_CLIENT_SECRET: z.string().min(1).trim(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    BETTER_AUTH_URL: z.string().url().optional(), // Optional as it might be inferred or not strictly required by app code directly
});

const clientSchema = z.object({
    NEXT_PUBLIC_APP_URL: z.string().url().trim(),
});

// Type inference
export type Env = z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;

// Validate based on environment
const processEnv = {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

// Only validate server vars on server
const serverEnv = typeof window === 'undefined'
    ? serverSchema.safeParse(processEnv)
    : { success: true, data: {} as z.infer<typeof serverSchema> }; // Skip server validation on client

const clientEnv = clientSchema.safeParse(processEnv);

if (!serverEnv.success) {
    console.error(
        "❌ Invalid server environment variables:",
        serverEnv.error.flatten().fieldErrors
    );
    throw new Error("Invalid server environment variables");
}

if (!clientEnv.success) {
    console.error(
        "❌ Invalid client environment variables:",
        clientEnv.error.flatten().fieldErrors
    );
    throw new Error("Invalid client environment variables");
}

export const env = { ...serverEnv.data, ...clientEnv.data } as Env;
