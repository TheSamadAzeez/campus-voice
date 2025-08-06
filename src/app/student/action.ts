import { getComplaintStats, getUserComplaints } from '@/utils/actions/complaints'

export async function getDashboardData() {
  const [stats, complaints] = await Promise.all([getComplaintStats(), getUserComplaints()])

  return {
    stats,
    complaints,
  }
}
