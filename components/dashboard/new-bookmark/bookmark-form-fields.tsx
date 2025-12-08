"use client";

import { Type, List, Hash } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TOKENS } from "@/lib/constants";

interface BookmarkFormFieldsProps {
    title: string;
    onTitleChange: (value: string) => void;
    description: string;
    onDescriptionChange: (value: string) => void;
    isPending: boolean;
}

export function BookmarkFormFields({
    title,
    onTitleChange,
    description,
    onDescriptionChange,
    isPending
}: BookmarkFormFieldsProps) {
    return (
        <>
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <Type size={12} /> Title
                </label>
                <Input
                    name="title"
                    type="text"
                    placeholder="e.g., Amazing Design Tool"
                    disabled={isPending}
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className={TOKENS.input}
                />
            </div>
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <List size={12} /> Description
                </label>
                <Textarea
                    name="description"
                    rows={4}
                    placeholder="What makes this link special?"
                    className="resize-none bg-zinc-900/50 border-zinc-800 focus:ring-indigo-500/50"
                    disabled={isPending}
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <Hash size={12} /> Tags
                </label>
                <Input
                    name="tags"
                    type="text"
                    placeholder="design, tools, inspiration (comma separated)"
                    disabled={isPending}
                    className={TOKENS.input}
                />
            </div>
        </>
    );
}
