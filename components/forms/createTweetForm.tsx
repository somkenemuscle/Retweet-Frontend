"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { isBase64Image } from "@/lib/utils";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "../ui/input";
import { useUploadThing } from "@/lib/uploadthing";
import axiosInstance from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { tweetFormSchema } from "@/lib/tweetSchema";
import { AiOutlineFileImage } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import Loader from "../ui/Loader";
import useTweetStore from "@/store/tweetStore";
import EmojiPicker from 'emoji-picker-react'; // Import the emoji picker
import { FaSmile } from "react-icons/fa"; // Import the smile icon

function CreateInteractionForm({ action }: { action: string }) {
    const { setTweets } = useTweetStore();
    const { startUpload } = useUploadThing("media");
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Emoji picker state


    const form = useForm<z.infer<typeof tweetFormSchema>>({
        resolver: zodResolver(tweetFormSchema),
        defaultValues: { text: "", image: "" },
    });

    // Ref to manage clicks outside of the emoji picker
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // Add emoji to the textarea
    const handleEmojiClick = (emojiObject: any) => {
        form.setValue('text', form.getValues('text') + emojiObject.emoji);
    };

    // Handle clicks outside of the emoji picker
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    function handleImage(e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void): void {
        e.preventDefault();
        const file = e.target.files?.[0];

        if (file && file.type.startsWith("image/")) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const imageDataUrl = fileReader.result?.toString() || "";
                fieldChange(imageDataUrl);
                setImagePreview(imageDataUrl);
                setFiles([file]);
            };
            fileReader.readAsDataURL(file);
        }
    }

    function handleRemoveImage(): void {
        setImagePreview(null);
        setFiles([]);
        const imageInput = document.getElementById("image-input") as HTMLInputElement;
        if (imageInput) {
            imageInput.value = "";
        }
    }

    async function getAllTweets() {
        try {
            const res = await axiosInstance.get('/tweets');
            setTweets(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function onSubmit(values: z.infer<typeof tweetFormSchema>) {
        setLoading(true);

        const username = localStorage.getItem("username");

        if (values.image) {
            const hasImageChanged = values.image && isBase64Image(values.image);
            if (hasImageChanged && username) {
                try {
                    const imgRes = await startUpload(files);
                    if (imgRes?.[0]?.url) {
                        values.image = imgRes[0].url;
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            }
        }

        if (action === "Add") {
            try {
                form.reset();
                setFiles([]);
                setImagePreview(null);
                const imageInput = document.getElementById("image-input") as HTMLInputElement;
                if (imageInput) {
                    imageInput.value = "";
                }

                if (username) {
                    const res = await axiosInstance.post("/tweets", {
                        text: values?.text,
                        image: values?.image,
                    });
                    getAllTweets();
                    const { message } = res.data;
                    toast({
                        className: "shadcn-toast-success",
                        description: message,
                    });
                } else {
                    toast({
                        className: "shadcn-toast-failure",
                        description: "You have to be logged in to make a post",
                    });
                }
            } catch (error: any) {
                console.error("Error occurred while making a tweet:", error);
            } finally {
                setLoading(false);
            }
        }
    }



    return (
        <div className="p-6 shadow-md max-w-full mx-auto my-8 rounded-xl border border-gray-900">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="flex">
                        <div className="mr-4">
                            <img
                                src="/assets/images/prof.png"
                                alt="profile-pic"
                                className="w-10 h-9 rounded-full"
                            />
                        </div>

                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="text"
                                render={({ field }) => (
                                    <Textarea
                                        rows={3}
                                        {...field}
                                        placeholder="What's happening?"
                                        className="w-full px-4 py-3 border-none bg-gray-900 text-white rounded-xl focus:outline-none"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <label className="cursor-pointer flex items-center space-x-2">
                                        <AiOutlineFileImage className="w-5 h-5 text-blue-500" />
                                        <Input
                                            id="image-input"
                                            accept="image/*"
                                            onChange={(e) => handleImage(e, field.onChange)}
                                            type="file"
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            />

                            {imagePreview && (
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md"
                                    >
                                        <MdCancel className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            )}

                            {/* Emoji Picker Button */}
                            <div className="relative" ref={emojiPickerRef}>
                                <button
                                    type="button"
                                    className="text-yellow-400"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <FaSmile className="w-5 h-5" />
                                </button>
                                {showEmojiPicker && (
                                    <div className="absolute z-10">
                                        <EmojiPicker
                                            onEmojiClick={handleEmojiClick}
                                            theme='dark'
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="ml-auto px-4 bg-blue-500 rounded-xl hover:bg-blue-700 py-2">
                            Post {loading && <span className="ml-3"> <Loader /> </span>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CreateInteractionForm;
