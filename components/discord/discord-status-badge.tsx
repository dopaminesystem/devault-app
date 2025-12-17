import { CheckCircle2 } from "lucide-react";

/**
 * Status badge showing Discord connection state.
 * Single responsibility: Display connection status visually.
 */
export function DiscordStatusBadge() {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Connected
        </div>
    );
}
