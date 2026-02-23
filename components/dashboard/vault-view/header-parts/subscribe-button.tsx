import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscribeButtonProps {
  isLoadingSubscription: boolean;
  onClick: () => void;
}

export function SubscribeButton({ isLoadingSubscription, onClick }: SubscribeButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoadingSubscription}
      variant="outline"
      className="rounded-lg"
    >
      {isLoadingSubscription ? (
        <>
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>Subscribing...</span>
        </>
      ) : (
        <>
          <UserPlus size={14} />
          <span>Subscribe</span>
        </>
      )}
    </Button>
  );
}
