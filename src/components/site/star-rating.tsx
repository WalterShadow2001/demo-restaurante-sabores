"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  size?: number;
  className?: string;
}

export function StarRating({ value, size = 16, className }: StarRatingProps) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${value} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const half = !filled && n - 0.5 <= value;
        return (
          <Star
            key={n}
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              filled
                ? "fill-secondary text-secondary"
                : half
                ? "fill-secondary/50 text-secondary"
                : "fill-muted text-muted-foreground/40"
            )}
          />
        );
      })}
    </div>
  );
}
