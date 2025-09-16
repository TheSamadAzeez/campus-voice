'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface FeedbackAnalyticsProps {
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  facultyStats: Array<{
    faculty: string
    averageRating: number
    feedbackCount: number
  }>
}

export function FeedbackAnalytics({ ratingDistribution, facultyStats }: FeedbackAnalyticsProps) {
  // Prepare rating distribution data for chart
  const ratingChartData = Object.entries(ratingDistribution).map(([rating, count]) => ({
    rating: `${rating} Star${parseInt(rating) !== 1 ? 's' : ''}`,
    count,
    percentage: 0, // Will be calculated
  }))

  const totalRatings = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0)
  ratingChartData.forEach((item) => {
    item.percentage = totalRatings > 0 ? Math.round((item.count / totalRatings) * 100) : 0
  })

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Rating Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {ratingChartData.map((item) => (
              <div key={item.rating} className="text-center">
                <div className="text-sm font-medium">{item.percentage}%</div>
                <div className="text-muted-foreground text-xs">{item.count} reviews</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Faculty Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4 pr-4">
              {facultyStats.length > 0 ? (
                facultyStats
                  .sort((a, b) => b.averageRating - a.averageRating)
                  .map((faculty) => (
                    <div key={faculty.faculty} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{faculty.faculty}</div>
                        <div className="text-muted-foreground text-sm">
                          {faculty.feedbackCount} feedback{faculty.feedbackCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold">{faculty.averageRating.toFixed(1)}</div>
                        <Badge
                          variant={
                            faculty.averageRating >= 4.5
                              ? 'default'
                              : faculty.averageRating >= 4
                                ? 'secondary'
                                : faculty.averageRating >= 3.5
                                  ? 'outline'
                                  : 'destructive'
                          }
                        >
                          {faculty.averageRating >= 4.5
                            ? 'Excellent'
                            : faculty.averageRating >= 4
                              ? 'Very Good'
                              : faculty.averageRating >= 3.5
                                ? 'Good'
                                : faculty.averageRating >= 3
                                  ? 'Fair'
                                  : 'Poor'}
                        </Badge>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-muted-foreground py-8 text-center">No faculty feedback data available</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
