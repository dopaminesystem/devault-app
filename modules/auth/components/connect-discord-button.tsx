"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { authClient } from "@/shared/auth/auth-client";
import { Button } from "@/shared/components/ui/button";

export function ConnectDiscordButton() {
  const [isPending, setIsPending] = useState(false);

  const handleConnect = async () => {
    setIsPending(true);
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/settings",
    });
    // Note: setIsPending(false) might not be needed if redirect happens,
    // but good for safety if it fails or takes time.
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FaDiscord className="mr-2 h-4 w-4" />
      )}
      Connect Discord Account
    </Button>
  );
}
