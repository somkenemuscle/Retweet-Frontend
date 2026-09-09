import Link from "next/link";
import { Search } from "lucide-react";

export default function RightRail() {
  return (
    <div className="flex h-dvh flex-col gap-4 overflow-y-auto px-6 py-4">
      <Link
        href="/search"
        className="flex items-center gap-3 rounded-full border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="h-4 w-4" />
        Search Retweet
      </Link>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-base font-semibold">New around here?</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Retweet is a small, calmer social space. Post a thought, reply, and
          follow the conversations you actually care about.
        </p>
        <Link
          href="/sign-up"
          className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Create your account →
        </Link>
      </section>

      <footer className="px-1 text-xs leading-relaxed text-muted-foreground/70">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span className="cursor-default hover:text-muted-foreground">Terms</span>
          <span className="cursor-default hover:text-muted-foreground">Privacy</span>
          <span className="cursor-default hover:text-muted-foreground">About</span>
        </div>
        <p className="mt-2">© {new Date().getFullYear()} Retweet</p>
      </footer>
    </div>
  );
}
