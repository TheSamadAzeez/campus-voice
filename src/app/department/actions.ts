import { getAdminComplaintsStats, getAllComplaintChartData, getAllComplaints } from '@/utils/actions/complaints'

export async function getAdminDashboardData() {
  const [stats, complaints, chart] = await Promise.all([
    getAdminComplaintsStats(),
    getAllComplaints(),
    getAllComplaintChartData(),
  ])

  return {
    stats,
    complaints,
    chart,
  }
}
