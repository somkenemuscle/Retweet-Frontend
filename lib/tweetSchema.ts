import { z } from 'zod'

export const tweetFormSchema = z.object({
    text: z.string().optional(),
    image: z.string().optional(),
}).refine((data) => data.text || data.image, {
    message: "Either text or image must be provided",
    path: ["text", "image"], // Error can be shown for both fields
});

