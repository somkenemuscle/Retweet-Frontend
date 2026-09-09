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
import { ImageIcon, Smile, X } from "lucide-react";
import Spinner from "../ui/Spinner";
import Avatar from "../ui/Avatar";
import useTweetStore from "@/store/tweetStore";
import EmojiPicker from 'emoji-picker-react'; // Import the emoji picker
import { useDialogStore } from '@/store/dialogStore';


function CreateInteractionForm({ action }: { action: string }) {
    const { setTweets } = useTweetStore();
    const { startUpload } = useUploadThing("media");
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Emoji picker state
    const [username, setUsername] = useState<string | null>(null);
    const { setIsDialogOpen } = useDialogStore();

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);


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
                    setIsDialogOpen(false);
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



    const textValue = form.watch("text");
    const canPost = !loading && !!(textValue?.trim() || imagePreview);

    return (
        <div className="border-b border-border px-4 py-3">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
                    <Avatar username={username ?? ""} size={40} className="mt-1" />

                    <div className="min-w-0 flex-1">
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <Textarea
                                    rows={2}
                                    {...field}
                                    placeholder="What's happening?"
                                    className="min-h-[52px] resize-none border-none bg-transparent px-0 py-2 text-lg shadow-none focus-visible:shadow-none"
                                />
                            )}
                        />

                        {imagePreview && (
                            <div className="relative mt-2 w-fit overflow-hidden rounded-2xl border border-border">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-72 w-auto object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    aria-label="Remove image"
                                    className="absolute right-2 top-2 rounded-full bg-foreground/70 p-1.5 text-background transition-colors hover:bg-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <div className="mt-2 flex items-center justify-between border-t border-border pt-2.5">
                            <div className="flex items-center gap-1 text-primary">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <label
                                            className="cursor-pointer rounded-full p-2 transition-colors hover:bg-primary/10"
                                            aria-label="Add image"
                                        >
                                            <ImageIcon className="h-[19px] w-[19px]" />
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

                                <div className="relative" ref={emojiPickerRef}>
                                    <button
                                        type="button"
                                        aria-label="Add emoji"
                                        className="rounded-full p-2 transition-colors hover:bg-primary/10"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    >
                                        <Smile className="h-[19px] w-[19px]" />
                                    </button>
                                    {showEmojiPicker && (
                                        <div className="absolute left-0 top-full z-20 mt-1">
                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={!canPost}
                                className="rounded-full px-5 font-semibold"
                            >
                                {loading ? <Spinner size={16} /> : "Post"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CreateInteractionForm;
