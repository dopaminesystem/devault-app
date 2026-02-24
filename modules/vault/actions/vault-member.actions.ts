"use server";

import { compare } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getSession } from "@/shared/auth/auth";
import { prisma } from "@/shared/db/prisma";

import type { ActionState } from "@/shared/types";

export async function joinVault(prevState: ActionState, formData: FormData) {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  if (!session.user.emailVerified) {
    return { success: false, message: "Email not verified" };
  }

  const vaultId = formData.get("vaultId") as string;
  const password = formData.get("password") as string;

  if (!vaultId || !password) {
    return { success: false, message: "Missing fields" };
  }

  const vault = await prisma.vault.findUnique({
    where: { id: vaultId },
  });

  if (!vault) {
    return { success: false, message: "Vault not found" };
  }

  if (vault.accessType !== "PASSWORD") {
    return { success: false, message: "This vault does not require a password" };
  }

  if (!vault.passwordHash) {
    return { success: false, message: "Vault configuration error" };
  }

  const isValid = await compare(password, vault.passwordHash);

  if (!isValid) {
    return { success: false, message: "Invalid password" };
  }

  try {
    await prisma.vaultMember.create({
      data: {
        vaultId,
        userId: session.user.id,
        role: "MEMBER",
      },
    });
  } catch {
    // Ignore if already a member
  }

  revalidatePath(`/v/${vault.slug}`);
  return { success: true, message: "Joined successfully" };
}

/** Subscribe to a PUBLIC vault using idempotent upsert */
export async function subscribeToVault(vaultId: string): Promise<ActionState> {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, message: "Please sign in to subscribe" };
  }

  if (!session.user.emailVerified) {
    return { success: false, message: "Please verify your email first" };
  }

  const vault = await prisma.vault.findUnique({
    where: { id: vaultId },
    select: { id: true, slug: true, accessType: true, ownerId: true },
  });

  if (!vault) {
    return { success: false, message: "Vault not found" };
  }

  if (vault.accessType !== "PUBLIC") {
    return { success: false, message: "This vault is not public" };
  }

  if (vault.ownerId === session.user.id) {
    return { success: false, message: "You already own this vault" };
  }

  try {
    // Upsert handles both new and existing subscriptions in one query
    await prisma.vaultMember.upsert({
      where: {
        vaultId_userId: {
          vaultId,
          userId: session.user.id,
        },
      },
      update: {},
      create: {
        vaultId,
        userId: session.user.id,
        role: "MEMBER",
      },
    });

    revalidatePath(`/v/${vault.slug}`);
    revalidatePath("/dashboard");
    return { success: true, message: "Subscribed! Vault added to your dashboard." };
  } catch (error) {
    console.error("Subscribe error:", error);
    return { success: false, message: "Failed to subscribe" };
  }
}

/** Unsubscribe from a vault (for non-owner members only) */
export async function unsubscribeFromVault(vaultId: string): Promise<ActionState> {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, message: "Please sign in" };
  }

  const vault = await prisma.vault.findUnique({
    where: { id: vaultId },
    select: { id: true, slug: true, ownerId: true },
  });

  if (!vault) {
    return { success: false, message: "Vault not found" };
  }

  if (vault.ownerId === session.user.id) {
    return { success: false, message: "You cannot unsubscribe from your own vault" };
  }

  try {
    await prisma.vaultMember.delete({
      where: {
        vaultId_userId: {
          vaultId,
          userId: session.user.id,
        },
      },
    });

    revalidatePath(`/v/${vault.slug}`);
    revalidatePath("/dashboard");
    return { success: true, message: "Unsubscribed from vault" };
  } catch {
    return { success: false, message: "Failed to unsubscribe" };
  }
}
