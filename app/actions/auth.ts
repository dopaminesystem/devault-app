"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { ActionState } from "@/lib/types";

const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
});

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export async function signUpAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
    };

    const validation = signUpSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            success: false,
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
                return { success: false, error: "An account with this email already exists" };
            }
            return { success: false, error: error.message };
        }
        return { success: false, error: "Something went wrong during sign up" };
    }

    redirect("/dashboard");
    return { success: true, message: "Signed up successfully" };
}

export async function signInAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const validation = signInSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            success: false,
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
            return { success: false, error: error.message };
        }
        return { success: false, error: "Invalid email or password" };
    }

    redirect("/dashboard");
    return { success: true, message: "Signed in successfully" };
}

export async function signOutAction() {
    try {
        await auth.api.signOut();
    } catch (error) {
        console.error("Sign out error:", error);
    }
    redirect("/");
}
