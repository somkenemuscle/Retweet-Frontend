'use client';

import { useParams } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState } from 'react';
import TweetCard from '@/components/ui/tweetCard';
import Loader from '@/components/ui/Loader';
import Link from 'next/link';
import CommentCard from '@/components/ui/commentCard';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import CreateCommentForm from '@/components/forms/createComment';
import useCommentStore from '@/store/commentStore';


function TweetId() {
    const { toast } = useToast();
    const { tweet, setTweet } = useCommentStore();

    const params = useParams();
    const id = params.id;

    async function getTweet() {
        try {
            const res = await axiosInstance.get(`/tweets/${id}`);
            setTweet(res.data.foundTweet);
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
        if (id) {
            getTweet();
        }
    }, []);


    if (!tweet) {
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
                    <span className='ml-8 text-gray-300'> Go back to post</span>
                </Link>
            </div>
            <TweetCard
                key={tweet._id}
                id={tweet._id}
                username={tweet.author?.username}
                image={tweet.image}
                text={tweet.text}
                createdAt={tweet.createdAt}
            />


            <CreateCommentForm tweetId={`${id}`} action='Add' />

            {tweet.comments.map((comment, index) => (
                <CommentCard
                    key={index}
                    username={comment.author.username}
                    text={comment.comment}
                    createdAt={tweet.createdAt}
                />
            ))}

        </div>
    );
}

export default TweetId;

