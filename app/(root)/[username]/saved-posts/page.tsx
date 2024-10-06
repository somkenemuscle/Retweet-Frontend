'use client';

import { useParams } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState } from 'react';
import TweetCard from '@/components/ui/tweetCard';
import Loader from '@/components/ui/Loader';
import Link from 'next/link';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";


function TweetSaves() {
  const { toast } = useToast();
  const [SavedTweets, setSavedTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const params = useParams();
  const username = params.username;


  async function getSavedTweets() {
    try {
      setLoading(true); // Start loading when fetching tweets
      const res = await axiosInstance.get(`/tweets/${username}/saves`);
      setSavedTweets(res.data.savedTweets);
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
    } finally {
      setLoading(false); // Stop loading after fetching or error
    }
  }


  useEffect(() => {
    if (username) {
      getSavedTweets();
    }
  }, []);



  return (
    <div className="cursor-pointer mt-9 mb-24 container mx-auto max-w-lg p-0">
      <div className='border border-slate-900 p-3 mb-4 rounded-none sm:rounded-xl'>
        <Link href={'/'}>
          <span className='hover:bg-gray-700 text-gray-500 transition rounded-full p-2' aria-hidden="true">←</span>
          <span className='ml-8 text-gray-500 font-semibold'> {username ? `@${username} saved posts` : 'Account Not Found'}</span>
        </Link>
      </div>

      <ul className="flex flex-col mb-20">
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <Loader />
          </div>
        ) : SavedTweets.length === 0 ? (
          <div className="flex justify-center items-center mt-10">
            <span className='text-gray-400 mt-36'>You have not saved any post yet</span>
          </div>
        ) : (
          SavedTweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              id={tweet._id}
              username={tweet.author.username}
              image={tweet.image}
              text={tweet.text}
              createdAt={tweet.createdAt}
              verification={tweet.author.verification}
              likes={tweet.likes}

            />
          ))
        )}
      </ul>


    </div>
  );
}

export default TweetSaves;

