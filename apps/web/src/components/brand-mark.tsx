import { Flag } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  compact?: boolean;
}

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
        <Flag className="size-5" aria-hidden="true" />
      </span>

      {!compact && (
        <span className="font-display text-2xl font-semibold tracking-tight">
          Snail GP
        </span>
      )}
    </div>
  );
}
