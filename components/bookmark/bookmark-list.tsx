import { BookmarkCard } from "./bookmark-card";

interface Category {
    id: string;
    name: string;
}

interface BookmarkListProps {
    bookmarks: any[]; // Type should ideally be inferred from Prisma or shared type
    categories: Category[];
    canEdit: boolean;
}

export function BookmarkList({ bookmarks, categories, canEdit }: BookmarkListProps) {
    if (!bookmarks || bookmarks.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No bookmarks found in this space.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
                <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    categories={categories}
                    canEdit={canEdit}
                />
            ))}
        </div>
    );
}
