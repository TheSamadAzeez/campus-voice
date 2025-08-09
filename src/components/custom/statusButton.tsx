'use client'

import { updateStatus } from '@/utils/actions/complaints'
import { Button } from '../ui/button'
import { toast } from 'sonner'

export function StatusButton({
  complaintData,
  complaintId,
  isAdmin,
}: {
  complaintData: any
  complaintId: string
  isAdmin?: boolean
}) {
  const handleStatusUpdate = async () => {
    const status = complaintData.status.toLowerCase() === 'pending' ? 'in-review' : 'resolved'

    try {
      const result = await updateStatus(complaintId, status)

      if (result.success) {
        toast.success(result.message || 'Status updated successfully', {
          description: `Complaint marked as ${status.replace('-', ' ')}`,
        })
      } else {
        toast.error(result.error || 'Failed to update status', {
          description: 'Please try again later',
        })
      }
    } catch (error) {
      toast.error('Failed to update status', {
        description: 'Please try again later',
      })
    }
  }

  return (
    <Button
      variant="outline"
      className={`cursor-pointer capitalize ${complaintData.status.toLowerCase() === 'pending' ? 'bg-purple-500/50' : complaintData.status.toLowerCase() === 'in-review' ? 'bg-green-500/50' : complaintData.status.toLowerCase() === 'resolved' ? 'hidden' : ''}`}
      onClick={handleStatusUpdate}
    >
      {isAdmin && complaintData.status.toLowerCase() === 'pending'
        ? 'Mark as In-Review'
        : isAdmin && complaintData.status.toLowerCase() === 'in-review'
          ? 'Resolve complaint'
          : 'Resolved'}
    </Button>
  )
}
