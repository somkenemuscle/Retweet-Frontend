'use client';

import { useParams } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useTweetFeed } from '@/lib/useTweetFeed';
import ProfileHeader from '@/components/shared/ProfileHeader';
import TweetFeed from '@/components/shared/TweetFeed';

export default function ProfilePage() {
    const params = useParams();
    const username = String(params.username ?? '');

    const { tweets, loading, handleLikes } = useTweetFeed(async () => {
        const res = await axiosInstance.get(`/tweets/user/${username}`);
        return res.data;
    }, [username]);

    const verified = tweets.some(
        (t) => t.author.username === username && t.author.verification
    );

    return (
        <div>
            <ProfileHeader
                username={username}
                postCount={loading ? undefined : tweets.length}
                verified={verified}
            />
            <TweetFeed
                tweets={tweets}
                loading={loading}
                handleLikes={handleLikes}
                emptyTitle={`@${username} hasn't posted yet`}
                emptyHint="When they share something, it'll show up here."
            />
        </div>
    );
}
