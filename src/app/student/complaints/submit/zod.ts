import { z } from 'zod'

export const complaintSchema = z.object({
  category: z.string().nonempty('category is required'),
  faculty: z.string().nonempty('faculty is required'),
  department: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  resolutionType: z.string().optional(),
})
