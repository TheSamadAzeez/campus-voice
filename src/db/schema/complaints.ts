import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { complaintCategoryEnum, complaintStatusEnum, facultyEnum, priorityEnum, resolutionTypeEnum } from './enums'
import { users } from './users'

// schema/complaints.ts
export const complaints = pgTable('complaints', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  category: complaintCategoryEnum('category').notNull(),
  faculty: facultyEnum('faculty').notNull(),
  resolutionType: resolutionTypeEnum('resolution_type').notNull(),
  status: complaintStatusEnum('status').default('pending').notNull(),
  priority: priorityEnum('priority').default('normal').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
