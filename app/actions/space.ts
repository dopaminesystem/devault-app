"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const createSpaceSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").max(50, "Slug must be less than 50 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

export type CreateSpaceState = {
    errors?: {
        name?: string[];
        slug?: string[];
        description?: string[];
        _form?: string[];
    };
    message?: string;
};

export async function createSpace(prevState: CreateSpaceState, formData: FormData): Promise<CreateSpaceState> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return {
            message: "Unauthorized",
        };
    }

    const validatedFields = createSpaceSchema.safeParse({
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid fields",
        };
    }

    const { name, slug, description } = validatedFields.data;

    try {
        // Enforce 1 vault per user limit
        const existingSpace = await prisma.space.findFirst({
            where: {
                ownerId: session.user.id,
            },
        });

        if (existingSpace) {
            return {
                message: "You can only create one vault.",
            };
        }

        // Check if slug is unique
        const existingSlug = await prisma.space.findUnique({
            where: {
                slug,
            },
        });

        if (existingSlug) {
            return {
                errors: {
                    slug: ["This URL is already taken."],
                },
                message: "Slug already exists",
            };
        }

        await prisma.space.create({
            data: {
                name,
                slug,
                description,
                ownerId: session.user.id,
                members: {
                    create: {
                        userId: session.user.id,
                        role: "OWNER",
                    }
                }
            },
        });

    } catch (error) {
        console.error("Failed to create space:", error);
        return {
            message: "Failed to create vault. Please try again.",
        };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function getSpace(slug: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const space = await prisma.space.findUnique({
        where: { slug },
        include: {
            owner: true,
            members: true,
        },
    });

    if (!space) {
        return { error: "Space not found" };
    }

    // Check access
    const isOwner = session?.user?.id === space.ownerId;
    const isMember = space.members.some((m) => m.userId === session?.user?.id);

    if (space.accessType === "PUBLIC") {
        return { space };
    }

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    if (isOwner || isMember) {
        return { space };
    }

    return { error: "Access denied" };
}
