import { FaDiscord } from "react-icons/fa";
import { DiscordConnectButton } from "@/shared/components/discord/discord-connect-button";
import { DiscordStatusBadge } from "@/shared/components/discord/discord-status-badge";
import { isTokenExpiringSoon } from "@/modules/vault/vault.utils";

interface DiscordConnectionCardProps {
  isConnected: boolean;
  tokenExpiresAt?: Date | null;
}

/**
 * Card displaying Discord connection status with connect/reconnect actions.
 * Composes smaller single-purpose components.
 */
export function DiscordConnectionCard({ isConnected, tokenExpiresAt }: DiscordConnectionCardProps) {
  const showExpiryWarning = isConnected && isTokenExpiringSoon(tokenExpiresAt);

  const statusText = isConnected
    ? "Your Discord account is linked."
    : "Connect to access Discord-gated vaults.";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center">
          <FaDiscord className="h-6 w-6 text-[#5865F2]" />
        </div>
        <div>
          <p className="font-medium text-zinc-200">Discord</p>
          <p className="text-sm text-zinc-500">{statusText}</p>
          {showExpiryWarning && (
            <p className="text-xs text-amber-400 mt-1">⚠️ Connection needs refresh</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isConnected ? (
          <>
            <DiscordStatusBadge />
            <DiscordConnectButton mode="reconnect" callbackURL="/settings" />
          </>
        ) : (
          <DiscordConnectButton mode="connect" callbackURL="/settings" />
        )}
      </div>
    </div>
  );
}
