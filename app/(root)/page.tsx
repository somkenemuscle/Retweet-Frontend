'use client'
import CreateInteractionForm from "@/components/forms/createTweetForm";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useTweetStore from "@/store/tweetStore";
import TweetCard from "@/components/ui/tweetCard";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "@/lib/toast";


function FeedSkeleton() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
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


export default function Home() {
  const { tweets, setTweets } = useTweetStore();
  const [loading, setLoading] = useState(true);


  async function getAllTweets() {
    try {
      const res = await axiosInstance.get('/tweets');
      setTweets(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  function getPosition() {
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
      localStorage.removeItem('scrollPosition');
    }
  }

  useEffect(() => {
    getAllTweets();
    getPosition();
  }, []);




  const handleLikes = async (tweetId: string) => {
    // Get the logged-in username from localStorage
    const loggedInUsername = localStorage.getItem('username');
    // Ensure the loggedInUsername is a string and not null
    if (!loggedInUsername) {
      console.error('No logged-in user found.');
      return;
    }
    // Find the tweet in the state
    const tweetIndex = tweets.findIndex((tweet) => tweet._id === tweetId);
    if (tweetIndex === -1) return; // If tweet is not found, return early

    const tweet = tweets[tweetIndex];

    // Check if the current user has already liked the tweet
    const userAlreadyLiked = tweet.likes.some((like) => like.username === loggedInUsername);

    // Optimistically update the UI
    const updatedLikes = userAlreadyLiked
      ? tweet.likes.filter((like) => like.username !== loggedInUsername)  // Unlike
      : [...tweet.likes, { username: loggedInUsername }];  // Like

    // Update the state optimistically
    const updatedTweets = [...tweets];
    updatedTweets[tweetIndex] = {
      ...tweet,
      likes: updatedLikes
    };
    setTweets(updatedTweets);  // Update the state with optimistic changes


    try {
      const res = await axiosInstance.post(`/tweets/${tweetId}/like`);
      console.log(res.data)

    } catch (error: any) {
      console.error('Error occurred during signin:', error);

      // Default error message
      let errorMessage = 'An error occurred. Please try again.';

      // Check if the error is an Axios error
      if (axios.isAxiosError(error)) {
        // Check for a response error
        if (error.response) {
          // Extract message from response if available
          const responseMessage = error.response.data?.error;
          if (responseMessage) {
            errorMessage = responseMessage;
          } else {
            errorMessage = error.response.data?.message || errorMessage;
          }
        } else {
          // Handle cases where no response is available (e.g., network errors)
          errorMessage = 'Network error. Please try again.';
        }
      } else {
        // Handle unexpected error types
        errorMessage = 'An unexpected error occurred. Please try again later.';
      }

      // Show error toast notification
      toast.error(errorMessage);
    }
  };




  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-4 py-3.5 backdrop-blur">
        <h1 className="text-xl font-bold tracking-tight">Home</h1>
      </header>

      <CreateInteractionForm action="Add" />

      {loading ? (
        <FeedSkeleton />
      ) : tweets.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-lg font-semibold">No posts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When people start posting, you&apos;ll see it here.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}





















