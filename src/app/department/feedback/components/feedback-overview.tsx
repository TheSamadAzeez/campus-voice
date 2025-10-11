'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, TrendingUp, Users, MessageSquare } from 'lucide-react'

interface FeedbackOverviewProps {
  stats: {
    totalFeedback: number
    averageRating: number
    resolvedWithFeedback: number
    totalResolved: number
    responseRate: number
  }
}

export function FeedbackOverview({ stats }: FeedbackOverviewProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4) return 'text-green-500'
    if (rating >= 3.5) return 'text-yellow-600'
    if (rating >= 3) return 'text-yellow-500'
    return 'text-red-600'
  }

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return 'Excellent'
    if (rating >= 4) return 'Very Good'
    if (rating >= 3.5) return 'Good'
    if (rating >= 3) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Feedback */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          <MessageSquare className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFeedback}</div>
          <p className="text-muted-foreground text-xs">
            {stats.resolvedWithFeedback} out of {stats.totalResolved} resolved complaints
          </p>
        </CardContent>
      </Card>

      {/* Average Rating */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getRatingColor(stats.averageRating)}`}>
            {stats.averageRating.toFixed(1)}/5.0
          </div>
          <Badge variant="secondary" className="text-xs">
            {getRatingBadge(stats.averageRating)}
          </Badge>
        </CardContent>
      </Card>

      {/* Response Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          <TrendingUp className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.responseRate}%</div>
          <p className="text-muted-foreground text-xs">Feedback received from students</p>
        </CardContent>
      </Card>

      {/* Satisfaction Level */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfaction Level</CardTitle>
          <Users className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getRatingColor(stats.averageRating)}`}>
            {stats.averageRating >= 4 ? 'High' : stats.averageRating >= 3 ? 'Medium' : 'Low'}
          </div>
          <p className="text-muted-foreground text-xs">Overall service satisfaction</p>
        </CardContent>
      </Card>
    </div>
  )
}
