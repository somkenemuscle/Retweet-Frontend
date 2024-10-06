'use client';

import { useParams } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState } from 'react';
import TweetCard from '@/components/ui/tweetCard';
import Loader from '@/components/ui/Loader';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import {
    faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';

function TweetId() {
    const { toast } = useToast();
    const [UsersTweets, setUsersTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const params = useParams();
    const username = params.username;


    async function getTweet() {
        try {
            setLoading(true); // Start loading when fetching tweets
            const res = await axiosInstance.get(`/tweets/user/${username}`);
            setUsersTweets(res.data);
        } catch (error: any) {
            console.error('Error occurred during fetching tweets:', error);

            let errorMessage = 'An error occurred. Please try again.';
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const responseMessage = error.response.data?.error;
                    errorMessage = responseMessage ? responseMessage : error.response.data?.message || errorMessage;
                } else {
                    errorMessage = 'Network error. Please try again.';
                }
            } else {
                errorMessage = 'An unexpected error occurred. Please try again later.';
            }

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
            getTweet();
        }
    }, []);


    return (
        <div className="cursor-pointer mt-9 mb-24 container mx-auto max-w-lg p-0">
            <div className='border border-slate-900 p-3 mb-4 rounded-none sm:rounded-xl'>
                <Link href={'/'}>
                    <span className='hover:bg-gray-700 text-gray-500 transition rounded-full p-2' aria-hidden="true">←</span>
                    <span className='ml-8 text-gray-500'> Go back to posts</span>
                </Link>
            </div>
            <div className='p-3 mb-4 flex items-center'>

                {/* Profile Picture */}
                <div className="mr-4">
                    <Image
                        src={'/assets/images/prof.png'}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                        width={500}
                        height={500}
                    />
                </div>

                {/* Username and Name */}
                <div>
                    <h2 className='text-xl font-semibold text-white'>
                        {username ? username : 'Account Not Found'}  <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 15, color: "#1DA1F2" }} />
                    </h2>
                    <p className='text-gray-400 font-light'>
                        @{username ? username : 'Name not available'}
                    </p>
                </div>
            </div>


            {/* Tweets Section */}
            <ul className="flex flex-col mb-20">
                {loading ? (
                    <div className="flex justify-center items-center mt-10">
                        <Loader />
                    </div>
                ) : UsersTweets.length === 0 ? (
                    <div className="flex justify-center items-center mt-10">
                        <span>
                            <p className='text-gray-400 mt-24'>No post has been made yet</p>
                        </span>
                    </div>
                ) : (
                    UsersTweets.map((tweet) => (
                        <TweetCard
                            key={tweet._id}
                            id={tweet._id}
                            username={tweet.author.username}
                            image={tweet.image}
                            text={tweet.text}
                            createdAt={tweet.createdAt}
                            likes={tweet.likes}
                            verification={tweet.author.verification}

                        />
                    ))
                )}
            </ul>
        </div>
    );
}

export default TweetId;

