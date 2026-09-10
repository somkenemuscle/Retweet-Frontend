'use client'
import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Trash2, BadgeCheck } from "lucide-react"
import Avatar from "@/components/ui/Avatar"
import { useDeleteComment } from "@/lib/api"
import { formatRelativeTime } from "@/lib/utils"

function CommentCard({ id, tweetId, username, text, createdAt, verification }: CommentCardProps) {
    const deleteComment = useDeleteComment(tweetId)
    const [menuOpen, setMenuOpen] = useState(false)

    const loggedInUsername = typeof window !== 'undefined' ? localStorage.getItem('username') : null
    const isOwner = loggedInUsername === username

    const handleDelete = () => {
        setMenuOpen(false)
        deleteComment.mutate(id)
    }

    return (
        <li className="flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/30">
            <Link href={`/${username}`} className="shrink-0">
                <Avatar username={username} size={36} />
            </Link>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[15px]">
                    <Link href={`/${username}`} className="truncate font-semibold hover:underline">
                        {username}
                    </Link>
                    {verification && (
                        <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />
                    )}
                    <span className="truncate text-muted-foreground">@{username}</span>
                    <span className="text-muted-foreground">·</span>
                    <time
                        title={new Date(createdAt).toLocaleString()}
                        className="shrink-0 text-muted-foreground"
                    >
                        {formatRelativeTime(createdAt)}
                    </time>

                    {isOwner && (
                        <div className="relative ml-auto">
                            <button
                                onClick={() => setMenuOpen((o) => !o)}
                                aria-label="More"
                                className="-mr-2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {menuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                    <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-lg">
                                        <button
                                            onClick={handleDelete}
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

                <p className="mt-0.5 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground">
                    {text}
                </p>
            </div>
        </li>
    )
}

export default CommentCard
