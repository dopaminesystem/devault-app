import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface BookmarkCardProps {
    bookmark: {
        id: string;
        title: string | null;
        description: string | null;
        url: string;
        image: string | null;
        category: {
            name: string;
        };
    };
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
            {bookmark.image && (
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={bookmark.image}
                        alt={bookmark.title || "Bookmark image"}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="line-clamp-2 text-lg">
                        {bookmark.title || bookmark.url}
                    </CardTitle>
                </div>
                <CardDescription className="line-clamp-3">
                    {bookmark.description || "No description"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full w-fit">
                    {bookmark.category.name}
                </div>
            </CardContent>
            <CardFooter>
                <Link
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                    Visit Link <ExternalLink className="h-3 w-3" />
                </Link>
            </CardFooter>
        </Card>
    );
}
