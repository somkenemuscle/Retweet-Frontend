import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import {
    faComment,
    faCircleCheck,
    faHeart,
    faSave
} from "@fortawesome/free-solid-svg-icons";
function CommentCard({ username, text, createdAt }: CommentCardProps) {

    return (
        <>
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
                        <Link href={`/${username}`}>
                            <p className="text-white">
                                <span className="hover:underline">{username} </span> <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 15, color: "#1DA1F2" }} />  <span className="text-gray-500">@{username}.</span>  <span className="text-gray-500 text-sm">{new Date(createdAt).toLocaleDateString()}</span>
                            </p>
                        </Link>
                    </div>

                    <h4 className="text-md font-normal mb-2">{text}</h4>
                    <div>
                        <FontAwesomeIcon icon={faHeart} style={{ fontSize: 17, color: '#ef4444' }} /> <span className="ml-1 text-sm text-gray-100 font-medium">10k Likes</span>
                    </div>
                </div>

            </li>
        </>
    )
}

export default CommentCard