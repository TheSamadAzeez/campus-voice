import { z } from 'zod'

export const feedbackSchema = z.object({
  rating: z.number().min(1, 'Please provide a rating').max(5, 'Rating must be between 1 and 5'),
  feedbackText: z
    .string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(500, 'Feedback must be less than 500 characters'),
})

export type FeedbackFormData = z.infer<typeof feedbackSchema>
