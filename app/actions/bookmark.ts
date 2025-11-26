"use server";

import { prisma } from "@/lib/prisma";

export async function getBookmarks(spaceId: string) {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: {
                category: {
                    spaceId: spaceId,
                },
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return { bookmarks };
    } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        return { error: "Failed to fetch bookmarks" };
    }
}
