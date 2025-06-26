import { db } from '@/db'
import { usersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function createUser(user: typeof usersTable.$inferInsert) {
  await db.insert(usersTable).values({ ...user })
}

export async function updateUser(user: typeof usersTable.$inferSelect) {
  await db
    .update(usersTable)
    .set({ ...user })
    .where(eq(usersTable.clerkUserId, user.clerkUserId))
}

export async function deleteUser(clerkUserId: string) {
  await db.delete(usersTable).where(eq(usersTable.clerkUserId, clerkUserId))
}
