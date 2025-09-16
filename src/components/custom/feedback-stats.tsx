'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Star, TrendingUp } from 'lucide-react'

interface FeedbackStatsProps {
  stats: {
    totalFeedback: number
    averageRating: number
    resolvedWithFeedback: number
    totalResolved: number
  }
}

export function FeedbackStats({ stats }: FeedbackStatsProps) {
  const feedbackPercentage =
    stats.totalResolved > 0 ? Math.round((stats.resolvedWithFeedback / stats.totalResolved) * 100) : 0

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRatingText = (rating: number) => {
    if (rating >= 4) return 'Excellent'
    if (rating >= 3) return 'Good'
    if (rating >= 2) return 'Fair'
    return 'Poor'
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <MessageSquare className="size-5" />
          Feedback Overview
        </CardTitle>
        <CardDescription>Student feedback summary for resolved complaints</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Feedback */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-blue-600" />
              <span className="text-sm font-medium">Total Feedback</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalFeedback}</div>
            <Badge variant="outline" className="text-xs">
              {feedbackPercentage}% of resolved complaints
            </Badge>
          </div>

          {/* Average Rating */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-yellow-500" />
              <span className="text-sm font-medium">Average Rating</span>
            </div>
            <div className={`text-2xl font-bold ${getRatingColor(stats.averageRating)}`}>
              {stats.averageRating.toFixed(1)}/5
            </div>
            <Badge
              variant={stats.averageRating >= 4 ? 'default' : stats.averageRating >= 3 ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {getRatingText(stats.averageRating)}
            </Badge>
          </div>

          {/* Response Rate */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-green-600" />
              <span className="text-sm font-medium">Response Rate</span>
            </div>
            <div className="text-2xl font-bold">{feedbackPercentage}%</div>
            <Badge variant="outline" className="text-xs">
              {stats.resolvedWithFeedback} of {stats.totalResolved} resolved
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
