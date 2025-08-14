import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { getStatusColor, getStatusUpdateColor, getPriorityStatusUpdateColor } from '@/utils/status'
import { Clock, FileText, GraduationCap, MessageSquare } from 'lucide-react'
import { getComplaintById } from '@/utils/actions/complaints'
import { StatusButton } from './statusButton'
import { FeedbackForm } from './feedback-form'
import { AdminActions } from './admin-actions'
import { WithdrawButton } from './withdraw-button'
import MediaDisplay from './media-display'

export async function SingleComplaints({ isAdmin, complaintId }: { isAdmin?: boolean; complaintId: string }) {
  const complaint = await getComplaintById(complaintId)

  if (!complaint || !complaint.success || !complaint.data) {
    return <div className="text-center text-red-500">Complaint not found</div>
  }

  const complaintData = complaint.data?.complaints
  const attachments = complaint.data?.attachments
  const statusHistory = complaint.data?.statusHistory


  const statusClassname =
    (complaintData.status.toLowerCase() === 'resolved' && isAdmin) || (complaintData.status.toLowerCase() !== 'resolved' && !isAdmin)
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

              {isAdmin ? (
                <StatusButton complaintData={complaintData} complaintId={complaintId} isAdmin={isAdmin} />
              ) : complaint.data?.complaints?.status === 'pending' ? (
                <WithdrawButton complaintId={complaintId} />
              ) : null}
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
                  <div className="flex items-center gap-4">
                    {attachments.map((file, index) => (
                      <MediaDisplay
                        key={index}
                        type={file.fileType}
                        src={file.cloudinaryUrl}
                        alt={`Attachment ${index + 1}`}
                        fileName={file.fileName}
                      />
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
              {statusHistory
                .filter(
                  (update, index, self) =>
                    index ===
                    self.findIndex((u) => u.complaint_status_history.id === update.complaint_status_history.id),
                )
                .map((update, index, filteredArray) => (
                  <div key={update.complaint_status_history.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'mt-2 size-2 rounded-full',
                          update.complaint_status_history.fieldChanged === 'priority'
                            ? getPriorityStatusUpdateColor(update.complaint_status_history.newValue.toLowerCase())
                            : getStatusUpdateColor(update.complaint_status_history.newValue.toLowerCase()),
                        )}
                      />
                      {index !== filteredArray.length - 1 && <div className="bg-border h-12 w-0.5" />}
                    </div>
                    <div>
                      <p className="font-medium">
                        {update.complaint_status_history.fieldChanged === 'priority'
                          ? `Priority changed to ${update.complaint_status_history.newValue}`
                          : `Status changed to ${update.complaint_status_history.newValue}`}
                      </p>
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
        {complaintData.status.toLowerCase() === 'resolved' && !isAdmin && <FeedbackForm />}

        {/* Admin Actions (if admin) and Withdraw Complaint Button (if not admin)  */}
        {isAdmin && complaintData.status.toLowerCase() != 'resolved' ? (
          <AdminActions defaultPriority={complaintData.priority} complaintId={complaintId} />
        ) : null}
      </div>
    </ScrollArea>
  )
}
