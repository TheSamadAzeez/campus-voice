import { index } from 'drizzle-orm/pg-core'
import { complaints } from './complaints'
import { complaintStatusHistory } from './status-history'
import { notifications } from './notifications'
import { complaintAttachments } from './attachments'

// schema/indexes.ts
export const complaintIndexes = {
  userIdIdx: index('idx_complaints_user_id').on(complaints.userId),
  statusIdx: index('idx_complaints_status').on(complaints.status),
  categoryIdx: index('idx_complaints_category').on(complaints.category),
  submittedAtIdx: index('idx_complaints_submitted_at').on(complaints.submittedAt),
}

export const statusHistoryIndexes = {
  complaintIdx: index('idx_status_history_complaint').on(complaintStatusHistory.complaintId),
  changedAtIdx: index('idx_status_history_changed_at').on(complaintStatusHistory.changedAt),
}

export const notificationIndexes = {
  userIdIdx: index('idx_notifications_user_id').on(notifications.userId),
  isReadIdx: index('idx_notifications_is_read').on(notifications.isRead),
  createdAtIdx: index('idx_notifications_created_at').on(notifications.createdAt),
}

export const attachmentIndexes = {
  complaintIdx: index('idx_attachments_complaint').on(complaintAttachments.complaintId),
}
