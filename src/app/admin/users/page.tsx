import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllUsersFromClerk } from '@/utils/actions/user'
import { authUser } from '@/utils/helper-functions'
import { redirect } from 'next/navigation'
import { User, Users } from 'lucide-react'
import type { User as ClerkUser } from '@clerk/nextjs/server'
import { UsersTable } from './components/users-table'

export default async function UsersPage() {
  // Verify admin access
  const { role } = await authUser()
  if (role !== 'admin') {
    redirect('/student')
  }

  // Fetch all users from Clerk
  const result = await getAllUsersFromClerk()

  // Handle API failures or empty results
  const users: ClerkUser[] = (result.users as ClerkUser[]) || []

  if (!result.success) {
    console.warn('Failed to fetch users from Clerk:', result.error)
  }

  // Serialize users to plain objects for client component
  const serializedUsers = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddresses: user.emailAddresses.map((email) => ({
      emailAddress: email.emailAddress,
    })),
    imageUrl: user.imageUrl,
    publicMetadata: user.publicMetadata,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }))

  // Get user statistics
  const totalUsers = serializedUsers.length
  const adminUsers = serializedUsers.filter((user) => user.publicMetadata?.role === 'admin').length
  const departmentAdminUsers = serializedUsers.filter((user) => user.publicMetadata?.role === 'department-admin').length
  const studentUsers = serializedUsers.filter(
    (user) => user.publicMetadata?.role === 'student' || !user.publicMetadata?.role,
  ).length

  return (
    <div className="container mx-auto flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Users className="h-6 w-6" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-muted-foreground text-xs">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentUsers}</div>
            <p className="text-muted-foreground text-xs">Student accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-muted-foreground text-xs">Admin accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dept. Admins</CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentAdminUsers}</div>
            <p className="text-muted-foreground text-xs">Department admin accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <UsersTable users={serializedUsers} />
    </div>
  )
}
