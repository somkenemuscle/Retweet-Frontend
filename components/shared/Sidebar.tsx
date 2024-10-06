import React, { useState, useEffect, useRef } from 'react';
import { HomeIcon, PlusIcon, PersonIcon, ExitIcon, EnterIcon } from '@radix-ui/react-icons';
import { Bookmark } from 'react-feather';
import axiosInstance from '@/lib/axiosInstance';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import CreateInteractionForm from '../forms/createTweetForm';
import { useDialogStore } from '@/store/dialogStore';


export default function Sidebar() {
    const [username, setUsername] = useState('');
    const { toast } = useToast();
    const { isDialogOpen, setIsDialogOpen } = useDialogStore();
    const dialogRef = useRef<HTMLDivElement | null>(null);

    const toggleDialog = () => {
        setIsDialogOpen(!isDialogOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
            setIsDialogOpen(false);
        }
    };

    function GetUsername() {
        const username = localStorage.getItem('username');
        if (username) {
            setUsername(username);
        }
    }

    function CheckForDialog() {
        if (isDialogOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }
    useEffect(() => {
        GetUsername();
        CheckForDialog();
    }, [isDialogOpen]);



    const handleLogout = async () => {
        try {
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
                    <Link href="/">

                        <span
                            className={`
                            grid text-3xl font-extrabold h-7 m-4 w-32 place-content-center 
                            rounded-lg text-transparent bg-clip-text
                            bg-gradient-to-r from-blue-400 via-purple-400 to-slate-100
                            font-poppins`}>Retweet </span>
                    </Link>

                    <ul className="mt-11 space-y-1">
                        <li>
                            <Link href="/" className="block rounded-2xl px-5 py-2 text-lg font-semibold text-white hover:bg-gray-800">
                                <HomeIcon className="h-5 w-6 inline-flex pr-1 text-white" />  Home
                            </Link>
                        </li>
                    </ul>

                    <ul className="mt-7 space-y-1">
                        <li>
                            {/* Clicking this will trigger the dialog */}
                            <span onClick={toggleDialog} className="block rounded-2xl px-5 py-2 text-lg font-semibold text-white hover:bg-gray-800 cursor-pointer">
                                <PlusIcon className="h-5 w-6 inline-flex pr-1 text-white" />  Create
                            </span>
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
                                <Link href={'/sign-in'}>
                                    <span onClick={handleLogout} className="block rounded-2xl px-5 py-2 text-lg font-semibold text-white hover:bg-gray-800 cursor-pointer">
                                        <ExitIcon className="h-5 w-6 inline-flex pr-1 text-white" />  Logout
                                    </span>
                                </Link>

                            ) : (
                                <Link href="/sign-in" className="block rounded-2xl px-5 py-2 text-lg font-semibold text-white hover:bg-gray-800 cursor-pointer">
                                    <EnterIcon className="h-5 w-6 inline-flex pr-1 text-white" />  Sign In
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>

            {/* Dialog Box */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={dialogRef} // Reference to the dialog content
                        className="relative bg-black rounded-xl p-4 w-[550px] max-w-[90vw]"
                    >
                        <button
                            onClick={toggleDialog}
                            className="absolute top-2 right-4 text-gray-600 hover:text-red-900"
                        >
                            x
                        </button>
                        <h2 className="text-lg font-bold mb-4 text-gray-200">Make a post</h2>
                        {/* Render your form here */}
                        <CreateInteractionForm action="Add" />
                    </div>
                </div>)}

            {/* Bottom Navbar */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 border-t border-gray-900 bg-black flex justify-around items-center p-2">
                <Link href="/" className="block rounded-lg px-4 py-2">
                    <HomeIcon className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                </Link>

                <Link href={username ? `/${username}/saved-posts` : '/'} className="block rounded-lg px-4 py-2">
                    <Bookmark className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                </Link>

                <span onClick={toggleDialog} className="block rounded-lg px-4 py-2 cursor-pointer">
                    <PlusIcon className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                </span>

                <Link href={`/${username}`} className="block rounded-lg px-4 py-2">
                    <PersonIcon className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                </Link>

                {username ? (
                    <span className="block px-4 py-2">
                        <Link href={'/sign-in'}>
                            <ExitIcon onClick={handleLogout} className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                        </Link>
                    </span>
                ) : (
                    <span className="block px-4 py-2">
                        <Link href="/sign-in">
                            <EnterIcon className="h-6 w-6 inline-flex pr-1 text-gray-500" />
                        </Link>
                    </span>
                )}
            </div>
        </div>
    );
}
