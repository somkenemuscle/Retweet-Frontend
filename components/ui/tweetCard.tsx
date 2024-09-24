import Image from "next/image"
import Link from "next/link"

function TweetCard({ id, username, text, image, createdAt }: TweetCardProps) {
    return (
        <>
            <li key={id} className="border-gray-900 rounded-xl flex p-4 border-[0.5px]">
                <div className="flex flex-col flex-grow">
                    <div className="flex items-center mb-2">
                        <Image
                            src='/assets/images/prof.png'
                            alt="profilepic"
                            width={100}
                            height={100}
                            className="w-8 h-8 rounded-full mr-2"
                            priority
                        />
                        <p className="text-white">
                            {username} <span className="text-gray-500">@{username}.</span>  <span className="text-gray-500 text-sm">{new Date(createdAt).toLocaleDateString()}</span>
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
                            layout="responsive"
                            priority
                        />
                    ) : null}
                    <Link className="text-blue-500 hover:underline text-sm mt-2" href={`/tweets/${id}`}>
                        View More
                    </Link>
                </div>
            </li>
        </>
    )
}

export default TweetCard