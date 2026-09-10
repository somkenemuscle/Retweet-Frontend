'use client'
import { useEffect } from "react";
import CreateInteractionForm from "@/components/forms/createTweetForm";
import TweetFeed from "@/components/shared/TweetFeed";
import { useTweets } from "@/lib/api";

export default function Home() {
  const { data: tweets = [], isLoading } = useTweets();

  // Restore scroll position after navigating back from a post.
  useEffect(() => {
    if (isLoading) return;
    const y = localStorage.getItem("scrollPosition");
    if (y) {
      window.scrollTo(0, parseInt(y, 10));
      localStorage.removeItem("scrollPosition");
    }
  }, [isLoading]);

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-4 py-3.5 backdrop-blur">
        <h1 className="text-xl font-bold tracking-tight">Home</h1>
      </header>

      <CreateInteractionForm action="Add" />

      <TweetFeed
        tweets={tweets}
        loading={isLoading}
        emptyTitle="No posts yet"
        emptyHint="When people start posting, you'll see it here."
      />
    </div>
  );
}
