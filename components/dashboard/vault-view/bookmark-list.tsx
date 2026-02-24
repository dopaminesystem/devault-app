import { Edit2, ExternalLink, Plus } from "lucide-react";
import Image from "next/image";
import type { BookmarkWithCategory } from "@/lib/types";
import { getCategoryColor, getHostname } from "@/lib/utils";

interface BookmarkListProps {
  bookmarks: BookmarkWithCategory[];
  canEdit: boolean;
  onOpenNew: () => void;
  onOpenDetail: (bookmark: BookmarkWithCategory) => void;
  onEdit?: (bookmark: BookmarkWithCategory) => void;
}

export function BookmarkList({
  bookmarks,
  canEdit,
  onOpenNew,
  onOpenDetail,
  onEdit,
}: BookmarkListProps) {
  return (
    <div className="w-full space-y-4">
      {/* Add New Button (Top Placement) */}
      {canEdit && (
        <button
          type="button"
          onClick={onOpenNew}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all text-sm font-medium group"
        >
          <div className="p-1 rounded bg-zinc-800/50 group-hover:bg-zinc-700">
            <Plus size={14} className="group-hover:text-white" />
          </div>
          <span>Add Bookmark</span>
        </button>
      )}

      <div className="w-full">
        {/* Render Bookmarks */}
        <div className="flex flex-col divide-y divide-zinc-900/50">
          {bookmarks.map((bookmark) => {
            // ⚡ PERF: Use cached hostname parsing instead of new URL() on every render
            const hostname = getHostname(bookmark.url);
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`;
            const categoryColor = getCategoryColor(bookmark.category.name);

            return (
              // biome-ignore lint/a11y/useKeyWithClickEvents: whole card is clickable
              // biome-ignore lint/a11y/noStaticElementInteractions: whole card is clickable
              <div
                key={bookmark.id}
                onClick={() => onOpenDetail(bookmark)}
                className="group grid grid-cols-12 items-center px-4 py-3 hover:bg-zinc-900/40 transition-colors cursor-pointer rounded-xl"
              >
                {/* Title & icon */}
                <div className="col-span-12 md:col-span-5 flex items-start gap-3 overflow-hidden pr-4">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-zinc-900 border border-zinc-800/50 flex items-center justify-center mt-0.5">
                    {/* ⚡ PERF: Lazy load favicons for bookmarks below the fold */}
                    <Image
                      src={faviconUrl}
                      alt="icon"
                      width={16}
                      height={16}
                      className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-medium text-zinc-200 group-hover:text-white truncate transition-colors">
                      {bookmark.title}
                    </h3>
                    {bookmark.description && (
                      <p className="text-[12px] text-zinc-500 truncate group-hover:text-zinc-400 max-w-[90%]">
                        {bookmark.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="hidden md:flex col-span-3 items-center">
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-md font-medium border bg-opacity-5 ${categoryColor.replace("bg-", "bg-opacity-5 border-opacity-20 text-").replace("text-white", "")} ${categoryColor.includes("zinc") ? "border-zinc-700 text-zinc-400" : ""}`}
                  >
                    {bookmark.category.name}
                  </span>
                </div>

                {/* URL */}
                <div className="hidden md:flex col-span-3 items-center">
                  <span className="text-xs text-zinc-600 truncate group-hover:text-indigo-400/80 transition-colors font-mono bg-zinc-950/50 px-2 py-1 rounded max-w-full block truncate">
                    {hostname}
                  </span>
                </div>

                {/* Actions */}
                <div className="hidden md:flex col-span-1 items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(bookmark.url, "_blank");
                    }}
                    className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
                    title="Open Link"
                  >
                    <ExternalLink size={14} />
                  </button>
                  {canEdit && onEdit && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(bookmark);
                      }}
                      className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
