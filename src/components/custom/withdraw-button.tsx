'use client'

import { Button } from '@/components/ui/button'
import { withdrawComplaint } from '@/utils/actions/complaints'
import { FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function WithdrawButton({ complaintId }: { complaintId: string }) {
  const router = useRouter()

  const handleWithdraw = async (complaintId: string) => {
    const result = await withdrawComplaint(complaintId)
    if (result.success) {
      toast.success(result.message || 'Complaint withdrawn successfully', {
        description: 'Your complaint has been withdrawn.',
      })
      // Navigate to complaints list after successful withdrawal
      router.push('/student/complaints')
    } else {
      toast.error(result.error || 'Failed to withdraw complaint', {
        description: 'Please try again later',
      })
    }
  }

  return (
    <div className="flex justify-end">
      <Button
        variant="destructive"
        className="gap-2"
        onClick={() => {
          handleWithdraw(complaintId)
        }}
      >
        <FileText className="size-4" />
        Withdraw Complaint
      </Button>
    </div>
  )
}
