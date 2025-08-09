'use client'

import { updateStatus } from '@/utils/actions/complaints'
import { Button } from '../ui/button'

export function StatusButton({
  complaintData,
  complaintId,
  isAdmin,
}: {
  complaintData: any
  complaintId: string
  isAdmin?: boolean
}) {
  return (
    <Button
      variant="outline"
      className={`cursor-pointer capitalize ${complaintData.status.toLowerCase() === 'pending' ? 'bg-purple-500/50' : complaintData.status.toLowerCase() === 'in-review' ? 'bg-green-500/50' : complaintData.status.toLowerCase() === 'resolved' ? 'hidden' : ''}`}
      onClick={() => {
        const status = complaintData.status.toLowerCase() === 'pending' ? 'in-review' : 'resolved'
        updateStatus(complaintId, status)
      }}
    >
      {isAdmin && complaintData.status.toLowerCase() === 'pending'
        ? 'Mark as In-Review'
        : isAdmin && complaintData.status.toLowerCase() === 'in-review'
          ? 'Resolve complaint'
          : 'Resolved'}
    </Button>
  )
}
