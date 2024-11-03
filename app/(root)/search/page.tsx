'use client'
import { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
// import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function SearchPage() {
    // const { toast } = useToast();
    const [SearchValue, setSearchValue] = useState<string>("");
    const [usernames, setUsernames] = useState<[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state


    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(e.target.value)
        try {
            const res = await axiosInstance.get(`/auth/search/${e.target.value}`);
            setUsernames(res.data.usernames)

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
            // toast({
            //     className: "shadcn-toast-failure",
            //     description: errorMessage
            // });
            setUsernames([])
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="font-sans cursor-pointer mt-9 mb-4 container mx-auto max-w-lg  p-4">
            <form>
                <input id="search-input" onChange={handleChange} value={SearchValue}
                    className="border border-slate-900 p-4 pl-6 text-slate-300  rounded-xl w-full"
                    type="text" placeholder="Search Username" />
            </form>
            <div>

                <ul className="bg-black rounded-xl border border-slate-900 mt-1 p-2 ">
                    {loading ? (
                        <span className="flex justify-center items-center h-10 text-sm text-slate-500 font-light ">Try searching for people by their username.</span>
                    ) : usernames.length === 0 ? (
                        <div className="flex justify-center items-center mt-4">
                            <span>
                                <p className='text-gray-400 text-sm mb-4 font-light'>@User not found!</p>
                            </span>
                        </div>
                    ) : (
                        usernames.map((username, index) => (
                            <Link key={index} href={`/${username}`}>
                                <li className="text-slate-200 font-light p-3 rounded-xl hover:cursor-pointer hover:bg-gray-900">
                                    <Image
                                        src='/assets/images/prof.png'
                                        alt="profilepic"
                                        width={100}
                                        height={100}
                                        className="w-8 h-8 rounded-full mr-4 inline-block"
                                        quality={100}
                                        priority
                                    />
                                  {username} <span className="text-gray-500"> @{username}</span>
                                </li>
                            </Link>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}

export default SearchPage;