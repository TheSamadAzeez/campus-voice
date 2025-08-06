import { TableComponent } from '../../components/custom/table'
import { getDashboardData } from './action'
import { ChartAreaGradient } from './components/area-chart'
import { Statistics } from './components/statistics'

export default async function StudentPage() {
  const dashboardData = await getDashboardData()

  const defaultStats = {
    total: 0,
    pending: 0,
    resolved: 0,
    inReview: 0,
  }

  return (
    <div className="mx-auto w-full space-y-6 p-6">
      <h1 className="mb-6 text-3xl font-bold">Hello, Samad</h1>
      <div className="flex w-full gap-4">
        {/* Complaint Statistics */}
        <Statistics stats={dashboardData?.stats?.data || defaultStats} />
        <ChartAreaGradient />
      </div>
      {/* Recent Activities */}
      <TableComponent data={dashboardData.complaints.data || []} dashboard />
    </div>
  )
}
