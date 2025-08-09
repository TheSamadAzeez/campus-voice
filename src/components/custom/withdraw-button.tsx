'use client'

import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export function WithdrawButton() {
  return (
    <div className="flex justify-end">
      <Button variant="destructive" className="gap-2">
        <FileText className="size-4" />
        Withdraw Complaint
      </Button>
    </div>
  )
}
