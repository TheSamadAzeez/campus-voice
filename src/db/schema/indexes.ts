import { index } from 'drizzle-orm/pg-core'
import { users } from './users'
import { complaints } from './complaints'
import { complaintStatusHistory } from './status-history'
import { notifications } from './notifications'
import { complaintAttachments } from './attachments'

// schema/indexes.ts
export const userIndexes = {
  emailIdx: index('idx_users_email').on(users.email),
  roleIdx: index('idx_users_role').on(users.role),
}

export const complaintIndexes = {
  userIdIdx: index('idx_complaints_user_id').on(complaints.userId),
  statusIdx: index('idx_complaints_status').on(complaints.status),
  categoryIdx: index('idx_complaints_category').on(complaints.category),
  facultyIdx: index('idx_complaints_faculty').on(complaints.faculty),
  priorityIdx: index('idx_complaints_priority').on(complaints.priority),
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
