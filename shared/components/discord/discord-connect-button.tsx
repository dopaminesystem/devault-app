"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { authClient } from "@/shared/auth/auth-client";
import { Button } from "@/shared/components/ui/button";

interface DiscordConnectButtonProps {
  /** URL to return to after Discord OAuth */
  callbackURL?: string;
  /** Button display mode */
  mode: "connect" | "reconnect";
  className?: string;
}

/**
 * Button for connecting or reconnecting Discord account.
 * Single responsibility: Trigger Discord OAuth flow.
 */
export function DiscordConnectButton({
  callbackURL = "/settings",
  mode,
  className,
  ...props
}: DiscordConnectButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    await authClient.signIn.social({
      provider: "discord",
      callbackURL,
    });
  };

  if (mode === "reconnect") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isPending}
        className={className ?? "text-zinc-400 hover:text-[#5865F2] hover:bg-[#5865F2]/10"}
        title="Reconnect Discord to refresh permissions"
        {...props}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        <span className="ml-2 hidden sm:inline">Reconnect</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className={className ?? "bg-[#5865F2] hover:bg-[#4752C4] text-white"}
      {...props}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FaDiscord className="mr-2 h-4 w-4" />
      )}
      Connect Discord
    </Button>
  );
}
