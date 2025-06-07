export default async function ComplaintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Complaint {id}</div>
}
