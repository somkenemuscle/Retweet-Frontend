'use client'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useState, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import ReCAPTCHA from "react-google-recaptcha";
import { SignUpFormSchema } from "@/lib/authSchema";
import { AuthHeading, PasswordInput, SubmitButton } from "./authUi";

export default function SignUpForm() {
    const { toast } = useToast();
    const router = useRouter();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof SignUpFormSchema>>({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    const onReCAPTCHAChange = (token: string | null) => {
        setRecaptchaToken(token);
    };

    //Reser captch function
    const resetRecaptcha = () => {
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    };

    async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
        try {
            if (!recaptchaToken) {
                toast({
                    className: "shadcn-toast-failure",
                    description: "Please complete the reCAPTCHA",
                });
                return;
            }

            // Show loader before making the request
            setLoading(true);

            // Send a POST request to the signup endpoint
            const res = await axiosInstance.post('/auth/signup', {
                username: values.username,
                email: values.email,
                password: values.password,
                recaptchaToken
            });

            // Extract message from response
            const { message, username } = res.data;

            // Store username in local storage
            localStorage.setItem('username', username);

            // Reset the form after successful signup
            form.reset();

            // Clear the reCAPTCHA token
            setRecaptchaToken(null);
            resetRecaptcha();

            // Redirect to the home page or another route after successful signup
            router.push('/');

            // Show success toast notification
            toast({
                className: "shadcn-toast-success",
                description: message
            });

        } catch (error: any) {
            console.error('Error occurred during signup:', error);

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

            // Clear the reCAPTCHA token
            setRecaptchaToken(null);
            resetRecaptcha();
        } finally {
            // Hide the loader after request is complete (either success or error)
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <AuthHeading
                title="Create your account"
                subtitle="Join Retweet and start following the conversations you care about."
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
                                        placeholder="Pick a handle"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
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
                                        autoComplete="new-password"
                                        placeholder="Create a strong password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="overflow-hidden rounded-lg border border-border bg-muted/40 p-3">
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                            onChange={onReCAPTCHAChange}
                            ref={recaptchaRef}
                        />
                    </div>

                    <div className="pt-1">
                        <SubmitButton loading={loading}>Create account</SubmitButton>
                    </div>

                    <p className="text-center text-xs leading-relaxed text-muted-foreground">
                        By creating an account you agree to our Terms of Service and
                        Privacy Policy.
                    </p>
                </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/sign-in"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </div>
    )
}
