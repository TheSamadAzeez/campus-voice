import { Statistics } from '../student/components/statistics'
import { ChartAreaInteractive } from './components/area-chart'
import { ChartPieSimple } from './components/pie-chart'
import { getAdminDashboardData } from './actions'

export default async function AdminPage() {
  const dashboardData = await getAdminDashboardData()

  const defaultStats = {
    total: 0,
    pending: 0,
    resolved: 0,
    inReview: 0,
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      {/* Complaint Statistics */}
      <div className="flex w-full gap-4">
        <Statistics stats={dashboardData?.stats?.data || defaultStats} />
        <ChartPieSimple chartData={dashboardData?.chart?.data?.facultyChart || []} />
      </div>

      {/* Charts Section */}
      <ChartAreaInteractive chartData={dashboardData?.chart?.data?.dateChart || []} />
    </div>
  )
}
