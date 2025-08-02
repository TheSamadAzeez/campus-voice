// schema/index.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import {
  userRoleEnum,
  complaintCategoryEnum,
  facultyEnum,
  complaintStatusEnum,
  fieldChangedEnum,
  notificationTypeEnum,
  priorityEnum,
  resolutionTypeEnum,
} from './enums'
import { users } from './users'
import { complaints } from './complaints'
import { complaintAttachments } from './attachments'
import { complaintStatusHistory } from './status-history'
import { complaintFeedback } from './feedback'
import { notifications } from './notifications'

export const db = drizzle(process.env.DATABASE_URL!)

// Export all tables
export {
  // enums
  userRoleEnum,
  complaintCategoryEnum,
  facultyEnum,
  resolutionTypeEnum,
  complaintStatusEnum,
  priorityEnum,
  fieldChangedEnum,
  notificationTypeEnum,
  //   all tables
  users,
  complaints,
  complaintAttachments,
  complaintStatusHistory,
  complaintFeedback,
  notifications,
}

// Type exports for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Complaint = typeof complaints.$inferSelect
export type NewComplaint = typeof complaints.$inferInsert
export type ComplaintAttachment = typeof complaintAttachments.$inferSelect
export type NewComplaintAttachment = typeof complaintAttachments.$inferInsert
export type ComplaintStatusHistory = typeof complaintStatusHistory.$inferSelect
export type NewComplaintStatusHistory = typeof complaintStatusHistory.$inferInsert
export type ComplaintFeedback = typeof complaintFeedback.$inferSelect
export type NewComplaintFeedback = typeof complaintFeedback.$inferInsert
export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
