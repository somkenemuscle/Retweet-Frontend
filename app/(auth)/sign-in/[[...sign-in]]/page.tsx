import type { Metadata } from "next"
import SignInForm from "@/components/forms/signInForm"

export const metadata: Metadata = {
    title: "Sign in — Retweet",
}

export default function SignInPage() {
    return <SignInForm />
}
