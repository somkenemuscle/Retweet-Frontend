"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isBase64Image } from "@/lib/utils";
import {
    Form,
    FormField,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useUploadThing } from "@/lib/uploadthing";
import axiosInstance from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { tweetFormSchema } from "@/lib/tweetSchema";
import { AiOutlineFileImage } from "react-icons/ai";


// Main component
function CreateInteractionForm({ action }: { action: string }) {
    const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);

    const form = useForm<z.infer<typeof tweetFormSchema>>({
        resolver: zodResolver(tweetFormSchema),
        defaultValues: { text: "", image: "" },
    });

    function handleImage(
        e: React.ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ): void {
        e.preventDefault();
        const file = e.target.files?.[0];

        if (file && file.type.startsWith("image/")) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const imageDataUrl = fileReader.result?.toString() || "";
                fieldChange(imageDataUrl);
            };
            fileReader.readAsDataURL(file);
            setFiles([file]);
        }
    }

    async function onSubmit(values: z.infer<typeof tweetFormSchema>) {
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
                const imageInput = document.getElementById(
                    "image-input"
                ) as HTMLInputElement;
                if (imageInput) {
                    imageInput.value = "";
                }

                if (username) {
                    const res = await axiosInstance.post("/tweets", {
                        text: values?.text,
                        image: values?.image,
                    });
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
            }
        }
    }

    return (
        <div className="p-6  shadow-md max-w-lg mx-auto">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                            <Textarea
                                rows={3}
                                {...field}
                                placeholder="What's happening?"
                                className="w-full px-4 py-3 border rounded-xl border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                            />
                        )}
                    />

                    <div className="flex justify-between items-center">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <label className="cursor-pointer">
                                    <AiOutlineFileImage className="w-6 h-6 text-blue-500" />
                                    <input
                                        id="image-input"
                                        accept="image/*"
                                        onChange={(e) => handleImage(e, field.onChange)}
                                        type="file"
                                        className="hidden"
                                    />
                                </label>
                            )}
                        />

                        <Button type="submit" className="px-4 bg-blue-500 rounded-xl hover:bg-blue-700 py-2">
                            Post
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CreateInteractionForm;
