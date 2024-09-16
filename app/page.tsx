'use client'
import CreateInteractionForm from "@/components/forms/createTweetForm";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Navbar from "@/components/shared/Sidebar";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [tweets, setTweets] = useState<Tweet[]>([]);



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
    const username = localStorage.getItem('username');
    if (username) {
      setUsername(username);
    }
  }, []);

  const handleLogout = async () => {
    try {

      // Redirect user to login or home page
      router.push('/sign-in');
      // Send request to backend to invalidate the session or token
      const res = await axiosInstance.post('/auth/logout', {}, { withCredentials: true });

      const { message } = res.data;
      // Clear any local storage or session data
      localStorage.removeItem('username');

      // Show success message
      toast({
        className: "shadcn-toast-success",
        description: message
      });
    } catch (error) {
      console.error('Error occurred during logout:', error);
      toast({
        className: "shadcn-toast-failure",
        description: 'An error occurred during logout. Please try again.'
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="cursor-pointer mt-40 mb-4 container mx-auto max-w-lg  p-0">

        <CreateInteractionForm
          action="Add"
        />

        <div className="p-6">
        {username ? (
          <div>
            <p>{username} is logged in currently</p>
            <button onClick={() => handleLogout()}>
              Logout
            </button>
          </div>

        ) : (
          <div>
            <p>No one is logged in currently</p>
            <Link href={'/sign-in'}>
              <button>
                Sign In
              </button>
            </Link>
          </div>
        )}

        </div>
       


        <ul className="flex flex-col ">
          {tweets.map((tweet) => (
            <li key={tweet._id} className="border border-gray-300 rounded-xl flex p-4">
              <div className="flex flex-col flex-grow">
                <div className="flex items-center mb-2">
                  <Link href={`/profile/${tweet.author.username}/`}>
                    <Image
                      src='' // Replace with actual avatar source
                      alt="profilepic"
                      width={100}
                      height={100}
                      className="w-8 h-8 rounded-full mr-2"
                      priority
                    />
                  </Link>
                  <p className="text-black">
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





















