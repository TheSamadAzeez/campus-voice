import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { fieldChangedEnum } from './enums'
import { users } from './users'
import { complaints } from './complaints'

// schema/complaint-status-history.ts
export const complaintStatusHistory = pgTable('complaint_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  complaintId: uuid('complaint_id')
    .notNull()
    .references(() => complaints.id, { onDelete: 'cascade' }),
  changedBy: varchar('changed_by', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'set null' }),
  fieldChanged: fieldChangedEnum('field_changed').notNull(),
  oldValue: varchar('old_value', { length: 50 }),
  newValue: varchar('new_value', { length: 50 }).notNull(),
  changedAt: timestamp('changed_at').defaultNow().notNull(),
  notes: text('notes'), // Optional admin notes
})
