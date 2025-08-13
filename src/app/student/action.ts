import { getComplaintChartData, getComplaintStats, getUserComplaints } from '@/utils/actions/complaints'
import { getUser } from '@/utils/actions/user'

export async function getDashboardData() {
  const [stats, complaints, user, chart] = await Promise.all([
    getComplaintStats(),
    getUserComplaints(3),
    getUser(),
    getComplaintChartData(),
  ])

  return {
    stats,
    complaints,
    chart,
    user: { name: user?.user?.firstName || 'User' },
  }
}
