import { getAllComplaints } from '@/utils/actions/complaints'
import { redirect } from 'next/navigation'
import ComplaintsFilters from './components/complaints-filters'

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
