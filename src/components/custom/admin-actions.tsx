'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare } from 'lucide-react'
import { updatePriority } from '@/utils/actions/complaints'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

const prioritySchema = z.object({
  priority: z.enum(['low', 'normal', 'high'], {
    required_error: 'Please select a priority level',
  }),
})

type PriorityFormData = z.infer<typeof prioritySchema>

interface AdminActionsProps {
  defaultPriority: string
  complaintId: string
}

export function AdminActions({ defaultPriority, complaintId }: AdminActionsProps) {
  const {
    watch,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<PriorityFormData>({
    resolver: zodResolver(prioritySchema),
    defaultValues: {
      priority: defaultPriority.toLowerCase() as 'low' | 'normal' | 'high',
    },
  })

  const currentPriority = watch('priority')

  const onSubmit = async (data: PriorityFormData) => {
    try {
      const result = await updatePriority(complaintId, data.priority)

      if (result.success) {
        toast.success('Priority updated successfully')
      } else {
        toast.error(result.error || 'Failed to update priority')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error updating priority:', error)
    }
  }

  const handlePriorityChange = (newPriority: string) => {
    setValue('priority', newPriority as 'low' | 'normal' | 'high')
    handleSubmit(onSubmit)()
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="size-5" />
          Admin Actions
        </CardTitle>
        <CardDescription>Update the priority of this complaint</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-10">
          <div className="space-y-2">
            <Label htmlFor="status">Update Priority</Label>
            <Select value={currentPriority} onValueChange={handlePriorityChange} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
