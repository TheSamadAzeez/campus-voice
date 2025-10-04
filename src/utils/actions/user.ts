'use server'

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

export async function getAllUsersFromClerk() {
  try {
    // Add timeout to prevent infinite hanging
    const timeoutPromise = new Promise(
      (_, reject) => setTimeout(() => reject(new Error('Clerk API timeout')), 10000), // 10 second timeout
    )

    const clerkPromise = (async () => {
      const { clerkClient } = await import('@clerk/nextjs/server')
      const client = await clerkClient()

      // Get all users from Clerk with a smaller limit to avoid timeouts
      const clerkUsers = await client.users.getUserList({
        limit: 50, // Reduced limit to prevent timeouts
        orderBy: 'created_at',
      })

      return clerkUsers.data
    })()

    const clerkUsers = await Promise.race([clerkPromise, timeoutPromise])

    return { success: true, users: clerkUsers }
  } catch (error) {
    console.error('Error getting users from Clerk', error)

    // Return empty array on error to prevent infinite loops
    return {
      success: false,
      error: 'Unable to fetch users from Clerk',
      users: [], // Provide fallback empty array
    }
  }
}

export async function updateUserRole(userId: string, newRole: 'admin' | 'student' | 'department-admin') {
  try {
    // Verify admin access
    const { role } = await authUser()
    if (role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()

    // Update user role in Clerk's public metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: newRole,
      },
    })

    // Revalidate the users page to reflect changes
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/admin/users')

    return { success: true, message: `User role updated to ${newRole} successfully` }
  } catch (error) {
    console.error('Error updating user role in Clerk', error)
    return { success: false, error: 'Failed to update user role' }
  }
}

export async function deleteUserFromClerk(userId: string) {
  try {
    // Verify admin access
    const { role } = await authUser()
    if (role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()

    // Get user details to check their role
    const userToDelete = await client.users.getUser(userId)
    const userRole = userToDelete.publicMetadata?.role as string

    // Prevent deletion of admin users
    if (userRole === 'admin') {
      return { success: false, error: 'Cannot delete admin users' }
    }

    // Delete user from Clerk
    await client.users.deleteUser(userId)

    // Also delete from local database if exists
    try {
      await db.delete(users).where(eq(users.id, userId))
    } catch (dbError) {
      // Local DB deletion is optional, don't fail if user doesn't exist locally
      console.warn('User not found in local database:', dbError)
    }

    // Revalidate the users page to reflect changes
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/admin/users')

    return { success: true, message: 'User deleted successfully from Clerk and local database' }
  } catch (error) {
    console.error('Error deleting user from Clerk', error)
    return { success: false, error: 'Failed to delete user' }
  }
}
