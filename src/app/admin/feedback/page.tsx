import { getFeedbackStats } from '@/utils/actions/feedback'
import { FeedbackOverview } from './components/feedback-overview'
import { FeedbackList } from './components/feedback-list'
import { FeedbackAnalytics } from './components/feedback-analytics'

export default async function AdminFeedbackPage() {
  const feedbackData = await getFeedbackStats()

  if (!feedbackData.success) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">Error loading feedback data: {feedbackData.error}</p>
        </div>
      </div>
    )
  }

  const { stats, ratingDistribution, facultyStats, recentFeedback } = feedbackData.data!

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Feedback Management</h1>
        <div className="text-muted-foreground text-sm">
          Total Feedback: {stats.totalFeedback} | Response Rate: {stats.responseRate}%
        </div>
      </div>

      {/* Overview Stats */}
      <FeedbackOverview stats={stats} />

      {/* Analytics Charts */}
      <FeedbackAnalytics ratingDistribution={ratingDistribution} facultyStats={facultyStats} />

      {/* Recent Feedback List */}
      {/* <FeedbackList feedbackList={recentFeedback} /> */}
    </div>
  )
}
