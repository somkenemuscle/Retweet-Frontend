'use client'
import CreateInteractionForm from "@/components/forms/createTweetForm";
import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useTweetStore from "@/store/tweetStore";
import TweetCard from "@/components/ui/tweetCard";




export default function Home() {
  const { tweets, setTweets } = useTweetStore();

  async function getAllTweets() {
    try {
      const res = await axiosInstance.get('/tweets');
      setTweets(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllTweets();
  }, []);



  return (
    <div className="dd">
      <div className="cursor-pointer mt-2 mb-4 container mx-auto max-w-lg  p-0">
        <CreateInteractionForm
          action="Add"
        />
        <ul className="flex flex-col mb-20 ">
          {tweets.map((tweet) => (
            <TweetCard
              id={tweet._id}
              username={tweet.author.username}
              image={tweet.image}
              text={tweet.text}
              createdAt={tweet.createdAt}
            />
          ))}
        </ul>
      </div>

    </div>
  );
}





















