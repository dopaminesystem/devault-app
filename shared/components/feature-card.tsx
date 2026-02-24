import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils";

interface FeatureCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  children?: ReactNode;
  customIcon?: ReactNode;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  className,
  headerClassName,
  titleClassName,
  descriptionClassName,
  iconClassName,
  children,
  customIcon,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "bg-card border-border/40 hover:border-primary/50 transition-colors group relative overflow-hidden rounded-none",
        className,
      )}
    >
      {children}
      <CardHeader className={cn("p-6", headerClassName)}>
        {customIcon ? (
          customIcon
        ) : Icon ? (
          <Icon className={cn("h-6 w-6 mb-4 text-foreground stroke-1", iconClassName)} />
        ) : null}
        <CardTitle className={cn("text-xl font-bold tracking-tighter", titleClassName)}>
          {title}
        </CardTitle>
      </CardHeader>
      {description && (
        <CardContent className="px-6 pb-6">
          <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>{description}</p>
        </CardContent>
      )}
    </Card>
  );
}
