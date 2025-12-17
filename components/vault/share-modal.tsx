"use client";

import { useState, useTransition } from "react";
import { Copy, Check, Globe, Lock, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { AccessType } from "@prisma/client";
import { updateVaultSettings } from "@/app/actions/vault";

interface ShareModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vaultId: string;
    vaultSlug: string;
    accessType: AccessType;
    isOwner: boolean;
}

const accessOptions = [
    {
        type: "PUBLIC" as AccessType,
        icon: Globe,
        label: "Public",
        description: "Anyone with the link can view",
        defaultColor: "border-zinc-800 bg-zinc-900/50",
        hoverColor: "hover:border-emerald-500/50 hover:bg-emerald-500/10",
        activeColor: "border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/30",
        iconDefaultColor: "text-zinc-500",
        iconHoverColor: "group-hover:text-emerald-400",
        iconActiveColor: "text-emerald-400"
    },
    {
        type: "PASSWORD" as AccessType,
        icon: Lock,
        label: "Password",
        description: "Require password to access",
        defaultColor: "border-zinc-800 bg-zinc-900/50",
        hoverColor: "hover:border-amber-500/50 hover:bg-amber-500/10",
        activeColor: "border-amber-500 bg-amber-500/20 ring-2 ring-amber-500/30",
        iconDefaultColor: "text-zinc-500",
        iconHoverColor: "group-hover:text-amber-400",
        iconActiveColor: "text-amber-400"
    },
    {
        type: "DISCORD_GATED" as AccessType,
        icon: Shield,
        label: "Discord",
        description: "Only server members",
        defaultColor: "border-zinc-800 bg-zinc-900/50",
        hoverColor: "hover:border-indigo-500/50 hover:bg-indigo-500/10",
        activeColor: "border-indigo-500 bg-indigo-500/20 ring-2 ring-indigo-500/30",
        iconDefaultColor: "text-zinc-500",
        iconHoverColor: "group-hover:text-indigo-400",
        iconActiveColor: "text-indigo-400"
    }
];

export function ShareModal({ open, onOpenChange, vaultId, vaultSlug, accessType, isOwner }: ShareModalProps) {
    const [selectedType, setSelectedType] = useState<AccessType>(accessType);
    const [password, setPassword] = useState("");
    const [discordGuildId, setDiscordGuildId] = useState("");
    const [copied, setCopied] = useState(false);
    const [isPending, startTransition] = useTransition();

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/v/${vaultSlug}`
        : `/v/${vaultSlug}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = () => {
        if (selectedType === "PASSWORD" && !password.trim()) {
            toast.error("Please enter a password");
            return;
        }
        if (selectedType === "DISCORD_GATED" && !discordGuildId.trim()) {
            toast.error("Please enter Discord Server ID");
            return;
        }

        startTransition(async () => {
            const formData = new FormData();
            formData.set("vaultId", vaultId);
            formData.set("accessType", selectedType);
            if (selectedType === "PASSWORD") formData.set("password", password);
            if (selectedType === "DISCORD_GATED") formData.set("discordGuildId", discordGuildId);

            const result = await updateVaultSettings({ success: false, message: "" }, formData);

            if (result.success) {
                toast.success("Access settings updated!");
                onOpenChange(false);
            } else {
                toast.error(result.message || "Failed to update settings");
            }
        });
    };

    const hasChanges = selectedType !== accessType;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Vault</DialogTitle>
                    <DialogDescription>
                        {isOwner ? "Choose who can access this vault" : "Share this vault with others"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Access Type Selector - Only for owners */}
                    {isOwner && (
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 uppercase tracking-wider">Access</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {accessOptions.map(option => {
                                    const Icon = option.icon;
                                    const isActive = selectedType === option.type;
                                    return (
                                        <button
                                            key={option.type}
                                            onClick={() => setSelectedType(option.type)}
                                            className={`group flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${isActive
                                                ? option.activeColor
                                                : `${option.defaultColor} ${option.hoverColor}`
                                                }`}
                                        >
                                            <Icon size={20} className={isActive ? option.iconActiveColor : `${option.iconDefaultColor} ${option.iconHoverColor}`} />
                                            <span className="text-xs font-medium text-zinc-200">{option.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Password Field */}
                    {isOwner && selectedType === "PASSWORD" && (
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs text-zinc-500 uppercase tracking-wider">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter vault password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-zinc-900/50 border-zinc-800"
                            />
                            <p className="text-xs text-zinc-500">Leave empty to keep current password</p>
                        </div>
                    )}

                    {/* Discord Guild ID Field */}
                    {isOwner && selectedType === "DISCORD_GATED" && (
                        <div className="space-y-2">
                            <Label htmlFor="discordGuildId" className="text-xs text-zinc-500 uppercase tracking-wider">
                                Discord Server ID
                            </Label>
                            <Input
                                id="discordGuildId"
                                type="text"
                                placeholder="Enter server ID"
                                value={discordGuildId}
                                onChange={(e) => setDiscordGuildId(e.target.value)}
                                className="bg-zinc-900/50 border-zinc-800"
                            />
                        </div>
                    )}

                    {/* Share Link */}
                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-500 uppercase tracking-wider">Share Link</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="bg-zinc-900/50 border-zinc-800 text-zinc-300"
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
                    </div>
                </div>

                {/* Footer with Save button for owners */}
                {isOwner && hasChanges && (
                    <DialogFooter>
                        <Button
                            onClick={handleSave}
                            disabled={isPending}
                            className="w-full"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
