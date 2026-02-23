import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/types";

interface UseActionToastOptions {
  successMessage?: string;
  errorMessage?: string;
  successDescription?: string;
  errorDescription?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export function useActionToast(state: ActionState | null, options: UseActionToastOptions = {}) {
  const prevStateRef = useRef<ActionState | null>(null);

  useEffect(() => {
    // Skip if state hasn't changed or is null
    if (!state || state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state.success) {
      toast.success(options.successMessage || state.message || "Success!", {
        description: options.successDescription,
        duration: 5000,
      });
      options.onSuccess?.();
    } else if (state.error) {
      toast.error(options.errorMessage || state.error || "Something went wrong", {
        description: options.errorDescription,
        duration: 7000,
      });
      options.onError?.();
    }

    // Handle validation errors
    if (state.fieldErrors) {
      const errors = Object.entries(state.fieldErrors)
        .map(([field, messages]) => `${field}: ${(messages as string[])?.[0]}`)
        .join(", ");

      if (errors) {
        toast.error("Validation failed", {
          description: errors,
        });
      }
    }
  }, [state, options]);
}
