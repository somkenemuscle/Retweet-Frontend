"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField, Form } from "../ui/form";
import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from "@/components/ui/AutosizeTextarea";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/lib/toast";
import { useCreateComment } from "@/lib/api";
import Spinner from "../ui/Spinner";
import Avatar from "../ui/Avatar";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import { Smile } from "lucide-react";

const commentFormSchema = z.object({ text: z.string() });

function CreateCommentForm({ action, tweetId }: { action: string; tweetId: string }) {
    const createComment = useCreateComment(tweetId);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const form = useForm<z.infer<typeof commentFormSchema>>({
        resolver: zodResolver(commentFormSchema),
        defaultValues: { text: "" },
    });

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const handleEmojiClick = (emojiObject: any) => {
        form.setValue("text", form.getValues("text") + emojiObject.emoji);
    };

    function onSubmit(values: z.infer<typeof commentFormSchema>) {
        if (!values.text.trim() || action !== "Add") return;
        if (!localStorage.getItem("username")) {
            toast.error("You have to be logged in to reply");
            return;
        }
        createComment.mutate(values.text, {
            onSuccess: () => form.reset(),
        });
    }

    const textValue = form.watch("text") ?? "";
    const canReply = !createComment.isPending && !!textValue.trim();

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canReply) {
            form.handleSubmit(onSubmit)();
        }
    };

    return (
        <div className="border-b border-border px-4 py-3">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
                    <Avatar username={username ?? ""} size={38} className="mt-1" />

                    <div className="min-w-0 flex-1">
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <AutosizeTextarea
                                    {...field}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Post your reply…"
                                    minHeight={44}
                                    className="py-2 text-[17px] leading-relaxed text-foreground"
                                />
                            )}
                        />

                        <div className="mt-1 flex items-center justify-between">
                            <div className="relative text-primary" ref={emojiPickerRef}>
                                <button
                                    type="button"
                                    aria-label="Add emoji"
                                    className="rounded-full p-2 transition-colors hover:bg-primary/10"
                                    onClick={() => setShowEmojiPicker((s) => !s)}
                                >
                                    <Smile className="h-[19px] w-[19px]" />
                                </button>
                                {showEmojiPicker && (
                                    <div className="absolute left-0 top-full z-30 mt-1 animate-scale-in overflow-hidden rounded-xl border border-border shadow-xl">
                                        <EmojiPicker
                                            onEmojiClick={handleEmojiClick}
                                            theme={EmojiTheme.DARK}
                                            width={320}
                                            height={380}
                                            lazyLoadEmojis
                                        />
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={!canReply}
                                className="rounded-full px-5 font-semibold"
                            >
                                {createComment.isPending ? <Spinner size={16} /> : "Reply"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CreateCommentForm;
