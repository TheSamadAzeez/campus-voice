import { complaintCategoryEnum, complaintStatusEnum, facultyEnum, priorityEnum, resolutionTypeEnum } from '@/db/schema'

export interface ComplaintType {
  id: string
  userId: string
  title: string
  description: string
  faculty: (typeof facultyEnum.enumValues)[number]
  category: (typeof complaintCategoryEnum.enumValues)[number]
  resolutionType: (typeof resolutionTypeEnum.enumValues)[number]
  status: (typeof complaintStatusEnum.enumValues)[number]
  priority: (typeof priorityEnum.enumValues)[number]
  sensitive: boolean
  createdAt: Date | string
  hasFeedback?: boolean
}

export interface ComplaintWithDetails extends ComplaintType {
  attachments?: any[]
  statusHistory?: any[]
  feedback?: any
}

export type OrderByOptions =
  | 'sensitive-first'
  | 'title'
  | 'faculty'
  | 'priority'
  | 'status'
  | 'date-newest'
  | 'date-oldest'

export type SensitiveFilterOptions = 'all' | 'sensitive' | 'regular'
