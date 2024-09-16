import Link from 'next/link';
import { FaHome, FaBell, FaEnvelope, FaUser } from 'react-icons/fa'; // Import icons for the sidebar

export default function Sidebar() {
    return (
        <div className="lg:flex flex-col justify-between h-screen p-4  bg-gray-800 text-white fixed lg:w-60 lg:left-0 lg:top-0 lg:h-full lg:p-6 bottom-0 w-full">
            {/* Sidebar links */}
            <div className="flex lg:flex-col justify-around lg:justify-start items-center lg:space-y-6">
                <Link href="/">
                    <div className="hover:text-blue-400 flex flex-col items-left cursor-pointer">
                        
                        <span className="text-xs lg:text-base hidden lg:block"><FaHome size={24} /> Home</span>
                    </div>
                </Link>
                <Link href="/notifications">
                    <div className="hover:text-blue-400 flex flex-col items-center cursor-pointer">
                        <FaBell size={24} />
                        <span className="text-xs lg:text-base hidden lg:block">Notifications</span>
                    </div>
                </Link>
                <Link href="/messages">
                    <div className="hover:text-blue-400 flex flex-col items-center cursor-pointer">
                        <FaEnvelope size={24} />
                        <span className="text-xs lg:text-base hidden lg:block">Messages</span>
                    </div>
                </Link>
                <Link href="/profile">
                    <div className="hover:text-blue-400 flex flex-col items-center cursor-pointer">
                        <FaUser size={24} />
                        <span className="text-xs lg:text-base hidden lg:block">Profile</span>
                    </div>
                </Link>
            </div>

            {/* Additional content for large screens */}
            <div className="hidden lg:block">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
                    Tweet
                </button>
            </div>
        </div>
    );
}
