import { db, NewUser, users } from '@/db/schema/index'
import { authUser } from '../helper-functions'
import { eq } from 'drizzle-orm'

/** USER */

export async function createUser(user: NewUser) {
  try {
    await db.insert(users).values({ ...user })
    return { success: true, error: 'User created successfully' }
  } catch (error) {
    console.error('Error creating user', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function updateUser(user: NewUser) {
  try {
    await db
      .update(users)
      .set({ ...user })
      .where(eq(users.id, user.id))
    return { success: true, error: 'User updated successfully' }
  } catch (error) {
    console.error('Error updating user', error)
    return { success: false, error: 'Failed to update user' }
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId))
    return { success: true, error: 'User deleted successfully' }
  } catch (error) {
    console.error('Error deleting user', error)
    return { success: false, error: 'Failed to delete user' }
  }
}

export async function getUser() {
  try {
    const { userId } = await authUser()
    const user = await db.select().from(users).where(eq(users.id, userId))
    return { success: true, user: user[0] }
  } catch (error) {
    console.error('Error getting user', error)
    return { success: false, error: 'Unable to find user' }
  }
}
