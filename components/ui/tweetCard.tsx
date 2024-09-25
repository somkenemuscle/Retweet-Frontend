'use client'
import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
    faComment,
    faCircleCheck,
    faHeart,
    faBookmark
} from "@fortawesome/free-solid-svg-icons";

function TweetCard({ id, username, text, image, createdAt }: TweetCardProps) {
    const { toast } = useToast();


    const handleLinkClick = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('scrollPosition', window.scrollY.toString());
        }
    };

    const handleSavedPost = async (tweetId: string) => {
        try {
            const res = await axiosInstance.post(`/tweets/${tweetId}/save`);
            // Show error toast notification
            toast({
                className: "shadcn-toast-success",
                description: res.data.message
            });

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
        <>
            <li className="border-gray-900 rounded-xl flex p-4 border-[0.5px] cursor-pointer">
                <div className="flex flex-col flex-grow">

                    <div className="flex items-center mb-2">
                        <Image
                            src='/assets/images/prof.png'
                            alt="profilepic"
                            width={100}
                            height={100}
                            className="w-8 h-8 rounded-full mr-2"
                            quality={100}
                            priority
                        />
                        <Link href={`/${username}`} onClick={handleLinkClick}>
                            <p className="text-white">
                                <span className="hover:underline">{username} </span>  <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 15, color: "#1DA1F2" }} /> <span className="text-gray-500">@{username}.</span>  <span className="text-gray-500 text-sm">{new Date(createdAt).toLocaleDateString()}</span>
                            </p>
                        </Link>
                    </div>
                    <Link href={`/tweet/${id}`} onClick={handleLinkClick}>
                        <h4 className="text-md font-normal mb-2">{text}</h4>
                        {image ? (
                            <Image
                                alt="tweet-image"
                                src={image}
                                width={200}
                                height={200}
                                className="w-full rounded-xl mt-4 mb-2"
                                quality={100}
                                layout="responsive"
                                priority
                            />
                        ) : null}
                    </Link>
                    {/* Engagement Section */}
                    <div className="flex  mt-4 text-gray-500">
                        <div className="flex items-center mr-3  text-red-500 cursor-pointer hover:text-red-700">
                            <FontAwesomeIcon icon={faHeart} style={{ fontSize: 16 }} />
                        </div>
                        <div className="flex items-center mr-3 cursor-pointer text-white hover:text-gray-300">
                            <FontAwesomeIcon icon={faComment} style={{ fontSize: 16 }} />
                        </div>
                        <div className="flex items-center mr-3  cursor-pointer text-green-500 hover:text-green-800">
                            <FontAwesomeIcon onClick={() => handleSavedPost(id)} icon={faBookmark} style={{ fontSize: 14 }} />
                        </div>

                    </div>
                    <span className="mt-3 text-sm text-gray-100 font-medium">14,350 Likes</span>
                </div>
            </li >
        </>
    )
}

export default TweetCard