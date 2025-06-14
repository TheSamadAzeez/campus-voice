'use client'

import { Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { Statistics } from '../student/components/statistics'
import { ChartAreaInteractive } from './components/area-chart'
import { ChartPieSimple } from './components/pie-chart'

// Mock data for demonstration
interface ComplaintStats {
  id: number
  title: string
  value: number
  icon: any
  color: string
}

const COMPLAINT_STATS: ComplaintStats[] = [
  {
    id: 1,
    title: 'Total Complaints',
    value: 45,
    icon: Activity,
    color: 'green',
  },
  {
    id: 2,
    title: 'Resolved',
    value: 20,
    icon: CheckCircle2,
    color: 'blue',
  },
  {
    id: 3,
    title: 'In Review',
    value: 15,
    icon: Clock,
    color: 'purple',
  },
  {
    id: 4,
    title: 'Pending',
    value: 7,
    icon: AlertCircle,
    color: '#f55612',
  },
]

export default function AdminPage() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      {/* Complaint Statistics */}
      <div className="flex w-full gap-4">
        <Statistics stats={COMPLAINT_STATS} />
        <ChartPieSimple />
      </div>

      {/* Charts Section */}
      <ChartAreaInteractive />
    </div>
  )
}
