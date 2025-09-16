'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feedbackSchema, type FeedbackFormData } from './feedback-form-schema'
import { provideFeedback } from '@/utils/actions/feedback'
import { toast } from 'sonner'
import { useState } from 'react'

interface FeedbackFormProps {
  complaintId: string
}

export function FeedbackForm({ complaintId }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    reset,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      feedbackText: '',
    },
  })

  const currentRating = watch('rating')

  const handleRatingClick = (value: number) => {
    setRating(value)
    setValue('rating', value)
  }

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      const result = await provideFeedback(data.feedbackText, data.rating, complaintId)

      if (result.success) {
        toast.success('Feedback submitted successfully!', {
          description: 'Thank you for your feedback. It helps us improve our service.',
        })
        reset()
        setRating(0)
      } else {
        toast.error('Failed to submit feedback', {
          description: result.error || 'An unexpected error occurred. Please try again.',
        })
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error submitting feedback:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="size-5" />
          Provide Feedback
        </CardTitle>
        <CardDescription>Let us know how we handled your complaint</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Rating Section */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating *</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star: number) => (
                <button
                  key={star}
                  type="button"
                  className="transition-colors"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRatingClick(star)}
                >
                  <Star
                    className={`size-6 ${
                      star <= (hoveredRating || currentRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {currentRating || rating ? `${currentRating || rating}/5 stars` : 'Select a rating'}
              </span>
            </div>
            {errors.rating && <p className="text-xs text-red-600">{errors.rating.message}</p>}
          </div>

          {/* Feedback Text Section */}
          <div className="space-y-2">
            <Label htmlFor="feedbackText">Your Feedback *</Label>
            <Textarea
              id="feedbackText"
              {...register('feedbackText')}
              placeholder="Share your experience with how we handled your complaint..."
              className="min-h-[100px]"
            />
            {errors.feedbackText && <p className="text-xs text-red-600">{errors.feedbackText.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#24c0b7] text-white transition-colors hover:bg-[#24c0b7]/90 sm:w-auto"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
