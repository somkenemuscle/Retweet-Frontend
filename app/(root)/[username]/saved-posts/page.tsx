'use client';

import { useParams } from 'next/navigation';
import { useSavedTweets } from '@/lib/api';
import ProfileHeader from '@/components/shared/ProfileHeader';
import TweetFeed from '@/components/shared/TweetFeed';

export default function SavedPostsPage() {
    const params = useParams();
    const username = String(params.username ?? '');

    const { data: tweets = [], isLoading } = useSavedTweets(username);

    return (
        <div>
            <ProfileHeader username={username} />
            <TweetFeed
                tweets={tweets}
                loading={isLoading}
                emptyTitle="No saved posts"
                emptyHint="Posts you save with the bookmark icon land here."
            />
        </div>
    );
}
