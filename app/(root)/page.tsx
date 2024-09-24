'use client'
import CreateInteractionForm from "@/components/forms/createTweetForm";
import { useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import useTweetStore from "@/store/tweetStore";


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
                    {tweet.author.username} <span className="text-gray-500">@{tweet.author.username}.</span>  <span className="text-gray-500 text-sm">{new Date(tweet.createdAt).toLocaleDateString()}</span>
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
      </div>

    </div>
  );
}





















