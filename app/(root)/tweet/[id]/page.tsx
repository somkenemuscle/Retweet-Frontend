'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from '@/lib/toast';
import { ArrowLeft } from 'lucide-react';
import useCommentStore from '@/store/commentStore';
import FocusedTweet from '@/components/shared/FocusedTweet';
import CommentCard from '@/components/ui/commentCard';
import CreateCommentForm from '@/components/forms/createComment';
import { Skeleton } from '@/components/ui/skeleton';

function errMsg(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.error ||
            error.response?.data?.message ||
            (error.response ? 'An error occurred. Please try again.' : 'Network error. Please try again.')
        );
    }
    return 'An unexpected error occurred. Please try again later.';
}

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
    const { tweet, setTweet } = useCommentStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setLoading(true);
        axiosInstance
            .get(`/tweets/${id}`)
            .then((res) => active && setTweet(res.data.foundTweet))
            .catch((error) => active && toast.error(errMsg(error)))
            .finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleLike = async () => {
        const me = localStorage.getItem('username');
        if (!me || !tweet || tweet._id !== id) return;

        const liked = tweet.likes.some((l) => l.username === me);
        const prev = tweet;
        setTweet({
            ...tweet,
            likes: liked
                ? tweet.likes.filter((l) => l.username !== me)
                : [...tweet.likes, { username: me }],
        });

        try {
            await axiosInstance.post(`/tweets/${id}/like`);
        } catch (error) {
            setTweet(prev);
            toast.error(errMsg(error));
        }
    };

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

            {loading ? (
                <DetailSkeleton />
            ) : !tweet ? (
                <div className="px-8 py-16 text-center">
                    <p className="text-lg font-semibold">This post doesn&apos;t exist</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        It may have been deleted, or the link is wrong.
                    </p>
                </div>
            ) : (
                <>
                    <FocusedTweet tweet={tweet} onLike={handleLike} />
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
