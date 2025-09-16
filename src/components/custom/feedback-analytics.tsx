'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, TrendingUp, Users, Clock } from 'lucide-react'

interface FeedbackAnalyticsProps {
  stats: {
    totalFeedback: number
    averageRating: number
    resolvedWithFeedback: number
    totalResolved: number
  }
}

export function FeedbackAnalytics({ stats }: FeedbackAnalyticsProps) {
  const responseRate =
    stats.totalResolved > 0 ? Math.round((stats.resolvedWithFeedback / stats.totalResolved) * 100) : 0

  const getRatingTrend = (rating: number) => {
    if (rating >= 4.5) return { trend: 'Excellent', color: 'text-green-600', icon: '📈' }
    if (rating >= 4) return { trend: 'Very Good', color: 'text-green-500', icon: '📊' }
    if (rating >= 3.5) return { trend: 'Good', color: 'text-yellow-600', icon: '📉' }
    if (rating >= 3) return { trend: 'Fair', color: 'text-yellow-500', icon: '📊' }
    return { trend: 'Needs Improvement', color: 'text-red-600', icon: '📉' }
  }

  const ratingTrend = getRatingTrend(stats.averageRating)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Satisfaction Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
          <MessageSquare className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5.0</div>
          <p className={`text-xs ${ratingTrend.color} flex items-center gap-1`}>
            <span>{ratingTrend.icon}</span>
            {ratingTrend.trend}
          </p>
        </CardContent>
      </Card>

      {/* Response Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          <TrendingUp className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{responseRate}%</div>
          <p className="text-muted-foreground text-xs">
            {stats.resolvedWithFeedback} of {stats.totalResolved} resolved complaints
          </p>
        </CardContent>
      </Card>

      {/* Total Responses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          <Users className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFeedback}</div>
          <p className="text-muted-foreground text-xs">Feedback submissions received</p>
        </CardContent>
      </Card>

      {/* Service Quality */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service Quality</CardTitle>
          <Clock className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <Badge
              variant={stats.averageRating >= 4 ? 'default' : stats.averageRating >= 3 ? 'secondary' : 'destructive'}
            >
              {stats.averageRating >= 4 ? 'High' : stats.averageRating >= 3 ? 'Medium' : 'Low'}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">Based on student ratings</p>
        </CardContent>
      </Card>
    </div>
  )
}
