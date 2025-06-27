import { db } from '@/db'
import { usersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function createUser(user: typeof usersTable.$inferInsert) {
  try {
    await db.insert(usersTable).values({ ...user })
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateUser(user: typeof usersTable.$inferSelect) {
  try {
    await db
      .update(usersTable)
      .set({ ...user })
      .where(eq(usersTable.clerkUserId, user.clerkUserId))
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteUser(clerkUserId: string) {
  await db.delete(usersTable).where(eq(usersTable.clerkUserId, clerkUserId))
}

export async function getUserByClerkUserId(clerkUserId: string) {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, clerkUserId))
    return user[0]
  } catch (error) {
    console.error(error)
    return null
  }
}
