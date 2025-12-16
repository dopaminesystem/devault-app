"use client";

import { useState } from "react";
import { Copy, Check, Globe, Lock, Shield, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AccessType } from "@prisma/client";

interface ShareModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vaultSlug: string;
    accessType: AccessType;
}

export function ShareModal({ open, onOpenChange, vaultSlug, accessType }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/v/${vaultSlug}`
        : `/v/${vaultSlug}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const accessInfo = {
        PUBLIC: {
            icon: Globe,
            label: "Public",
            description: "Anyone with the link can view this vault.",
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        },
        PASSWORD: {
            icon: Lock,
            label: "Password Protected",
            description: "Visitors need the password to access.",
            color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
        },
        DISCORD_GATED: {
            icon: Shield,
            label: "Server Gated",
            description: "Only Discord server members can access.",
            color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
        }
    };

    const currentAccess = accessInfo[accessType];
    const AccessIcon = currentAccess.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Vault</DialogTitle>
                    <DialogDescription>
                        Share this vault with others
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Current Access Type */}
                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${currentAccess.color}`}>
                        <AccessIcon size={20} />
                        <div>
                            <p className="font-medium text-sm">{currentAccess.label}</p>
                            <p className="text-xs text-zinc-400">{currentAccess.description}</p>
                        </div>
                    </div>

                    {/* Share Link */}
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopy}
                            className="shrink-0"
                        >
                            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        </Button>
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-2 text-xs text-zinc-500">
                        <Info size={14} className="shrink-0 mt-0.5" />
                        <p>You can change access settings anytime from the vault settings page.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
