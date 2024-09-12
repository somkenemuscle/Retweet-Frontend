'use client'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import signInPic from '../../public/assets/images/signin-img.avif'
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Eye, EyeOff } from 'react-feather';
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

const FormSchema = z.object({
    username: z.string()
        .min(4, { message: "Username must be at least 4 characters" })
        .max(20, { message: "Username must be no more than 20 characters" }) // optional: add a max length constraint
        .regex(/^[a-zA-Z0-9.-]+$/, { message: "Username can only contain letters, numbers, ( . ) and ( - )" }), // regex validation,
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters", })
        .max(50, { message: "Password must be no more than 50 characters" })
})


export default function SignInForm() {
    const { toast } = useToast();
    const router = useRouter();
    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })


    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            const res = await axiosInstance.post('/auth/signin',
                {
                    username: values.username,
                    password: values.password
                }
            );

            const { message, username } = res.data;

            // Store username in local storage
            localStorage.setItem('username', username);

            // Reset the form and redirect
            form.reset();
            router.push('/');

            // Show success toast
            toast({
                className: "shadcn-toast-success",
                description: message
            });

        } catch (error: any) {
            console.error('Error occurred during signin:', error);

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
                description: errorMessage
            });
        }
    }



    return (
        <div className="grid grid-cols-1 md:grid-cols-2 md:h-screen">
            {/* Left section (Form) */}
            <div className="px-4 py-48 sm:px-6 sm:my-auto md:px-8 md:py-24">
                <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">Welcome back</h1>
                    <p className="mt-3 text-gray-500">
                        We are glad to have you back here at Retweet!
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto mt-8 max-w-md space-y-4">
                        {/* Username Field */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <>
                                    <Input
                                        type="text"
                                        {...field}
                                        placeholder="Enter username"
                                        className="w-full rounded-xl border-gray-200 p-6 pe-12 text-sm shadow-sm"
                                        id="signin-form-input-username"
                                    />
                                    <FormMessage className="text-red-600" />
                                </>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            {...field}
                                            placeholder="Enter password"
                                            className="w-full rounded-xl border-gray-200 p-6 pe-12 text-sm shadow-sm"
                                            id="signin-form-input-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            {showPassword ? <EyeOff className="text-gray-400" size={15} /> : <Eye className="text-gray-400" size={15} />}
                                        </button>
                                    </div>
                                    <FormMessage className="text-red-600" />
                                </>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full text-center rounded-xl bg-black text-sm font-medium text-white hover:bg-slate-900 p-6">
                            Sign In
                        </Button>

                        {/* Sign-up Prompt */}
                        <p className="text-sm text-center text-gray-500">
                            New to Retweet? <Link className="text-indigo-600 hover:underline" href="/sign-up">Create account here</Link>
                        </p>
                    </form>
                </Form>
            </div>

            {/* Right section (Image) */}
            <div className="relative hidden md:block">
                <Image
                    alt="Welcome"
                    src={signInPic}
                    className="absolute inset-0 h-full w-full object-cover"
                    quality={100}
                    priority
                />
            </div>
        </div>




    )
}

