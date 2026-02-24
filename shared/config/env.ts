import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url().trim(),
  BETTER_AUTH_SECRET: z.string().min(1).trim(),
  DISCORD_CLIENT_ID: z.string().min(1).trim(),
  DISCORD_CLIENT_SECRET: z.string().min(1).trim(),
  DISCORD_BOT_TOKEN: z.string().min(1).trim().optional(),
  OPENAI_API_KEY: z.string().min(1).trim().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BETTER_AUTH_URL: z.string().url().optional(), // Optional as it might be inferred or not strictly required by app code directly

  // Email
  EMAIL_FROM: z.string().email(),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().trim(),
});

// Type inference
export type Env = z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;

// Validate based on environment
const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

  EMAIL_FROM: process.env.EMAIL_FROM,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
};

// Server Validation
let serverData = {} as z.infer<typeof serverSchema>;

if (typeof window === "undefined") {
  const parsed = serverSchema.safeParse(processEnv);
  if (!parsed.success) {
    console.error("❌ Invalid server environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid server environment variables");
  }
  serverData = parsed.data;
}

// Client Validation
const clientParsed = clientSchema.safeParse(processEnv);

if (!clientParsed.success) {
  console.error(
    "❌ Invalid client environment variables:",
    clientParsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid client environment variables");
}

export const env = { ...serverData, ...clientParsed.data } as Env;
