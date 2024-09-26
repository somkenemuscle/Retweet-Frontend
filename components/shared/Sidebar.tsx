import React from 'react'
import { HomeIcon, PlusIcon, PersonIcon, ExitIcon, EnterIcon } from '@radix-ui/react-icons';
import { Bookmark } from 'react-feather';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function Sidebar() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            setUsername(username);
        }
    }, []);

    const handleLogout = async () => {
        try {
            router.push('/sign-in');
            const res = await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
            const { message } = res.data;
            localStorage.removeItem('username');
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
            <div className="fixed top-0 left-0 h-screen w-64 bg-black border-r-[0.5px] border-gray-800 z-50 hidden lg:block">
                <div className="px-4 py-6">
                    <span
                        className={`
                            grid text-3xl font-extrabold h-7 m-4 w-32 place-content-center 
                            rounded-lg text-transparent bg-clip-text
                            bg-gradient-to-r from-blue-400 via-purple-400 to-slate-100
                            font-poppins`}>Retweet </span>


                    <ul className="mt-11 space-y-1">
                        <li>
                            <Link href="/" className="block rounded-2xl px-5 py-2 text-lg font-semibold text-white hover:bg-gray-800">
                                <HomeIcon className="h-5 w-6 inline-flex pr-1 text-white" />  Home
                            </Link>
                        </li>
                    </ul>

                    <ul className="mt-7 space-y-1">
                        <li>
                            <Link href="/" className="block rounded-2xl px-5 py-2 text-lg font-semibold text-white hover:bg-gray-800">
                                <PlusIcon className="h-5 w-6 inline-flex pr-1 text-white" />  Create
                            </Link>
                        </li>
                    </ul>

                    <ul className="mt-7 space-y-1">
                        <li>
                            <Link href={`/${username}`} className="block rounded-2xl px-5 py-2 text-lg font-semibold text-white hover:bg-gray-800">
                                <PersonIcon className="h-6 w-6 inline-flex pr-1 text-white" />  Profile
                            </Link>
                        </li>
                    </ul>

                    <ul className="mt-7 space-y-1">
                        <li>
                            <Link
                                href={username ? `/${username}/saved-posts` : '/'}
                                className="block rounded-2xl px-5 py-2 text-lg font-semibold text-white hover:bg-gray-800"
                            >
                                <Bookmark className="h-6 w-6 inline-flex pr-1 text-white" /> Saves
                            </Link>

                        </li>
                    </ul>

                    <ul className="mt-7 space-y-1">
                        <li>
                            {username ? (
                                <span onClick={() => handleLogout()} className="block rounded-2xl px-5 py-2 text-lg  font-semibold text-white hover:bg-gray-800 cursor-pointer">
                                    <ExitIcon className="h-5 w-6 inline-flex pr-1 text-white" />  Logout
                                </span>
                            ) : (
                                <Link href="/sign-in" className="block rounded-2xl px-5 py-2 text-lg font-semibold text-white hover:bg-gray-800 cursor-pointer">
                                    <EnterIcon className="h-5 w-6 inline-flex pr-1 text-white" />  Sign In
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Navbar */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 border-t border-gray-900 bg-black flex justify-around items-center p-2">
                <Link href="/" className="block rounded-lg px-4 py-2">
                    <HomeIcon className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                </Link>

                <Link href={username ? `/${username}/saved-posts` : '/'} className="block rounded-lg px-4 py-2">
                    <Bookmark className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                </Link>

                <Link href="/" className="block rounded-lg px-4 py-2">
                    <PlusIcon className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                </Link>

                <Link href={`/${username}`} className="block rounded-lg px-4 py-2">
                    <PersonIcon className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                </Link>

                <span className="block px-4 py-2">
                    {username && (
                        <ExitIcon onClick={() => handleLogout()} className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                    )}
                </span>
            </div>
        </div >
    );
}
