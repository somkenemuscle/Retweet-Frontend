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
    const params = useParams();
    const username = params.username;

    async function getTweet() {
        try {
            const res = await axiosInstance.get(`/tweets/user/${username}`);
            setUsersTweets(res.data);
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
    }


    useEffect(() => {
        if (username) {
            getTweet();
        }
    }, []);


    if (!UsersTweets) {
        return (
            <div className="flex justify-center items-center mt-44">
                <span>
                    <Loader />
                </span>
            </div>
        );
    }


    return (
        <div className="cursor-pointer mt-9 mb-24 container mx-auto max-w-lg p-0">
            <div className='border border-slate-900 p-3 mb-4 rounded-xl'>
                <Link href={'/'}>
                    <span className='hover:bg-gray-700 transition rounded-full p-2' aria-hidden="true">←</span>
                    <span className='ml-8 text-gray-300'> Go back to posts</span>
                </Link>
            </div>
            <div className='border border-slate-900 p-3 mb-4 rounded-xl flex items-center'>

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


            <ul className="flex flex-col mb-20">
                {UsersTweets.length === 0 ? (
                    <div className="flex justify-center items-center mt-10">
                        <span>
                            <Loader />
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
                        />
                    ))
                )}
            </ul>


        </div>
    );
}

export default TweetId;

