import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import {
    faCircleCheck,
    faTrashCanArrowUp
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

import useCommentStore from "@/store/commentStore";
function CommentCard({ id, tweetId, username, text, createdAt, verification }: CommentCardProps) {
    const { setTweet } = useCommentStore();
    const { toast } = useToast();


    const loggedInUsername = localStorage.getItem('username');

    const handleDelete = async (commentId: string, tweetId: string) => {
        try {
            const res = await axiosInstance.delete(`/tweets/${tweetId}/comments/${commentId}`);
            const newTweet = await axiosInstance.get(`/tweets/${tweetId}`);
            setTweet(newTweet.data.foundTweet)

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
    }

    return (
        <span>
            <li className="border-gray-900 rounded-xl flex p-4 border-[0.5px]">
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
                        <div className="flex items-center justify-between w-full mb-2">
                            <Link href={`/${username}`} className="flex-grow">
                                <p className="text-white">
                                    <span className="hover:underline">{username} </span>
                                    {verification && (
                                        <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 15, color: "#1DA1F2" }} />
                                    )}
                                    <span className="text-gray-500"> @{username}.</span>
                                    <span className="text-gray-500 text-sm">{new Date(createdAt).toLocaleDateString()}</span>
                                </p>
                            </Link>
                            {loggedInUsername === username && (
                                <span className="ml-4 cursor-pointer text-gray-500 hover:text-red-600 ">
                                    <FontAwesomeIcon onClick={() => handleDelete(id, tweetId)} icon={faTrashCanArrowUp} style={{ fontSize: 12 }} />
                                </span>
                            )}
                        </div>
                    </div>
                    <h4 className="text-md font-normal mb-2">{text}</h4>
                </div>

            </li>
        </span>
    )
}

export default CommentCard