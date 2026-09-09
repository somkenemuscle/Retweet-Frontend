'use client';

import { useParams } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useTweetFeed } from '@/lib/useTweetFeed';
import ProfileHeader from '@/components/shared/ProfileHeader';
import TweetFeed from '@/components/shared/TweetFeed';

export default function SavedPostsPage() {
    const params = useParams();
    const username = String(params.username ?? '');

    const { tweets, loading, handleLikes } = useTweetFeed(async () => {
        const res = await axiosInstance.get(`/tweets/${username}/saves`);
        return res.data.savedTweets;
    }, [username]);

    return (
        <div>
            <ProfileHeader username={username} />
            <TweetFeed
                tweets={tweets}
                loading={loading}
                handleLikes={handleLikes}
                emptyTitle="No saved posts"
                emptyHint="Posts you save with the bookmark icon land here."
            />
        </div>
    );
}
