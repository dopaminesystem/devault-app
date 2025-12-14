import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeUrl } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const createBookmarkSchema = z.object({
    url: z.string().url(),
    title: z.string().min(1),
    description: z.string().optional(),
});

export async function POST(req: Request) {
    const session = await getSession();

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Normalize URL before validation
        if (body.url) {
            body.url = normalizeUrl(body.url);
        }

        const validation = createBookmarkSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation failed", errors: validation.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { url, title, description } = validation.data;

        // Get user's default vault
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { defaultVaultId: true },
        });

        if (!user?.defaultVaultId) {
            return NextResponse.json(
                { message: "No default vault set. Please configure it in Settings." },
                { status: 400 }
            );
        }

        // Parallelize Vault Access Check and Category Check
        const [vault, existingCategory] = await Promise.all([
            // Efficient access check: find vault AND verify ownership/membership in one query
            prisma.vault.findFirst({
                where: {
                    id: user.defaultVaultId,
                    OR: [
                        { ownerId: session.user.id },
                        { members: { some: { userId: session.user.id } } },
                    ],
                },
            }),
            // Check for "General" category
            prisma.category.findFirst({
                where: {
                    vaultId: user.defaultVaultId,
                    name: "General",
                },
            }),
        ]);

        if (!vault) {
            return NextResponse.json({ message: "Default vault not found or access denied" }, { status: 403 });
        }

        let category = existingCategory;

        if (!category) {
            category = await prisma.category.create({
                data: {
                    vaultId: user.defaultVaultId,
                    name: "General",
                },
            });
        }

        // Create bookmark
        const bookmark = await prisma.bookmark.create({
            data: {
                url,
                title,
                description,
                categoryId: category.id,
            },
        });

        return NextResponse.json({ success: true, bookmark });
    } catch (error) {
        console.error("Extension save error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}