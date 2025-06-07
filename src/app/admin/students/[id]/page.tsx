export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Student {id}</div>
}
