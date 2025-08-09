'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare } from 'lucide-react'

interface AdminActionsProps {
  defaultPriority: string
}

export function AdminActions({ defaultPriority }: AdminActionsProps) {
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
            <Select defaultValue={defaultPriority.toLowerCase()}>
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
