"use client";

import { Link as LinkIcon, Loader2, Sparkles } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TOKENS } from "@/lib/constants";

interface URLInputSectionProps {
    url: string;
    onUrlChange: (url: string) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    isPending: boolean;
}

export function URLInputSection({ url, onUrlChange, isGenerating, onGenerate, isPending }: URLInputSectionProps) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <LinkIcon size={12} /> URL
            </label>
            <div className="flex gap-2">
                <Input
                    name="url"
                    type="text"
                    placeholder="https://example.com"
                    autoFocus
                    required
                    value={url}
                    onChange={(e) => onUrlChange(e.target.value)}
                    disabled={isPending || isGenerating}
                    className={TOKENS.input}
                />
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onGenerate}
                    disabled={!url || isGenerating || isPending}
                    className="shrink-0 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20 h-10 w-10 p-0"
                >
                    {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}
