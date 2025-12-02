import { Bookmark, Category } from "@prisma/client";

export type BookmarkWithCategory = Bookmark & {
    category: Category;
};
