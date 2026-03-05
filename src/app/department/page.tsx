import { Statistics } from '../student/components/statistics'
import { ChartAreaInteractive } from './components/area-chart'
import { ChartPieDonutActive } from './components/donut-chart'
import { getAdminDashboardData } from './actions'

export default async function DepartmentPage() {
  const dashboardData = await getAdminDashboardData()

  const defaultStats = {
    total: 0,
    pending: 0,
    resolved: 0,
    inReview: 0,
  }

  return (
    <div className="container mx-auto space-y-6 p-2 md:p-6">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Admin Dashboard</h1>

      {/* Complaint Statistics */}
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Statistics stats={dashboardData?.stats?.data || defaultStats} />
        <ChartPieDonutActive chartData={dashboardData?.stats?.data || defaultStats} />
      </div>

      {/* Charts Section */}
      <ChartAreaInteractive chartData={dashboardData?.chart?.data?.dateChart || []} />
    </div>
  )
}
