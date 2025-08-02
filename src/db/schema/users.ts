import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { userRoleEnum } from './enums'

// schema/users.ts
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(), // External auth provider ID
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  profileImage: varchar('profile_image', { length: 500 }),
  role: userRoleEnum('role').default('student').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
