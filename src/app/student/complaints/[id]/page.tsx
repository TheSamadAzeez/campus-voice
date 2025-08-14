import { SingleComplaints } from '@/components/custom/single-complaints'

export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <SingleComplaints complaintId={id} />
}
