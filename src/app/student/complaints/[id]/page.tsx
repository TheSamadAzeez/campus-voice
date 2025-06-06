import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { getStatusColor } from '@/utils/status'
import { Clock, FileText, MessageSquare } from 'lucide-react'

export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Mock data - replace with actual data fetching
  const complaint = {
    id,
    title: 'Noise Complaint in Dormitory',
    category: 'Facilities',
    status: 'In-Review',
    dateSubmitted: '2024-03-20',
    description: 'There has been excessive noise coming from Room 302 during late hours...',
    attachments: ['noise_recording.mp3', 'photo_evidence.jpg'],
    statusUpdates: [
      {
        from: 'Submitted',
        to: 'Under Review',
        timestamp: '2024-03-21 09:15 AM',
      },
    ],
    isResolved: true,
  }

  return (
    <ScrollArea className="h-[800px] w-full">
      <div className="mx-auto w-full space-y-6 py-8">
        {/* Complaint Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Submitted on {complaint.dateSubmitted}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={`px-3 py-1 text-sm ${getStatusColor(complaint.status.toLowerCase())}`}
              >
                {complaint.status.toLowerCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <FileText className="size-4" />
                  Category
                </h3>
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  {complaint.category}
                </Badge>
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <MessageSquare className="size-4" />
                  Description
                </h3>
                <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">{complaint.description}</p>
              </div>
              {complaint.attachments.length > 0 && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <FileText className="size-4" />
                    Attachments
                  </h3>
                  <div className="flex gap-2">
                    {complaint.attachments.map((file, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                        {file}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Status Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complaint.statusUpdates.map((update, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-2 rounded-full bg-orange-500" />
                    {index !== complaint.statusUpdates.length - 1 && <div className="bg-border h-12 w-0.5" />}
                  </div>
                  <div>
                    <p className="font-medium">
                      Status changed from {update.from} to {update.to}
                    </p>
                    <p className="text-muted-foreground text-sm">{update.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Form (if resolved) */}
        {complaint.isResolved && (
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
        )}

        {/* Withdraw Complaint Button */}
        {!complaint.isResolved && (
          <div className="flex justify-end">
            <Button variant="destructive" className="gap-2">
              <FileText className="size-4" />
              Withdraw Complaint
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
