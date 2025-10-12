import { SingleComplaints } from '@/components/custom/single-complaints'

export default async function AdminComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <SingleComplaints isAdmin complaintId={id} />
}
