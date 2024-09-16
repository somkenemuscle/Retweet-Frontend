'use client'
import React from 'react'
import { HomeIcon, PlusIcon } from '@radix-ui/react-icons';


export default function Navbar() {
    return (
        <div className='lg:flex'>


            <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-300 z-50 hidden lg:block">

                <div className="px-4 py-6 ">
                    <span className={`grid text-6xl h-7 m-4 w-32 place-content-center rounded-lg text-black`}>
                        Brobl
                    </span>

                    <ul className="mt-11 space-y-1">
                        <li>
                            <a
                                href="/"
                                className="block rounded-lg px-5 py-2 text-lg font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <HomeIcon className="h-7 w-7 inline-flex pr-1 text-gray-500" />  Home
                            </a>
                        </li>

                    </ul>

                    <ul className="mt-11 space-y-1">
                        <li>
                            <a
                                href="/"
                                className="block rounded-lg px-5 py-2 text-lg font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <PlusIcon className="h-7 w-7 inline-flex pr-1 text-gray-500" />  Create
                            </a>
                        </li>

                    </ul>


                    <div className="mt-80 border-t border-gray-300">
                        <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                            <img
                                alt="Profile"
                                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            <div>
                                <p className="text-xs">
                                    <strong className="block font-medium">Eric Frusciante</strong>
                                    <span>eric@frusciante.com</span>
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* bottom navbar */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 border-t border-gray-300 bg-white flex justify-around items-center p-2">
                <a
                    href="/"
                    className="block rounded-lg px-4 py-2  hover:bg-gray-100"
                >
                    <HomeIcon className="h-7 w-7 inline-flex pr-1 text-gray-500" />
                </a>

                <a href="#" className="block px-4 py-2">
                    <img
                        alt="Profile"
                        src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </a>
            </div>

        </div>


    )
}
