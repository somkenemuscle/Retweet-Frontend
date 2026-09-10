'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTweet } from '@/lib/api';
import FocusedTweet from '@/components/shared/FocusedTweet';
import CommentCard from '@/components/ui/commentCard';
import CreateCommentForm from '@/components/forms/createComment';
import { Skeleton } from '@/components/ui/skeleton';

function DetailSkeleton() {
    return (
        <div className="px-4 py-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
        </div>
    );
}

export default function TweetDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = String(params.id ?? '');
    const { data: tweet, isLoading, isError } = useTweet(id);

    return (
        <div>
            <header className="sticky top-0 z-30 flex items-center gap-5 border-b border-border bg-background/80 px-4 py-2.5 backdrop-blur">
                <button
                    onClick={() => router.back()}
                    aria-label="Back"
                    className="rounded-full p-2 transition-colors hover:bg-accent"
                >
                    <ArrowLeft className="h-[18px] w-[18px]" />
                </button>
                <h1 className="text-lg font-bold tracking-tight">Post</h1>
            </header>

            {isLoading ? (
                <DetailSkeleton />
            ) : isError || !tweet ? (
                <div className="px-8 py-16 text-center">
                    <p className="text-lg font-semibold">This post doesn&apos;t exist</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        It may have been deleted, or the link is wrong.
                    </p>
                </div>
            ) : (
                <>
                    <FocusedTweet tweet={tweet} />
                    <CreateCommentForm tweetId={id} action="Add" />

                    {tweet.comments && tweet.comments.length > 0 ? (
                        <ul>
                            {tweet.comments.map((comment) => (
                                <CommentCard
                                    key={comment._id}
                                    id={comment._id}
                                    tweetId={tweet._id}
                                    username={comment.author.username}
                                    text={comment.comment}
                                    createdAt={comment.createdAt}
                                    verification={comment.author.verification}
                                />
                            ))}
                        </ul>
                    ) : (
                        <div className="px-8 py-12 text-center text-sm text-muted-foreground">
                            No replies yet — be the first.
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
