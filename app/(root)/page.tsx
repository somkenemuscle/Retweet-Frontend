'use client';

import CreateInteractionForm from "@/components/forms/createTweetForm";
import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Navbar from "@/components/shared/Sidebar";
import useTweetStore from "@/store/tweetStore";
import { useInView } from "react-intersection-observer";


export default function Home() {
  const { tweets, setTweets } = useTweetStore((state: any) => ({
    tweets: state.tweets,
    setTweets: state.setTweets,
  }));

  const [page, setPage] = useState<number>(1); // Explicitly type as number
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  const [hasMore, setHasMore] = useState<boolean>(true); // Track if there are more tweets to load

  // Intersection Observer to detect when the user reaches the bottom of the page
  const { ref, inView } = useInView({
    threshold: 0.5, // Load more tweets when the user is 50% near the bottom
  });

  // Fetch tweets from the backend with pagination
  async function getTweets(page: number) {
    try {
      setLoading(true); // Start loading
      const res = await axiosInstance.get(`/tweets?page=${page}&limit=10`);
      if (res.data.length > 0) {
        // Append new tweets
        setTweets((prevTweets: Tweet[]) => [...prevTweets, ...res.data]);
      } else {
        setHasMore(false); // No more tweets to load
      }
      setLoading(false); // End loading
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // Fetch tweets on the first load and when the user scrolls to the bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      getTweets(page); // Fetch next page of tweets
      setPage((prevPage) => prevPage + 1); // Increment page number for next fetch
    }
  }, [inView, hasMore, loading]);

  return (
    <div className="dd">
      <Navbar />
      <div className="cursor-pointer mt-2 mb-4 container mx-auto max-w-lg p-0">
        <CreateInteractionForm action="Add" />
        <ul className="flex flex-col mb-20">
          {tweets.map((tweet: Tweet) => (
            <li key={tweet._id} className="border-gray-900 rounded-xl flex p-4 border-[0.5px]">
              <div className="flex flex-col flex-grow">
                <div className="flex items-center mb-2">
                  <Image
                    src='/assets/images/prof.png'
                    alt="profilepic"
                    width={100}
                    height={100}
                    className="w-8 h-8 rounded-full mr-2"
                    priority
                  />
                  <p className="text-white">
                    {tweet.author.username} <span className="text-gray-500">@{tweet.author.username}.</span> <span className="text-gray-500 text-sm">{new Date(tweet.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>

                <h4 className="text-md font-normal mb-2">{tweet.text}</h4>
                {tweet.image ? (
                  <Image
                    alt="tweet-image"
                    src={tweet.image}
                    width={200}
                    height={200}
                    className="w-full rounded-xl mt-4 mb-2"
                    layout="responsive"
                    priority
                  />
                ) : null}
                <Link className="text-blue-500 hover:underline text-sm mt-2" href={`/tweets/${tweet._id}`}>
                  View More
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {/* Loading Spinner */}
        {loading && <p className="text-center text-gray-500">Loading more tweets...</p>}

        {/* Empty space to detect the scroll */}
        <div ref={ref} className="infinite-scroll-trigger h-10"></div>

        {!hasMore && <p className="text-center text-gray-500">No more tweets to load.</p>}
      </div>
    </div>
  );
}
