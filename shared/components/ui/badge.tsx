import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/shared/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors border border-transparent",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ds-text-primary text-ds-canvas hover:bg-ds-text-primary/80",
        secondary:
          "border-transparent bg-ds-surface-raised text-ds-text-primary hover:bg-ds-surface-hovered",
        destructive: "border-transparent bg-destructive text-white hover:bg-destructive/80",
        outline: "text-ds-text-primary border-ds-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
