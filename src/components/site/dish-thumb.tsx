import { cn } from "@/lib/utils";

/**
 * Renders a dish "imagen" field. When the value is an http(s) URL it shows
 * a real photo via <img>. Otherwise it falls back to rendering the raw
 * value as text (legacy behaviour — usually an emoji).
 *
 * Intentionally a Server Component (no `"use client"`): it only renders
 * static markup and contains no client-only hooks or event handlers, so it
 * works in both Server and Client component trees. Client components that
 * import it simply bundle it along with themselves.
 *
 * The component is intentionally presentational: callers wrap it in a
 * container that defines the size/aspect-ratio/rounded corners.
 */
export function isImageUrl(value: string): boolean {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

interface DishThumbProps {
  /** The raw `imagen` field — either a URL or an emoji/string. */
  src: string;
  /** Alt text (dish name) — used for both <img alt> and aria-label. */
  alt: string;
  /** Tailwind classes applied to the <img> (when URL) or the emoji span. */
  className?: string;
  /** Tailwind classes applied to the emoji span only. */
  emojiClassName?: string;
  /** Extra className for the wrapping element (optional). */
  wrapperClassName?: string;
}

export function DishThumb({
  src,
  alt,
  className,
  emojiClassName,
}: DishThumbProps) {
  if (isImageUrl(src)) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={alt}
      className={cn("leading-none select-none", emojiClassName)}
    >
      {src || "🍽️"}
    </span>
  );
}
