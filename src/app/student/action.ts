import { getComplaintStats, getUserComplaints } from '@/utils/actions/complaints'
import { getUser } from '@/utils/actions/user'

export async function getDashboardData() {
  const [stats, complaints, user] = await Promise.all([getComplaintStats(), getUserComplaints(3), getUser()])

  return {
    stats,
    complaints,
    user: { name: user?.user?.firstName || 'User' },
  }
}
