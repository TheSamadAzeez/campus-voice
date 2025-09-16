'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Star, User } from 'lucide-react'

interface AdminFeedbackDisplayProps {
  feedback: {
    id: string
    rating: number | null
    feedbackText: string | null
    submittedAt: Date
  }
}

export function AdminFeedbackDisplay({ feedback }: AdminFeedbackDisplayProps) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="size-5" />
          Student Feedback
        </CardTitle>
        <CardDescription>Feedback provided by the student for this resolved complaint</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Rating Display */}
          {feedback.rating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Service Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star: number) => (
                    <Star
                      key={star}
                      className={`size-4 ${
                        star <= feedback.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <Badge
                    variant={feedback.rating >= 4 ? 'default' : feedback.rating >= 3 ? 'secondary' : 'destructive'}
                    className="ml-2"
                  >
                    {feedback.rating}/5 stars
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Text */}
          {feedback.feedbackText && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Student Comments:</span>
              <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-3">
                <p className="text-sm text-gray-700">{feedback.feedbackText}</p>
              </div>
            </div>
          )}

          {/* Submission Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="size-3" />
            <span>Feedback submitted on {feedback.submittedAt.toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
