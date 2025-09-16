'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Star } from 'lucide-react'

interface FeedbackDisplayProps {
  feedback: {
    id: string
    rating: number | null
    feedbackText: string | null
    submittedAt: Date
  }
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="size-5" />
          Your Feedback
        </CardTitle>
        <CardDescription>Thank you for providing feedback on this complaint</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Rating Display */}
          {feedback.rating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-4 ${
                        star <= feedback.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <Badge variant="outline" className="ml-2">
                    {feedback.rating}/5 stars
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Text */}
          {feedback.feedbackText && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Your Comments:</span>
              <div className="rounded-lg border bg-gray-50 p-3">
                <p className="text-sm text-gray-700">{feedback.feedbackText}</p>
              </div>
            </div>
          )}

          {/* Submission Date */}
          <div className="text-xs text-gray-500">Submitted on {feedback.submittedAt.toLocaleDateString()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
