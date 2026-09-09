import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/shared/Logo";

const highlights = [
  "Post a thought, start a thread",
  "Reply, retweet, and save what matters",
  "Follow the conversations you care about",
];

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.15fr_1fr]">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden overflow-hidden bg-[hsl(222_47%_6%)] px-12 py-14 text-white lg:flex lg:flex-col xl:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            background:
              "radial-gradient(circle at 20% 15%, hsl(214 95% 55%) 0, transparent 45%), radial-gradient(circle at 85% 90%, hsl(262 83% 60%) 0, transparent 40%)",
          }}
        />
        <svg
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/2 h-[560px] w-[560px] -translate-y-1/2 text-white/[0.05]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
        >
          {[30, 55, 80, 100].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} strokeWidth="1" />
          ))}
        </svg>

        <div className="relative">
          <Link href="/" className="inline-flex text-white">
            <Logo size={34} />
          </Link>
        </div>

        <div className="relative mt-auto max-w-md">
          <h2 className="text-[34px] font-semibold leading-[1.15] tracking-tight xl:text-[40px]">
            Where conversations start.
          </h2>
          <ul className="mt-8 space-y-3.5">
            {highlights.map((line) => (
              <li key={line} className="flex items-center gap-3 text-[15px] text-white/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </span>
                {line}
              </li>
            ))}
          </ul>

          <figure className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <blockquote className="text-[15px] leading-relaxed text-white/80">
              “Retweet is the first feed in years that actually feels like people
              talking, not shouting.”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <Image
                src="/assets/images/prof.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15"
              />
              <span className="text-sm">
                <span className="block font-medium text-white">Somkene O.</span>
                <span className="block text-white/50">Early member</span>
              </span>
            </figcaption>
          </figure>
        </div>

        <p className="relative mt-14 text-xs text-white/40">
          © {new Date().getFullYear()} Retweet
        </p>
      </aside>

      {/* Form column */}
      <main className="flex min-h-dvh flex-col px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between lg:hidden">
          <Link href="/">
            <Logo size={30} />
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back home
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px] animate-fade-in-up py-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
