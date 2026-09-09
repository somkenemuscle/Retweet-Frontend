import TweetCard from "@/components/ui/tweetCard";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 border-b border-border px-4 py-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2.5 py-1">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

type TweetFeedProps = {
  tweets: Tweet[];
  loading: boolean;
  handleLikes: (id: string) => void;
  emptyTitle?: string;
  emptyHint?: string;
};

export default function TweetFeed({
  tweets,
  loading,
  handleLikes,
  emptyTitle = "Nothing here yet",
  emptyHint,
}: TweetFeedProps) {
  if (loading) return <FeedSkeleton />;

  if (tweets.length === 0) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="text-lg font-semibold">{emptyTitle}</p>
        {emptyHint && <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>}
      </div>
    );
  }

  return (
    <ul>
      {tweets.map((tweet) => (
        <TweetCard
          key={tweet._id}
          id={tweet._id}
          username={tweet.author.username}
          image={tweet.image}
          text={tweet.text}
          createdAt={tweet.createdAt}
          verification={tweet.author.verification}
          likes={tweet.likes}
          handleLikes={handleLikes}
        />
      ))}
    </ul>
  );
}
