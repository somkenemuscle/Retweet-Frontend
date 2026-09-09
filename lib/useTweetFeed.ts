import type { DependencyList } from "react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "@/lib/toast";

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return (
        error.response.data?.error ||
        error.response.data?.message ||
        "An error occurred. Please try again."
      );
    }
    return "Network error. Please try again.";
  }
  return "An unexpected error occurred. Please try again later.";
}

/**
 * Loads a list of tweets from `fetcher` and provides an optimistic
 * like toggle. Shared by the home, profile and saved-posts feeds.
 */
export function useTweetFeed(
  fetcher: () => Promise<Tweet[]>,
  deps: DependencyList = []
) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(fetcher, deps);

  useEffect(() => {
    let active = true;
    setLoading(true);
    load()
      .then((data) => active && setTweets(data ?? []))
      .catch((err) => {
        if (active) toast.error(extractErrorMessage(err));
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [load]);

  const handleLikes = useCallback(async (tweetId: string) => {
    const me = localStorage.getItem("username");
    if (!me) return;

    let reverted: Tweet[] | null = null;
    setTweets((prev) => {
      reverted = prev;
      return prev.map((t) => {
        if (t._id !== tweetId) return t;
        const liked = t.likes.some((l) => l.username === me);
        return {
          ...t,
          likes: liked
            ? t.likes.filter((l) => l.username !== me)
            : [...t.likes, { username: me }],
        };
      });
    });

    try {
      await axiosInstance.post(`/tweets/${tweetId}/like`);
    } catch (error) {
      if (reverted) setTweets(reverted);
      toast.error(extractErrorMessage(error));
    }
  }, []);

  return { tweets, setTweets, loading, handleLikes };
}
