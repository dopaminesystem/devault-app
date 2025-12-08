"use client";

import { Type, List, Hash } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TOKENS } from "@/lib/constants";
import { ShineBorder } from "@/components/ui/shine-border";

interface BookmarkFormFieldsProps {
    title: string;
    onTitleChange: (value: string) => void;
    description: string;
    onDescriptionChange: (value: string) => void;
    isPending: boolean;
    isGenerating: boolean;
}

export function BookmarkFormFields({
    title,
    onTitleChange,
    description,
    onDescriptionChange,
    isPending,
    isGenerating
}: BookmarkFormFieldsProps) {
    return (
        <>
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <Type size={12} /> Title
                </label>
                <div className="relative group rounded-md">
                    <Input
                        name="title"
                        type="text"
                        placeholder="e.g., Amazing Design Tool"
                        disabled={isPending || isGenerating}
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className={`${TOKENS.input} relative z-10 transition-all duration-300 ${isGenerating ? 'border-transparent focus:border-transparent' : ''}`}
                    />
                    {isGenerating && (
                        <ShineBorder
                            className="absolute inset-0 z-0 rounded-md"
                            shineColor={["#6366f1", "#a855f7", "#ec4899"]} // Indigo, Purple, Pink
                            duration={8}
                            borderWidth={1.5}
                        />
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <List size={12} /> Description
                </label>
                <div className="relative group rounded-md">
                    <Textarea
                        name="description"
                        rows={4}
                        placeholder="What makes this link special?"
                        className={`resize-none bg-zinc-900/50 border-zinc-800 focus:ring-indigo-500/50 relative z-10 transition-all duration-300 ${isGenerating ? 'border-transparent focus:border-transparent' : ''}`}
                        disabled={isPending || isGenerating}
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                    />
                    {isGenerating && (
                        <ShineBorder
                            className="absolute inset-0 z-0 rounded-md"
                            shineColor={["#6366f1", "#a855f7", "#ec4899"]}
                            duration={8}
                            borderWidth={1.5}
                        />
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <Hash size={12} /> Tags
                </label>
                <Input
                    name="tags"
                    type="text"
                    placeholder="design, tools, inspiration (comma separated)"
                    disabled={isPending || isGenerating}
                    className={TOKENS.input}
                />
            </div>
        </>
    );
}
