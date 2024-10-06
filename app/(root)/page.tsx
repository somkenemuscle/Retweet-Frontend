'use client'
import CreateInteractionForm from "@/components/forms/createTweetForm";
import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useTweetStore from "@/store/tweetStore";
import TweetCard from "@/components/ui/tweetCard";
import Loader from "@/components/ui/Loader";



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
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
}





















