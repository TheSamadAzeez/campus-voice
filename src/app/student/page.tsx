'use client'

import { Activity, AlertCircle, CheckCircle2, Clock, LucideIcon } from 'lucide-react'
import { ChartAreaGradient } from './components/area-chart'
import { Statistics } from './components/statistics'
import { TableComponent } from './components/table'

// Mock data for demonstration

interface ComplaintStats {
  id: number
  title: string
  value: number
  icon: LucideIcon
  color: string
}

const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: 'Complaint Submitted',
    description: 'Noise complaint in Library',
    status: 'pending',
    date: '2024-03-20',
  },
  {
    id: 2,
    type: 'Complaint Resolved',
    description: 'Cafeteria cleanliness issue',
    status: 'resolved',
    date: '2024-03-19',
  },
  {
    id: 3,
    type: 'Complaint In Review',
    description: 'Dormitory maintenance request',
    status: 'in-review',
    date: '2024-03-18',
  },
]

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

export default function StudentPage() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="mb-6 text-3xl font-bold">Hello, Samad</h1>
      <div className="flex w-full gap-4">
        {/* Complaint Statistics */}
        <Statistics stats={COMPLAINT_STATS} />
        <ChartAreaGradient />
      </div>
      {/* Recent Activities */}
      <TableComponent activities={RECENT_ACTIVITIES} />
    </div>
  )
}
