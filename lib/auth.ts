import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "./env";
import { headers } from "next/headers";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            const { sendEmail } = await import("./email");
            void sendEmail({
                to: user.email,
                subject: "Verify your email address",
                html: `
                    <div style="font-family: sans-serif; font-size: 16px; color: #333;">
                        <h1>Verify your email address</h1>
                        <p>Click the link below to verify your email address:</p>
                        <a href="${url}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
                        <p style="margin-top: 20px; font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
                    </div>
                `,
            });
        },
    },
    socialProviders: {
        discord: {
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        },
    },
    plugins: [nextCookies()],
});

export async function getSession() {
    return await auth.api.getSession({
        headers: await headers(),
    });
}

