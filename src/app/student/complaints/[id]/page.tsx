export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>ComplaintDetailPage {id}</div>
}
