"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField, Form } from "../ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import Loader from "../ui/Loader";
import useCommentStore from "@/store/commentStore";
import axios from "axios";
import EmojiPicker from 'emoji-picker-react';
import { FaSmile } from "react-icons/fa"; // Icon for the emoji picker

const commentFormSchema = z.object({
    text: z.string()
});

function CreateCommentForm({ action, tweetId }: { action: string, tweetId: string }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const { setTweet } = useCommentStore();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Emoji picker state
    const emojiPickerRef = useRef<HTMLDivElement>(null); // Ref for the emoji picker

    const form = useForm<z.infer<typeof commentFormSchema>>({
        resolver: zodResolver(commentFormSchema),
        defaultValues: { text: "" },
    });

    async function getTweet() {
        try {
            const res = await axiosInstance.get(`/tweets/${tweetId}`);
            setTweet(res.data.foundTweet);
        } catch (error: any) {
            console.error('Error occurred during signin:', error);
            let errorMessage = 'An error occurred. Please try again.';

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const responseMessage = error.response.data?.error;
                    if (responseMessage) {
                        errorMessage = responseMessage;
                    } else {
                        errorMessage = error.response.data?.message || errorMessage;
                    }
                } else {
                    errorMessage = 'Network error. Please try again.';
                }
            } else {
                errorMessage = 'An unexpected error occurred. Please try again later.';
            }

            toast({
                className: "shadcn-toast-failure",
                description: errorMessage
            });
        }
    }

    async function onSubmit(values: z.infer<typeof commentFormSchema>) {
        setLoading(true);
        const username = localStorage.getItem("username");

        if (action === "Add") {
            try {
                form.reset();

                if (username) {
                    const res = await axiosInstance.post(`/tweets/${tweetId}/comments`, {
                        comment: values?.text
                    });
                    getTweet();
                    const { message } = res.data;
                    toast({
                        className: "shadcn-toast-success",
                        description: message,
                    });
                } else {
                    toast({
                        className: "shadcn-toast-failure",
                        description: "You have to be logged in to comment",
                    });
                }
            } catch (error: any) {
                console.error("Error occurred while posting a comment:", error);
            } finally {
                setLoading(false);
            }
        }
    }

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

    return (
        <div className="p-6 shadow-md max-w-full mx-auto my-8 rounded-xl border border-gray-900">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="flex">
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="text"
                                render={({ field }) => (
                                    <Textarea
                                        rows={3}
                                        {...field}
                                        placeholder="Post your reply..."
                                        className="w-full px-4 py-3 border-none bg-gray-900 text-white rounded-xl focus:outline-none"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="relative" ref={emojiPickerRef}>
                            <button
                                type="button"
                                className="text-yellow-400"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <FaSmile className="w-6 h-6" />
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute z-10">
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiClick}
                                    />
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="px-4 bg-blue-500 rounded-xl hover:bg-blue-700 py-2"
                        >
                            Reply {loading && <span className="ml-3"> <Loader /> </span>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CreateCommentForm;
