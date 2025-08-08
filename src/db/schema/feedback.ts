import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { complaints } from './complaints'
import { users } from './users'

// schema/complaint-feedback.ts
export const complaintFeedback = pgTable('complaint_feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  complaintId: uuid('complaint_id')
    .notNull()
    .unique()
    .references(() => complaints.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5 scale, add check constraint separately
  feedbackText: text('feedback_text'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
})
