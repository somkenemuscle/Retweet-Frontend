"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { toast } from "./toast";

/* ------------------------------------------------------------------ *
 * Keys
 * ------------------------------------------------------------------ */
export const qk = {
  tweets: ["tweets"] as const,
  tweet: (id: string) => ["tweets", id] as const,
  userTweets: (u: string) => ["tweets", "user", u] as const,
  savedTweets: ["tweets", "saves"] as const,
  savedTweetsFor: (u: string) => ["tweets", "saves", u] as const,
  search: (q: string) => ["search", q] as const,
};

export function apiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      (error.response
        ? "Something went wrong. Please try again."
        : "Network error. Please check your connection.")
    );
  }
  return "An unexpected error occurred. Please try again later.";
}

/* ------------------------------------------------------------------ *
 * Queries
 * ------------------------------------------------------------------ */
export function useTweets() {
  return useQuery({
    queryKey: qk.tweets,
    queryFn: async () => (await axiosInstance.get<Tweet[]>("/tweets")).data,
  });
}

export function useUserTweets(username: string) {
  return useQuery({
    queryKey: qk.userTweets(username),
    queryFn: async () =>
      (await axiosInstance.get<Tweet[]>(`/tweets/user/${username}`)).data,
    enabled: !!username,
  });
}

export function useSavedTweets(username: string) {
  return useQuery({
    queryKey: qk.savedTweetsFor(username),
    queryFn: async () =>
      (await axiosInstance.get(`/tweets/${username}/saves`)).data
        .savedTweets as Tweet[],
    enabled: !!username,
  });
}

export function useTweet(id: string) {
  return useQuery({
    queryKey: qk.tweet(id),
    queryFn: async () =>
      (await axiosInstance.get(`/tweets/${id}`)).data.foundTweet as Tweet,
    enabled: !!id,
  });
}

export function useSearchUsers(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: qk.search(q),
    queryFn: async () =>
      (await axiosInstance.get(`/auth/search/${encodeURIComponent(q)}`)).data
        .usernames as string[],
    enabled: q.length > 0,
    placeholderData: (prev) => prev,
  });
}

/* ------------------------------------------------------------------ *
 * Mutations
 * ------------------------------------------------------------------ */
function toggleLikeInCache(
  data: Tweet | Tweet[] | undefined,
  tweetId: string,
  me: string
): Tweet | Tweet[] | undefined {
  if (!data) return data;
  const apply = (t: Tweet): Tweet => {
    if (t._id !== tweetId) return t;
    const liked = t.likes.some((l) => l.username === me);
    return {
      ...t,
      likes: liked
        ? t.likes.filter((l) => l.username !== me)
        : [...t.likes, { username: me }],
    };
  };
  return Array.isArray(data) ? data.map(apply) : apply(data);
}

export function useCreateTweet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { text?: string; image?: string }) =>
      axiosInstance.post("/tweets", body),
    onSuccess: (res) => {
      toast.success(res.data?.message ?? "Posted");
      qc.invalidateQueries({ queryKey: qk.tweets });
    },
    onError: (err) => toast.error(apiError(err)),
  });
}

export function useLikeTweet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tweetId: string) => axiosInstance.post(`/tweets/${tweetId}/like`),
    onMutate: async (tweetId) => {
      const me = localStorage.getItem("username");
      if (!me) return { snapshots: [] as [readonly unknown[], unknown][] };
      await qc.cancelQueries({ queryKey: qk.tweets });
      const snapshots = qc.getQueriesData({ queryKey: qk.tweets });
      qc.setQueriesData({ queryKey: qk.tweets }, (old: any) =>
        toggleLikeInCache(old, tweetId, me)
      );
      return { snapshots };
    },
    onError: (err, _tweetId, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(apiError(err));
    },
  });
}

export function useSaveTweet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tweetId: string) => axiosInstance.post(`/tweets/${tweetId}/save`),
    onSuccess: (res) => {
      toast.success(res.data?.message ?? "Saved");
      qc.invalidateQueries({ queryKey: qk.savedTweets });
    },
    onError: (err) => toast.error(apiError(err)),
  });
}

export function useDeleteTweet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tweetId: string) => axiosInstance.delete(`/tweets/${tweetId}`),
    onSuccess: (res) => {
      toast.success(res.data?.message ?? "Post deleted");
      qc.invalidateQueries({ queryKey: qk.tweets });
    },
    onError: (err) => toast.error(apiError(err)),
  });
}

export function useCreateComment(tweetId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (comment: string) =>
      axiosInstance.post(`/tweets/${tweetId}/comments`, { comment }),
    onSuccess: (res) => {
      toast.success(res.data?.message ?? "Reply posted");
      invalidateTweet(qc, tweetId);
    },
    onError: (err) => toast.error(apiError(err)),
  });
}

export function useDeleteComment(tweetId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) =>
      axiosInstance.delete(`/tweets/${tweetId}/comments/${commentId}`),
    onSuccess: (res) => {
      toast.success(res.data?.message ?? "Reply deleted");
      invalidateTweet(qc, tweetId);
    },
    onError: (err) => toast.error(apiError(err)),
  });
}

function invalidateTweet(qc: QueryClient, tweetId: string) {
  qc.invalidateQueries({ queryKey: qk.tweet(tweetId) });
  qc.invalidateQueries({ queryKey: qk.tweets });
}
