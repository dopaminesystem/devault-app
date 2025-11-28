"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { redirect } from "next/navigation";

const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
});

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
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
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
    };

    const validation = signUpSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            error: "Validation failed",
            fieldErrors: validation.error.flatten().fieldErrors,
        };
    }

    try {
        await auth.api.signUpEmail({
            body: validation.data,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("already exists")) {
                return { error: "An account with this email already exists" };
            }
            return { error: error.message };
        }
        return { error: "Something went wrong during sign up" };
    }

    redirect("/dashboard");
}

export async function signInAction(
    prevState: AuthActionState,
    formData: FormData
): Promise<AuthActionState> {
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const validation = signInSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            error: "Validation failed",
            fieldErrors: validation.error.flatten().fieldErrors,
        };
    }

    try {
        await auth.api.signInEmail({
            body: validation.data,
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Invalid email or password" };
    }

    redirect("/dashboard");
}

export async function signOutAction() {
    try {
        await auth.api.signOut();
    } catch (error) {
        console.error("Sign out error:", error);
    }
    redirect("/");
}
