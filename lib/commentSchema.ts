import { z } from 'zod'

export const commentFormSchema = z.object({
    text: z.string()
});

