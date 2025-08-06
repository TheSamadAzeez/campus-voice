import { getAllComplaints } from '@/utils/actions/complaints'
import { complaintCategoryEnum, complaintStatusEnum, facultyEnum, priorityEnum, resolutionTypeEnum } from '@/db/schema'
import { redirect } from 'next/navigation'
import ComplaintsFilters from './components/complaints-filters'

interface COMPLAINT {
  id: string
  userId: string
  title: string
  description: string
  faculty: (typeof facultyEnum.enumValues)[number]
  category: (typeof complaintCategoryEnum.enumValues)[number]
  resolutionType: (typeof resolutionTypeEnum.enumValues)[number]
  status: (typeof complaintStatusEnum.enumValues)[number]
  priority: (typeof priorityEnum.enumValues)[number]
  createdAt: Date | string
}

export default async function AllComplaintsPage() {
  const result = await getAllComplaints()

  if (!result.success) {
    if (result.error === 'You are not authorized to access this page') {
      redirect('/login')
    }
    return (
      <div className="container mx-auto space-y-6 py-6">
        <div className="flex items-center justify-center">
          <p className="text-red-500">Error: {result.error}</p>
        </div>
      </div>
    )
  }

  const complaints = result.data || []

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Complaints Management</h1>
      </div>

      <ComplaintsFilters complaints={complaints} />
    </div>
  )
}
