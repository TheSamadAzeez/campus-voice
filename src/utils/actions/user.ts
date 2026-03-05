'use server'

import { authUser } from '../helper-functions'

/** USER */

export async function getUser() {
  try {
    const { userId } = await authUser()
    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)

    const user = {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      profileImage: clerkUser.imageUrl,
      role: (clerkUser.publicMetadata?.role as string) || 'student',
      faculty: (clerkUser.publicMetadata?.faculty as string) || null,
      department: (clerkUser.publicMetadata?.department as string) || null,
      createdAt: new Date(clerkUser.createdAt),
      updatedAt: new Date(clerkUser.updatedAt),
    }

    return { success: true, user }
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

export async function updateUserRole(
  userId: string,
  newRole: 'admin' | 'student' | 'department-admin',
  departmentInfo?: { faculty: string; department: string } | null,
) {
  try {
    // Verify admin access
    const { role } = await authUser()
    if (role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // Validate department info for department-admin role
    if (newRole === 'department-admin') {
      if (!departmentInfo || !departmentInfo.faculty || !departmentInfo.department) {
        return { success: false, error: 'Department and faculty are required for department-admin role' }
      }

      // Check if department is already assigned to another user
      const { clerkClient } = await import('@clerk/nextjs/server')
      const client = await clerkClient()
      const allUsers = await client.users.getUserList()

      const existingDepartmentAdmin = allUsers.data.find(
        (u) =>
          u.publicMetadata?.role === 'department-admin' &&
          u.publicMetadata?.faculty === departmentInfo.faculty &&
          u.publicMetadata?.department === departmentInfo.department &&
          u.id !== userId,
      )

      if (existingDepartmentAdmin) {
        const adminName = `${existingDepartmentAdmin.firstName || 'Unknown'} ${existingDepartmentAdmin.lastName || 'User'}`
        return {
          success: false,
          error: `This department is already assigned to ${adminName}. Please choose a different department or remove the existing assignment first.`,
        }
      }
    }

    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()

    // Update user role in Clerk's public metadata
    const metadata: { role: string; department?: string; faculty?: string } = {
      role: newRole,
    }

    if (newRole === 'department-admin' && departmentInfo) {
      metadata.department = departmentInfo.department
      metadata.faculty = departmentInfo.faculty
    }

    await client.users.updateUserMetadata(userId, {
      publicMetadata: metadata,
    })

    // Revalidate the users page to reflect changes
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/admin/users')

    return { success: true, message: `User role updated to ${newRole} successfully` }
  } catch (error) {
    console.error('Error updating user role:', error)
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

    // Revalidate the users page to reflect changes
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/admin/users')

    return { success: true, message: 'User deleted successfully from Clerk' }
  } catch (error) {
    console.error('Error deleting user from Clerk', error)
    return { success: false, error: 'Failed to delete user' }
  }
}
