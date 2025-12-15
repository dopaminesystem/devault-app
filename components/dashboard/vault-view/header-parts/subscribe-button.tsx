import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SubscribeButtonProps {
    isSubscribing: boolean;
    onClick: () => void;
}

export function SubscribeButton({
    isSubscribing,
    onClick
}: SubscribeButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={isSubscribing}
            size="sm"
            className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white border-0 gap-1.5"
        >
            {isSubscribing ? (
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
