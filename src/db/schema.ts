import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  imageUrl: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 255, enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
  clerkUserId: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
})

export const complaintTable = pgTable('complaints', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => usersTable.id),
  category: varchar({
    length: 255,
    enum: ['academic', 'facility', 'administration', 'harassment', 'infrastructure', 'result', 'other'],
  }).notNull(),
  faculty: varchar({
    length: 255,
    enum: ['science', 'transport', 'law', 'art', 'education', 'management science', 'other'],
  }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  attachmentUrl: varchar({ length: 255 }).notNull(),
  resolutionType: varchar({
    length: 255,
    enum: ['immediate', 'investigation', 'policy change', 'other'],
  }).notNull(),
  status: varchar({ length: 255, enum: ['pending', 'in-review', 'resolved'] })
    .notNull()
    .default('pending'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
})
