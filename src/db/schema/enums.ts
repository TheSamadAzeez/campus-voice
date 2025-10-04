import { pgEnum } from 'drizzle-orm/pg-core'

// schema/enums.ts
export const userRoleEnum = pgEnum('user_role', ['student', 'department-admin', 'admin'])
export const complaintCategoryEnum = pgEnum('complaint_category', [
  'academic',
  'facility',
  'administration',
  'harassment',
  'infrastructure',
  'result',
  'other',
])
export const facultyEnum = pgEnum('faculty', [
  'science',
  'transport',
  'law',
  'art',
  'education',
  'management science',
  'other',
])
export const resolutionTypeEnum = pgEnum('resolution_type', [
  'immediate action',
  'investigation',
  'policy change',
  'other',
])
export const complaintStatusEnum = pgEnum('complaint_status', ['pending', 'in-review', 'resolved'])
export const priorityEnum = pgEnum('priority', ['low', 'normal', 'high'])
export const fieldChangedEnum = pgEnum('field_changed', ['status', 'priority', 'created'])
export const notificationTypeEnum = pgEnum('notification_type', [
  'status_change',
  'priority_change',
  'new_complaint',
  'feedback_request',
  'system',
])
