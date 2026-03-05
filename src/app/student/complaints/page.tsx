import { Button } from '@/components/ui/button'
import { getUserComplaints } from '@/utils/actions/complaints'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ComplaintsFilters from './components/complaints-filters'

export default async function ComplaintsPage() {
  const result = await getUserComplaints()

  if (!result.success) {
    if (result.error === 'User not authenticated') {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Complaints Management</h1>

        <Button asChild size={'lg'} className="bg-[#24c0b7] text-white hover:bg-[#24c0b7]/60">
          <Link href="/student/complaints/submit">
            <CirclePlus color="#fff" className="size-5" />
            <p className="text-sm font-medium">New Complaint</p>
          </Link>
        </Button>
      </div>

      <ComplaintsFilters complaints={complaints} />
    </div>
  )
}
