"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { headers } from "next/headers";

const signUpSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: z.string().min(2),
});

export type AuthActionState = {
    error?: string;
    success?: boolean;
    fieldErrors?: {
        email?: string[];
        password?: string[];
        name?: string[];
    };
};

export async function signUpAction(
    prevState: AuthActionState,
    formData: FormData
): Promise<AuthActionState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    const validation = signUpSchema.safeParse({ email, password, name });

    if (!validation.success) {
        return {
            error: "Validation failed",
            fieldErrors: validation.error.flatten().fieldErrors,
        };
    }

    try {
        const res = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            },
            headers: await headers(),
        });

        if (!res) {
            return { error: "Failed to create account" };
        }

        return { success: true };
    } catch (error) {
        return { error: (error as Error).message || "Something went wrong" };
    }
}

const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(1, "Password is required"),
});

export async function signInAction(
    prevState: AuthActionState,
    formData: FormData
): Promise<AuthActionState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validation = signInSchema.safeParse({ email, password });

    if (!validation.success) {
        return {
            error: "Validation failed",
            fieldErrors: validation.error.flatten().fieldErrors,
        };
    }

    try {
        const res = await auth.api.signInEmail({
            body: {
                email,
                password,
            },
            headers: await headers(),
        });

        if (!res) {
            return { error: "Invalid email or password" };
        }

        return { success: true };
    } catch (error) {
        // Better-Auth might throw on invalid credentials
        return { error: "Invalid email or password" };
    }
}
