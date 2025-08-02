import { complaints, db, NewComplaint, NewUser } from '@/db/schema/index'
import { users } from '@/db/schema/index'
import { authUser } from './helper-functions'
import { eq } from 'drizzle-orm'

/** USER */

export async function createUser(user: NewUser) {
  try {
    await db.insert(users).values({ ...user })
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateUser(user: NewUser) {
  try {
    await db
      .update(users)
      .set({ ...user })
      .where(eq(users.id, user.id))
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId))
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getUser() {
  try {
    const userId = await authUser()
    const user = await db.select().from(users).where(eq(users.id, userId))
    return user[0]
  } catch (error) {
    console.error(error)
    return null
  }
}

/** COMPLAINTS */

export async function submitComplaint(complaint: NewComplaint) {
  try {
    const userId = await authUser()
    await db.insert(complaints).values({ ...complaint, userId: userId })
    return 'Complaint submitted successfully'
  } catch (error) {
    console.error(error)
    return 'Error submitting complaint'
  }
}

export async function getUserComplaints() {
  try {
    const userId = await authUser()
    const userComplaints = await db.select().from(complaints).where(eq(complaints.userId, userId))
    return userComplaints
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getAllComplaints() {
  try {
    const user = await getUser()
    if (user?.role !== 'admin') {
      return 'You are not authorized to access this page'
    }
    const userComplaints = await db.select().from(complaints)
    return userComplaints
  } catch (error) {
    console.error(error)
    return 'Error fetching complaints'
  }
}
