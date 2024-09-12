"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { isBase64Image } from "@/lib/utils"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { Input } from "../ui/input"
import { useUploadThing } from "@/lib/uploadthing"
import axios from 'axios'
import axiosInstance from "@/lib/axiosInstance"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    text: z.string().optional(),
    image: z.string().optional(),
}).refine((data) => data.text || data.image, {
    message: "Either text or image must be provided",
    path: ["text", "image"], // Error can be shown for both fields
});


// Main component
function CreateInteractionForm({ action }: { action: string }) {
    // Hook to call the upload process
    const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);

    // Initialize form with validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { text: '', image: '' } // Ensure default values match schema
    });

    // Handle image file selection and conversion to data URL
    function handleImage(
        e: React.ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ): void {
        e.preventDefault();
        const file = e.target.files?.[0];

        if (file && file.type.startsWith("image/")) { // Ensure file is an image
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const imageDataUrl = fileReader.result?.toString() || "";
                fieldChange(imageDataUrl);
            };
            fileReader.readAsDataURL(file);
            setFiles([file]); // Update state with the selected file
        }
    }

    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {

        if (values.image) {
            // Check if image is base64 encoded and needs to be uploaded
            const hasImageChanged = values.image && isBase64Image(values.image);

            if (hasImageChanged) {
                // Upload image to server
                try {
                    const imgRes = await startUpload(files);
                    if (imgRes?.[0]?.url) {
                        values.image = imgRes[0].url;
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                    //do a toast here, saying choose an image less than 1mb
                }
            }
        }

        // Handle form submission logic (e.g., API call)
        if (action === 'Add') {
            try {
                // API call to create interaction
                form.reset();
                setFiles([]); // Clear the files state to remove the image
                const imageInput = document.getElementById('image-input') as HTMLInputElement;
                if (imageInput) {
                    imageInput.value = ''; // Clear the file input field manually
                }
                const res = await axiosInstance.post('/tweets', {
                    text: values?.text,
                    image: values?.image
                })

                const { message, newTweet } = res.data;
                toast({
                    className: "shadcn-toast-success",
                    description: message
                });
                console.log(newTweet)

            } catch (error: any) {
                console.error('Error occurred while making a tweet:', error);

                // Default error message
                let errorMessage = 'An error occurred. Please try again.';

                // Check if the error is an Axios error
                if (axios.isAxiosError(error)) {
                    // Check for a response error
                    if (error.response) {
                        // Extract message from response if available
                        errorMessage = error.response.data?.message || errorMessage;
                    } else {
                        // Handle cases where no response is available (e.g., network errors)
                        errorMessage = 'Network error. Please try again.';
                    }
                } else {
                    // Handle unexpected error types
                    errorMessage = 'An unexpected error occurred. Please try again later.';
                }

                toast({
                    className: "shadcn-toast-failure",
                    description: 'You have to be logged in to make a post'
                });
            }
        }
    }


    return (
        <div>
            CreateInteractionForm
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                            <Textarea rows={4} {...field} className="max-w-sm px-3 py-2 border rounded-md focus:outline-none" />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <Input
                                id="image-input"
                                accept="image/*"
                                onChange={(e) => { handleImage(e, field.onChange) }}
                                type='file'
                                className="w-96 px-3 py-2 border rounded-md focus:outline-none cursor-pointer"
                            />
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateInteractionForm