"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, BadgeCheck, Link2, Check } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

type ProfileHeaderProps = {
  username: string;
  postCount?: number;
  verified?: boolean;
};

export default function ProfileHeader({ username, postCount, verified }: ProfileHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMe(localStorage.getItem("username")), []);

  const isOwn = me === username;
  const tabs = [
    { href: `/${username}`, label: "Posts" },
    { href: `/${username}/saved-posts`, label: "Saved" },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="border-b border-border">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-5 bg-background/80 px-4 py-2 backdrop-blur">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="rounded-full p-2 transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate font-bold leading-tight">
            {username}
            {verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
          </p>
          {typeof postCount === "number" && (
            <p className="text-xs text-muted-foreground">
              {postCount} {postCount === 1 ? "post" : "posts"}
            </p>
          )}
        </div>
      </div>

      {/* Banner */}
      <div className="h-32 w-full bg-gradient-to-br from-primary/25 via-primary/10 to-[hsl(262_60%_45%)]/20 sm:h-40" />

      {/* Identity */}
      <div className="px-4 pb-3">
        <div className="flex items-end justify-between">
          <div className="-mt-12 rounded-full ring-4 ring-background sm:-mt-14">
            <Avatar username={username} size={92} className="ring-0" />
          </div>
          <button
            onClick={copyLink}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-accent"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" /> Copied
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" /> Share
              </>
            )}
          </button>
        </div>

        <div className="mt-3">
          <h1 className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight">
            {username}
            {verified && <BadgeCheck className="h-5 w-5 text-primary" />}
          </h1>
          <p className="text-[15px] text-muted-foreground">@{username}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {isOwn ? "This is you." : "On Retweet"}
            {typeof postCount === "number" && (
              <>
                {" · "}
                <span className="font-medium text-foreground">{postCount}</span> posts
              </>
            )}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="group relative flex-1 py-3.5 text-center text-[15px] transition-colors hover:bg-accent/50"
            >
              <span className={cn("font-medium", active ? "text-foreground" : "text-muted-foreground")}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute inset-x-0 bottom-0 mx-auto h-1 w-14 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
