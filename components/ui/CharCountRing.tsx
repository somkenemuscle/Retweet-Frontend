import { cn } from "@/lib/utils";

/** Circular progress showing how close `count` is to `limit` (Twitter-style). */
export default function CharCountRing({
  count,
  limit = 280,
}: {
  count: number;
  limit?: number;
}) {
  const remaining = limit - count;
  const pct = Math.min(count / limit, 1);
  const r = 9;
  const c = 2 * Math.PI * r;

  const near = remaining <= 20;
  const over = remaining < 0;

  return (
    <div className="flex items-center gap-2">
      {near && !over && (
        <span className="text-xs tabular-nums text-muted-foreground">{remaining}</span>
      )}
      {over && (
        <span className="text-xs font-semibold tabular-nums text-destructive">
          {remaining}
        </span>
      )}
      <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
        <circle cx="12" cy="12" r={r} fill="none" stroke="currentColor" strokeWidth="2.5" className="text-border" />
        <circle
          cx="12"
          cy="12"
          r={r}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(pct, 1))}
          className={cn(
            "transition-[stroke-dashoffset] duration-200",
            over ? "text-destructive" : near ? "text-amber-500" : "text-primary"
          )}
        />
      </svg>
    </div>
  );
}
