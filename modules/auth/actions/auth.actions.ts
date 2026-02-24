"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, getSession } from "@/shared/auth/auth";
import { prisma } from "@/shared/db/prisma";
import type { ActionState } from "@/shared/types";

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
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    email: (formData.get("email") as string).toLowerCase(),
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
      body: {
        ...validation.data,
        callbackURL: "/dashboard",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        const existingUser = await prisma.user.findUnique({
          where: { email: validation.data.email },
          include: { accounts: true },
        });

        if (existingUser) {
          const hasDiscord = existingUser.accounts.some((acc) => acc.providerId === "discord");
          const hasEmail = existingUser.accounts.some((acc) => acc.providerId === "credential");

          if (hasDiscord && !hasEmail) {
            return {
              success: false,
              error: "AccountExistsViaProvider",
              message: "An account with this email already exists via Discord",
            };
          }
        }

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
  formData: FormData,
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

export async function enableEmailSignInAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required",
    };
  }

  try {
    const session = await getSession();

    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to enable email sign-in",
      };
    }

    if (session.user.email?.toLowerCase() !== email) {
      return {
        success: false,
        error: "Email must match your account",
      };
    }

    // Link email/password credentials to existing OAuth account
    // biome-ignore lint/suspicious/noExplicitAny: required for better-auth api typing
    await (auth.api as any).linkAccount({
      body: {
        email,
        password,
        providerId: "credential",
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Email sign-in enabled successfully!",
    };
  } catch (error) {
    console.error("Failed to enable email sign-in:", error);

    const err = error as { message?: string; body?: { message?: string } };

    if (
      err?.message?.includes("already linked") ||
      err?.body?.message?.includes("already linked")
    ) {
      return {
        success: false,
        error: "Email sign-in is already enabled",
      };
    }

    return {
      success: false,
      error: err?.message || "Failed to enable email sign-in. Please try again.",
    };
  }
}

export async function resendVerificationEmailAction(): Promise<ActionState> {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  if (session.user.emailVerified) {
    return { success: false, error: "Email already verified" };
  }

  try {
    await auth.api.sendVerificationEmail({
      body: {
        email: session.user.email,
        callbackURL: "/dashboard",
      },
    });

    return { success: true, message: "Verification email sent!" };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    const err = error as { message?: string };
    return {
      success: false,
      error: err?.message || "Failed to send verification email",
    };
  }
}
