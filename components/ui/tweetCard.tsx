'use client'
import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faComment,
    faCircleCheck,
    faHeart,
    faRetweet
} from "@fortawesome/free-solid-svg-icons";

function TweetCard({ id, username, text, image, createdAt }: TweetCardProps) {

    const handleLinkClick = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('scrollPosition', window.scrollY.toString());
        }
    };




    return (
        <>
            <li className="border-gray-900 rounded-xl flex p-4 border-[0.5px] cursor-pointer">
                <div className="flex flex-col flex-grow">
                    <Link href={`/${id}`} onClick={handleLinkClick}>
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
                            <p className="text-white">
                                <span className="hover:underline">{username} </span>  <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 15, color: "#1DA1F2" }} /> <span className="text-gray-500">@{username}.</span>  <span className="text-gray-500 text-sm">{new Date(createdAt).toLocaleDateString()}</span>
                            </p>
                        </div>

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
                        <div className="flex items-center mr-5  text-red-500 cursor-pointer hover:text-red-500">
                            <FontAwesomeIcon icon={faHeart} style={{ fontSize: 20 }} />
                        </div>
                        <div className="flex items-center mr-5 cursor-pointer text-gray-300 hover:text-blue-500">
                            <FontAwesomeIcon icon={faComment} style={{ fontSize: 20}} />
                        </div>
                        <div className="flex items-center mr-5  cursor-pointer text-green-500 hover:text-green-800">
                            <FontAwesomeIcon icon={faRetweet} style={{ fontSize: 20}} />
                        </div>

                    </div>
                </div>
            </li>
        </>
    )
}

export default TweetCard