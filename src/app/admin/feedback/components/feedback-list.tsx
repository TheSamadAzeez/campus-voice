'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Calendar, User, MessageSquare } from 'lucide-react'
// Using built-in date formatting instead of date-fns

interface FeedbackListProps {
  feedbackList: Array<{
    id: string
    rating: number
    feedbackText: string | null
    submittedAt: Date
    complaintTitle: string
    complaintId: string
    studentName: string
    studentLastName: string | null
    faculty: string
  }>
}

export function FeedbackList({ feedbackList }: FeedbackListProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`size-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="text-muted-foreground size-5" />
          Recent Feedback ({feedbackList.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {feedbackList.length > 0 ? (
          <div className="space-y-4">
            {feedbackList.slice(0, 10).map((feedback) => (
              <div key={feedback.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="text-muted-foreground size-4" />
                        <span className="font-medium">
                          {feedback.studentName} {feedback.studentLastName}
                        </span>
                        <Badge variant="outline">{feedback.faculty}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(feedback.rating)}
                        <span className={`font-bold ${getRatingColor(feedback.rating)}`}>{feedback.rating}/5</span>
                      </div>
                    </div>

                    {/* Complaint Title */}
                    <div className="text-muted-foreground text-sm">
                      <strong>Complaint:</strong> {feedback.complaintTitle}
                    </div>

                    {/* Feedback Text */}
                    {feedback.feedbackText && (
                      <div className="rounded bg-gray-50 p-3">
                        <p className="text-sm italic">&ldquo;{feedback.feedbackText}&rdquo;</p>
                      </div>
                    )}

                    {/* Date */}
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Calendar className="size-3" />
                      <span>{new Date(feedback.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {feedbackList.length > 10 && (
              <div className="text-muted-foreground py-4 text-center">
                Showing 10 of {feedbackList.length} feedback entries
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center">No feedback received yet</div>
        )}
      </CardContent>
    </Card>
  )
}
