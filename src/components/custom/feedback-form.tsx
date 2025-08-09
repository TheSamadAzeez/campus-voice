'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare } from 'lucide-react'

export function FeedbackForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="size-5" />
          Provide Feedback
        </CardTitle>
        <CardDescription>Let us know how we handled your complaint</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Share your experience with how we handled your complaint..."
              className="min-h-[100px]"
            />
          </div>
          <Button className="w-full bg-[#24c0b7] sm:w-auto">Submit Feedback</Button>
        </div>
      </CardContent>
    </Card>
  )
}
