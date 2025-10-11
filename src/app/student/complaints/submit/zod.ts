import { z } from 'zod'

export const complaintSchema = z
  .object({
    category: z.string().nonempty('category is required'),
    sensitiveType: z.string().optional(),
    faculty: z.string().nonempty('faculty is required'),
    department: z.string().min(1, 'Department is required'),
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(1, 'Description is required'),
    resolutionType: z.string().optional(),
  })
  .refine(
    (data) => {
      // If category is 'sensitive', sensitiveType must be provided
      if (data.category === 'sensitive') {
        return data.sensitiveType && data.sensitiveType.trim().length > 0
      }
      return true
    },
    {
      message: 'Sensitive type is required for sensitive complaints',
      path: ['sensitiveType'],
    },
  )
