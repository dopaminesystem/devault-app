"use client";

import { format } from "date-fns";
import { Calendar, Copy, ExternalLink, Globe, Hash, List, Trash2, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useActionState, useEffect } from "react";
import { deleteBookmark } from "@/modules/bookmark/actions/bookmark.actions";
import { Button } from "@/shared/components/ui/button";
import { SheetShell } from "@/shared/components/ui/sheet-shell";
import type { ActionState, BookmarkWithCategory } from "@/shared/types";
import { getCategoryColor, getHostname } from "@/shared/utils";

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    className={`px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase border ${className}`}
  >
    {children}
  </span>
);

interface DetailSheetProps {
  bookmark: BookmarkWithCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (bookmark: BookmarkWithCategory) => void;
  isOwner: boolean;
  isMember: boolean;
}

export function DetailSheet({ bookmark, isOpen, onClose, onEdit, isOwner }: DetailSheetProps) {
  const initialState: ActionState = { message: "", success: false };
  const [state, formAction, isPending] = useActionState(deleteBookmark, initialState);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  if (!bookmark) return null;

  const categoryColor = getCategoryColor(bookmark.category.name);
  // ⚡ PERF: Use cached hostname parsing instead of new URL() on every render
  const hostname = getHostname(bookmark.url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`;

  return (
    <SheetShell isOpen={isOpen} onClose={onClose}>
      <div className="flex items-start justify-between p-6 border-b border-zinc-800/50">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
            <Image
              src={faviconUrl}
              alt="favicon"
              width={24}
              height={24}
              className="w-6 h-6 opacity-80"
              unoptimized
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 leading-tight">{bookmark.title}</h2>
            <a
              href={bookmark.url}
              target="_blank"
              className="text-sm text-zinc-500 hover:text-blue-400 transition-colors mt-1 block truncate max-w-[200px]"
            >
              {hostname}
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <Globe size={12} /> Target URL
          </div>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg group relative block hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <span className="text-sm font-mono text-zinc-300 break-all group-hover:text-indigo-400 transition-colors">
              {bookmark.url}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(bookmark.url);
              }}
              className="absolute right-2 top-2 p-1.5 bg-zinc-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-700"
            >
              <Copy size={16} className="text-zinc-400 cursor-pointer" />
            </button>
          </a>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <List size={12} /> Description
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">
            {bookmark.description || "No description provided."}
          </p>
        </div>

        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <Hash size={12} /> Tags
            </div>
            <div className="flex gap-2 flex-wrap">
              {bookmark.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <Hash size={12} /> Category
            </div>
            <Badge className={categoryColor}>{bookmark.category.name}</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <Calendar size={12} /> Created
            </div>
            <span className="text-sm text-zinc-400">
              {format(new Date(bookmark.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/30 flex justify-between items-center rounded-b-2xl mt-auto">
        {isOwner ? (
          <form action={formAction}>
            <input type="hidden" name="bookmarkId" value={bookmark.id} />
            <Button
              variant="ghost"
              type="submit"
              disabled={isPending}
              className="text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-full"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" /> Delete
                </>
              )}
            </Button>
          </form>
        ) : (
          <div />
        )}
        <div className="flex gap-3">
          {isOwner && (
            <Button
              variant="ghost"
              onClick={() => onEdit(bookmark)}
              className="text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full"
            >
              Edit
            </Button>
          )}
          <Button
            onClick={() => window.open(bookmark.url, "_blank")}
            className="bg-zinc-100 text-zinc-950 hover:bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <ExternalLink size={16} className="mr-2" /> Visit
          </Button>
        </div>
      </div>
    </SheetShell>
  );
}
