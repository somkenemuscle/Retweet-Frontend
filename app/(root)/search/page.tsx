'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Search, X, ChevronRight } from "lucide-react"
import { useSearchUsers } from "@/lib/api"
import Avatar from "@/components/ui/Avatar"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchPage() {
    const [value, setValue] = useState("")
    const [debounced, setDebounced] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value.trim()), 300)
        return () => clearTimeout(t)
    }, [value])

    const { data: results = [], isFetching } = useSearchUsers(debounced)

    const clear = () => {
        setValue("")
        inputRef.current?.focus()
    }

    const hasQuery = debounced.length > 0
    const showLoading = hasQuery && isFetching && results.length === 0
    const showEmpty = hasQuery && !isFetching && results.length === 0

    return (
        <div>
            <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
                <h1 className="mb-3 text-xl font-bold tracking-tight">Search</h1>
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        autoFocus
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Escape" && clear()}
                        placeholder="Search people by username"
                        className="h-11 w-full rounded-full border border-input bg-muted/50 pl-11 pr-10 text-[15px] outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-ring focus:bg-background focus:shadow-focus"
                    />
                    {value && (
                        <button
                            onClick={clear}
                            aria-label="Clear search"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-muted p-1 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </header>

            {!hasQuery && (
                <div className="px-8 py-16 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="font-semibold">Find people on Retweet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Start typing a username to see matching accounts.
                    </p>
                </div>
            )}

            {showLoading && (
                <ul>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <li key={i} className="flex items-center gap-3 px-4 py-3">
                            <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-3.5 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {showEmpty && (
                <div className="px-8 py-16 text-center">
                    <p className="font-semibold">No people found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Nothing matched “{debounced}”. Try a different username.
                    </p>
                </div>
            )}

            {results.length > 0 && (
                <ul>
                    {results.map((username) => (
                        <li key={username}>
                            <Link
                                href={`/${username}`}
                                className="group flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/40"
                            >
                                <Avatar username={username} size={44} />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold">{username}</p>
                                    <p className="truncate text-sm text-muted-foreground">@{username}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
