import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
  /** size of the glyph in px */
  size?: number;
};

/**
 * Retweet brand mark — the classic "retweet" loop of two chasing arrows,
 * set in a rounded tile. Pair with the wordmark for headers and auth.
 */
export function LogoMark({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[28%] bg-primary text-primary-foreground shadow-sm",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size * 0.62, height: size * 0.62 }}
      >
        <path d="M4 9V8a3 3 0 0 1 3-3h9" />
        <path d="m13 2 3 3-3 3" />
        <path d="M20 15v1a3 3 0 0 1-3 3H8" />
        <path d="m11 22-3-3 3-3" />
      </svg>
    </span>
  );
}

export default function Logo({ className, showWordmark = true, size = 32 }: LogoProps) {
  return (
    <span className={cn("inline-flex select-none items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight">Retweet</span>
      )}
    </span>
  );
}
