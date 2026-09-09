import type { Metadata } from "next"
import SignUpForm from "@/components/forms/signUpForm"

export const metadata: Metadata = {
    title: "Create your account — Retweet",
}

export default function SignUpPage() {
    return <SignUpForm />
}
