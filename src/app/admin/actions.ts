import { getAdminComplaintsStats, getAllComplaints } from '@/utils/actions/complaints'

export async function getAdminDashboardData() {
  const [stats, complaints] = await Promise.all([getAdminComplaintsStats(), getAllComplaints()])

  return {
    stats,
    complaints,
  }
}
