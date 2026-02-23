import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-xl border border-ds-border bg-ds-surface-raised px-3 py-2 text-sm text-ds-text-primary shadow-sm transition-colors placeholder:text-ds-text-muted focus:outline-none focus:ring-1 focus:ring-[--comp-input-ring] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
