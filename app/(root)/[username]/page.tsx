'use client';

import { useParams } from 'next/navigation';
import { useUserTweets } from '@/lib/api';
import ProfileHeader from '@/components/shared/ProfileHeader';
import TweetFeed from '@/components/shared/TweetFeed';

export default function ProfilePage() {
    const params = useParams();
    const username = String(params.username ?? '');

    const { data: tweets = [], isLoading } = useUserTweets(username);

    const verified = tweets.some(
        (t) => t.author.username === username && t.author.verification
    );

    return (
        <div>
            <ProfileHeader
                username={username}
                postCount={isLoading ? undefined : tweets.length}
                verified={verified}
            />
            <TweetFeed
                tweets={tweets}
                loading={isLoading}
                emptyTitle={`@${username} hasn't posted yet`}
                emptyHint="When they share something, it'll show up here."
            />
        </div>
    );
}
