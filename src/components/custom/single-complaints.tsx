import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { getStatusColor, getStatusUpdateColor } from '@/utils/status'
import { Clock, FileText, GraduationCap, MessageSquare } from 'lucide-react'
import { getComplaintById } from '@/utils/actions/complaints'

export async function SingleComplaints({ isAdmin, complaintId }: { isAdmin?: boolean; complaintId: string }) {
  const complaint = await getComplaintById(complaintId)

  console.log('Complaint Data:', complaint)

  if (!complaint || !complaint.success || !complaint.data) {
    return <div className="text-center text-red-500">Complaint not found</div>
  }

  const complaintData = complaint.data?.complaints
  const attachments = complaint.data?.attachments
  const statusHistory = complaint.data?.statusHistory

  const statusClassname =
    (complaintData.status.toLowerCase() === 'resolved' && isAdmin) || (complaintData.status != 'resolved' && !isAdmin)
      ? 'space-y-4 h-fit'
      : 'h-[95px]'

  return (
    <ScrollArea className="h-[880px] w-full">
      <div className="mx-auto w-full space-y-6 py-8">
        {/* Complaint Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  <div className="flex items-center justify-center gap-2 capitalize">
                    {complaintData.title}
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 text-xs ${getStatusColor(complaintData.status.toLowerCase() || 'pending')}`}
                    >
                      {complaintData.status.toLowerCase()}
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Submitted on{' '}
                  {complaintData.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardDescription>
              </div>

              <Button
                variant="outline"
                className={`cursor-pointer capitalize ${complaintData.status.toLowerCase() === 'pending' ? 'bg-purple-500/50' : complaintData.status.toLowerCase() === 'in-review' ? 'bg-green-500/50' : ''}`}
              >
                {isAdmin && complaintData.status.toLowerCase() === 'pending'
                  ? 'Mark as In-Review'
                  : 'Resolve complaint'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex w-75 items-center justify-between">
                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <FileText className="size-4" />
                    Category
                  </h3>
                  <Badge variant="outline" className="px-3 py-1 text-sm capitalize">
                    {complaintData.category}
                  </Badge>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <GraduationCap className="size-4" />
                    Faculty
                  </h3>
                  <Badge variant="outline" className="px-3 py-1 text-sm capitalize">
                    {complaintData.faculty}
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <MessageSquare className="size-4" />
                  Description
                </h3>
                <p className="text-muted-foreground bg-muted/50 rounded-lg p-4 capitalize">
                  {complaintData.description}
                </p>
              </div>
              {attachments && attachments.length > 0 && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <FileText className="size-4" />
                    Attachments
                  </h3>
                  <div className="flex gap-2">
                    {attachments.map((file, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                        {file.fileName}
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
            <ScrollArea className={statusClassname}>
              {statusHistory.map((update, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'size-2 rounded-full',
                        getStatusUpdateColor(update.complaint_status_history.newValue.toLowerCase()),
                      )}
                    />
                    {index !== statusHistory.length - 1 && <div className="bg-border h-12 w-0.5" />}
                  </div>
                  <div>
                    <p className="font-medium">Status changed to {update.complaint_status_history.newValue}</p>
                    <p className="text-muted-foreground text-sm">
                      {update.complaint_status_history.changedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Feedback Form (if resolved) and if not admin */}
        {complaintData.status.toLowerCase() === 'resolved' && !isAdmin && (
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

        {/* Admin Actions (if admin) and Withdraw Complaint Button (if not admin)  */}
        {isAdmin && complaintData.status.toLowerCase() != 'resolved' ? (
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
                  <Select defaultValue={complaintData.priority.toLowerCase()}>
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
        ) : complaintData.status.toLowerCase() != 'resolved' ? (
          <div className="flex justify-end">
            <Button variant="destructive" className="gap-2">
              <FileText className="size-4" />
              Withdraw Complaint
            </Button>
          </div>
        ) : null}
      </div>
    </ScrollArea>
  )
}
