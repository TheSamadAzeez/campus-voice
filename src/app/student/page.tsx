import { Activity, AlertCircle, CheckCircle2, Clock, LucideIcon } from 'lucide-react'
import { ChartAreaGradient } from './components/area-chart'
import { Statistics } from './components/statistics'
import { TableComponent } from '../../components/custom/table'
import { getUserComplaints } from '@/utils/actions/complaints'

// Mock data for demonstration

interface ComplaintStats {
  id: number
  title: string
  value: number
  icon: LucideIcon
  color: string
}

const COMPLAINT_STATS: ComplaintStats[] = [
  {
    id: 1,
    title: 'Total Complaints',
    value: 12,
    icon: Activity,
    color: 'green',
  },
  {
    id: 2,
    title: 'Resolved Complaints',
    value: 5,
    icon: CheckCircle2,
    color: 'blue',
  },
  {
    id: 3,
    title: 'In Review',
    value: 4,
    icon: Clock,
    color: 'purple',
  },
  {
    id: 4,
    title: 'Pending Complaints',
    value: 3,
    icon: AlertCircle,
    color: '#f55612',
  },
]

export default async function StudentPage() {
  const { data } = await getUserComplaints(3)
  return (
    <div className="mx-auto w-full space-y-6 p-6">
      <h1 className="mb-6 text-3xl font-bold">Hello, Samad</h1>
      <div className="flex w-full gap-4">
        {/* Complaint Statistics */}
        <Statistics stats={COMPLAINT_STATS} />
        <ChartAreaGradient />
      </div>
      {/* Recent Activities */}
      <TableComponent data={data || []} dashboard />
    </div>
  )
}
