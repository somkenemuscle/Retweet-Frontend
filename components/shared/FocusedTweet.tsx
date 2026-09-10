"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Heart,
    MessageCircle,
    Bookmark,
    Link2,
    MoreHorizontal,
    Trash2,
    BadgeCheck,
    Check,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useLikeTweet, useSaveTweet, useDeleteTweet } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function FocusedTweet({ tweet }: { tweet: Tweet }) {
    const router = useRouter();
    const like = useLikeTweet();
    const save = useSaveTweet();
    const del = useDeleteTweet();

    const [menuOpen, setMenuOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [justLiked, setJustLiked] = useState(false);

    const me = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    const username = tweet.author?.username ?? "";
    const liked = tweet.likes.some((l) => l.username === me);
    const isOwner = me === username;

    const when = new Date(tweet.createdAt).toLocaleString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const onLike = () => {
        if (!liked) setJustLiked(true);
        like.mutate(tweet._id);
    };

    const onSave = () => {
        setSaved((s) => !s);
        save.mutate(tweet._id);
    };

    const onDelete = () => {
        setMenuOpen(false);
        del.mutate(tweet._id, { onSuccess: () => router.push("/") });
    };

    const share = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            /* noop */
        }
    };

    return (
        <article className="border-b border-border px-4 pb-3 pt-3">
            <div className="flex items-center gap-3">
                <Link href={`/${username}`}>
                    <Avatar username={username} size={44} />
                </Link>
                <div className="min-w-0 flex-1">
                    <Link href={`/${username}`} className="flex items-center gap-1">
                        <span className="truncate font-semibold hover:underline">{username}</span>
                        {tweet.author?.verification && (
                            <BadgeCheck className="h-[17px] w-[17px] shrink-0 text-primary" />
                        )}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground">@{username}</p>
                </div>

                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="More"
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                            <MoreHorizontal className="h-[18px] w-[18px]" />
                        </button>
                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-lg">
                                    <button
                                        onClick={onDelete}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {tweet.text && (
                <p className="mt-3 whitespace-pre-wrap break-words text-[17px] leading-relaxed text-foreground">
                    {tweet.text}
                </p>
            )}

            {tweet.image && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-muted">
                    <Image
                        alt="Attached image"
                        src={tweet.image}
                        width={600}
                        height={400}
                        className="h-auto max-h-[600px] w-full object-cover"
                    />
                </div>
            )}

            <p className="mt-3 text-sm text-muted-foreground">{when}</p>

            <div className="mt-3 flex gap-5 border-y border-border py-3 text-sm">
                <span>
                    <span className="font-semibold text-foreground">{tweet.likes.length}</span>{" "}
                    <span className="text-muted-foreground">Likes</span>
                </span>
                <span>
                    <span className="font-semibold text-foreground">{tweet.comments?.length ?? 0}</span>{" "}
                    <span className="text-muted-foreground">Replies</span>
                </span>
            </div>

            <div className="mt-1 flex items-center justify-around text-muted-foreground">
                <button className="group rounded-full p-2.5 transition-colors hover:bg-primary/10 hover:text-primary" aria-label="Reply">
                    <MessageCircle className="h-[20px] w-[20px]" />
                </button>
                <button
                    onClick={onLike}
                    aria-label="Like"
                    aria-pressed={liked}
                    className={cn(
                        "group rounded-full p-2.5 transition-colors hover:bg-rose-500/10 hover:text-rose-500",
                        liked && "text-rose-500"
                    )}
                >
                    <Heart
                        onAnimationEnd={() => setJustLiked(false)}
                        className={cn("h-[20px] w-[20px]", liked && "fill-current", justLiked && "animate-pop")}
                    />
                </button>
                <button
                    onClick={onSave}
                    aria-label="Save"
                    aria-pressed={saved}
                    className={cn(
                        "rounded-full p-2.5 transition-colors hover:bg-primary/10 hover:text-primary",
                        saved && "text-primary"
                    )}
                >
                    <Bookmark className={cn("h-[20px] w-[20px]", saved && "fill-current")} />
                </button>
                <button
                    onClick={share}
                    aria-label="Copy link"
                    className="rounded-full p-2.5 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                    {copied ? <Check className="h-[20px] w-[20px] text-success" /> : <Link2 className="h-[20px] w-[20px]" />}
                </button>
            </div>
        </article>
    );
}
