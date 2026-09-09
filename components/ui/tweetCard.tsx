'use client'
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    MessageCircle,
    Heart,
    Bookmark,
    MoreHorizontal,
    Trash2,
    BadgeCheck,
} from "lucide-react"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"
import { useToast } from "@/hooks/use-toast"
import useTweetStore from "@/store/tweetStore"
import Avatar from "@/components/ui/Avatar"
import { cn, formatRelativeTime } from "@/lib/utils"

function extractErrorMessage(error: any): string {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            return (
                error.response.data?.error ||
                error.response.data?.message ||
                'An error occurred. Please try again.'
            )
        }
        return 'Network error. Please try again.'
    }
    return 'An unexpected error occurred. Please try again later.'
}

function TweetCard({ id, username, text, image, createdAt, likes, verification, handleLikes }: TweetCardProps) {
    const { toast } = useToast()
    const { setTweets } = useTweetStore()
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)

    const loggedInUsername = typeof window !== 'undefined' ? localStorage.getItem('username') : null
    const userAlreadyLiked = likes.some((like) => like.username === loggedInUsername)
    const isOwner = loggedInUsername === username

    const rememberScroll = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('scrollPosition', window.scrollY.toString())
        }
    }

    const goToTweet = () => {
        rememberScroll()
        router.push(`/tweet/${id}`)
    }

    const handleSavedPost = async () => {
        try {
            const res = await axiosInstance.post(`/tweets/${id}/save`)
            toast({ className: "shadcn-toast-success", description: res.data.message })
        } catch (error: any) {
            toast({ className: "shadcn-toast-failure", description: extractErrorMessage(error) })
        }
    }

    const handleDelete = async () => {
        setMenuOpen(false)
        try {
            const res = await axiosInstance.delete(`/tweets/${id}`)
            const refreshed = await axiosInstance.get(`/tweets`)
            setTweets(refreshed.data)
            toast({ className: "shadcn-toast-success", description: res.data.message })
        } catch (error: any) {
            toast({ className: "shadcn-toast-failure", description: extractErrorMessage(error) })
        }
    }

    return (
        <article
            onClick={goToTweet}
            className="flex cursor-pointer gap-3 border-b border-border px-4 py-3.5 transition-colors hover:bg-muted/40"
        >
            <Link
                href={`/${username}`}
                onClick={(e) => { e.stopPropagation(); rememberScroll() }}
                className="shrink-0"
            >
                <Avatar username={username} size={40} />
            </Link>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[15px]">
                    <Link
                        href={`/${username}`}
                        onClick={(e) => { e.stopPropagation(); rememberScroll() }}
                        className="truncate font-semibold text-foreground hover:underline"
                    >
                        {username}
                    </Link>
                    {verification && (
                        <BadgeCheck className="h-[17px] w-[17px] shrink-0 text-primary" aria-label="Verified" />
                    )}
                    <span className="truncate text-muted-foreground">@{username}</span>
                    <span className="text-muted-foreground">·</span>
                    <time className="shrink-0 text-muted-foreground hover:underline">
                        {formatRelativeTime(createdAt)}
                    </time>

                    {isOwner && (
                        <div className="relative ml-auto">
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o) }}
                                aria-label="More"
                                className="-mr-2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                                <MoreHorizontal className="h-[18px] w-[18px]" />
                            </button>
                            {menuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={(e) => { e.stopPropagation(); setMenuOpen(false) }}
                                    />
                                    <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-lg">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete() }}
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

                {text && (
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground">
                        {text}
                    </p>
                )}

                {image && (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                        <Image
                            alt="Attached image"
                            src={image}
                            width={600}
                            height={400}
                            className="h-auto max-h-[520px] w-full object-cover"
                        />
                    </div>
                )}

                <div className="mt-2.5 flex items-center gap-1 text-muted-foreground">
                    <button
                        onClick={(e) => { e.stopPropagation(); goToTweet() }}
                        className="group flex items-center gap-1.5 rounded-full py-1 pr-2 text-[13px] transition-colors hover:text-primary"
                    >
                        <span className="rounded-full p-1.5 transition-colors group-hover:bg-primary/10">
                            <MessageCircle className="h-[18px] w-[18px]" />
                        </span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleLikes(id) }}
                        className={cn(
                            "group flex items-center gap-1.5 rounded-full py-1 pr-2 text-[13px] transition-colors hover:text-rose-500",
                            userAlreadyLiked && "text-rose-500"
                        )}
                    >
                        <span className="rounded-full p-1.5 transition-colors group-hover:bg-rose-500/10">
                            <Heart className={cn("h-[18px] w-[18px]", userAlreadyLiked && "fill-current")} />
                        </span>
                        {likes.length > 0 && <span>{likes.length}</span>}
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleSavedPost() }}
                        className="group ml-auto flex items-center rounded-full py-1 text-[13px] transition-colors hover:text-primary"
                    >
                        <span className="rounded-full p-1.5 transition-colors group-hover:bg-primary/10">
                            <Bookmark className="h-[18px] w-[18px]" />
                        </span>
                    </button>
                </div>
            </div>
        </article>
    )
}

export default TweetCard
