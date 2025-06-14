import { SingleComplaints } from '@/components/custom/single-complaints'

export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Mock data - replace with actual data fetching
  const complaint = {
    id,
    title: 'Noise Complaint in Dormitory',
    category: 'Facilities',
    faculty: 'science',
    status: 'In-Review',
    dateSubmitted: '2024-03-20',
    description: 'There has been excessive noise coming from Room 302 during late hours...',
    attachments: ['noise_recording.mp3', 'photo_evidence.jpg'],
    statusUpdates: [
      {
        from: '',
        to: 'Pending',
        timestamp: '2024-03-21 09:15 AM',
      },
      {
        from: 'Pending',
        to: 'In-Review',
        timestamp: '2024-03-21 09:15 AM',
      },
      {
        from: 'In-Review',
        to: 'Resolved',
        timestamp: '2024-03-21 09:15 AM',
      },
    ],
    isResolved: true,
  }

  return <SingleComplaints complaint={complaint} />
}
