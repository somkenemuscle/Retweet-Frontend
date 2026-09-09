'use client'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { SignInFormSchema } from "@/lib/authSchema"
import { AuthHeading, PasswordInput, SubmitButton } from "./authUi"

export default function SignInForm() {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof SignInFormSchema>>({
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    async function onSubmit(values: z.infer<typeof SignInFormSchema>) {
        try {
            // Show loader before making the request
            setLoading(true);

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
                    const responseMessage = error.response.data?.error;
                    if (responseMessage) {
                        errorMessage = responseMessage;
                    } else {
                        errorMessage = error.response.data?.message || errorMessage;
                    }
                } else {
                    // Handle cases where no response is available (e.g., network errors)
                    errorMessage = 'Network error. Please try again.';
                }
            } else {
                // Handle unexpected error types
                errorMessage = 'An unexpected error occurred. Please try again later.';
            }

            // Show error toast notification
            toast({
                className: "shadcn-toast-failure",
                description: errorMessage
            });
        } finally {
            // Hide the loader after request is complete (either success or error)
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <AuthHeading
                title="Welcome back"
                subtitle="Sign in to pick up where the conversation left off."
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        autoComplete="username"
                                        placeholder="yourhandle"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-1">
                        <SubmitButton loading={loading}>Sign in</SubmitButton>
                    </div>
                </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                New to Retweet?{" "}
                <Link
                    href="/sign-up"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                >
                    Create an account
                </Link>
            </p>
        </div>
    )
}
