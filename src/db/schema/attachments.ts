import { bigint, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { complaints } from './complaints'

// schema/complaint-attachments.ts
export const complaintAttachments = pgTable('complaint_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  complaintId: uuid('complaint_id')
    .notNull()
    .references(() => complaints.id, { onDelete: 'cascade' }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 100 }).notNull(), // image, video, document
  fileSize: bigint('file_size', { mode: 'number' }).notNull(), // in bytes
  cloudinaryPublicId: varchar('cloudinary_public_id', { length: 255 }).notNull(),
  cloudinaryUrl: varchar('cloudinary_url', { length: 500 }).notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
})
