'use client'
import CreateInteractionForm from "@/components/forms/createTweetForm";
import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useTweetStore from "@/store/tweetStore";
import TweetCard from "@/components/ui/tweetCard";
import Loader from "@/components/ui/Loader";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const { tweets, setTweets } = useTweetStore();
  const { toast } = useToast();


  async function getAllTweets() {
    try {
      const res = await axiosInstance.get('/tweets');
      setTweets(res.data)
    } catch (error) {
      console.log(error)
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
      toast({
        className: "shadcn-toast-failure",
        description: errorMessage
      });
    }
  };




  return (
    <div>
      <div className="cursor-pointer mt-2 mb-4 container mx-auto max-w-lg  p-0">
        <CreateInteractionForm
          action="Add"
        />
        <ul className="flex flex-col mb-20">
          {tweets.length === 0 ? (
            <div className="flex justify-center items-center mt-10">
              <span>
                <Loader />
              </span>
            </div>
          ) : (
            tweets.map((tweet) => (
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
            ))
          )}
        </ul>
      </div>
    </div>
  );
}





















