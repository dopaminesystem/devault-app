import { Plus, Globe, Edit2 } from 'lucide-react';
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkWithCategory } from "@/lib/types";
import { getCategoryColor, getHostname } from '@/lib/utils';

interface BookmarkGridProps {
    bookmarks: BookmarkWithCategory[];
    canEdit: boolean; // isOwner || isMember
    onOpenNew: () => void;
    onOpenDetail: (bookmark: BookmarkWithCategory) => void;
    onEdit?: (bookmark: BookmarkWithCategory) => void;
}

export function BookmarkGrid({
    bookmarks,
    canEdit,
    onOpenNew,
    onOpenDetail,
    onEdit
}: BookmarkGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Add New Button */}
            {canEdit && (
                <button
                    onClick={onOpenNew}
                    className="group flex flex-col items-center justify-center h-[180px] border border-dashed border-zinc-800 rounded-2xl hover:bg-zinc-900/30 hover:border-zinc-700 transition-all cursor-pointer bg-zinc-900/10"
                >
                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                        <Plus size={20} className="text-zinc-500 group-hover:text-zinc-300" />
                    </div>
                    <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300">New Bookmark</span>
                </button>
            )}

            {/* Render Bookmarks */}
            {bookmarks.map((bookmark) => {
                // ⚡ PERF: Use cached hostname parsing instead of new URL() on every render
                const hostname = getHostname(bookmark.url);
                const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`;
                const categoryColor = getCategoryColor(bookmark.category.name);

                return (
                    <Card
                        key={bookmark.id}
                        onClick={() => onOpenDetail(bookmark)}
                        className="h-[180px] p-0 gap-0 group hover:-translate-y-1 hover:shadow-indigo-500/10 cursor-pointer"
                    >
                        <CardContent className="p-5 h-full flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <div className="w-10 h-10 rounded-lg bg-zinc-950/50 border border-zinc-800/50 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                                    {/* ⚡ PERF: Lazy load favicons for bookmarks below the fold */}
                                    <Image
                                        src={faviconUrl}
                                        alt="icon"
                                        width={20}
                                        height={20}
                                        className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                                        unoptimized
                                    />
                                </div>

                                <Badge className={`${categoryColor} border opacity-70 group-hover:opacity-100`}>
                                    {bookmark.category.name}
                                </Badge>
                            </div>

                            <div className="mt-2">
                                <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                                    {bookmark.title}
                                </h3>
                                <p className="text-sm text-zinc-500 mt-1 line-clamp-2 group-hover:text-zinc-400 transition-colors">
                                    {bookmark.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-2">
                                <div className="flex items-center gap-1 text-xs text-zinc-600 group-hover:text-indigo-400 transition-colors">
                                    <Globe size={10} />
                                    <span className="truncate max-w-[150px]">{hostname}</span>
                                </div>
                                {canEdit && onEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(bookmark);
                                        }}
                                        className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div >
    );
}
