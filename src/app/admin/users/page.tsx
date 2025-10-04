import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAllUsersFromClerk } from '@/utils/actions/user'
import { authUser } from '@/utils/helper-functions'
import { redirect } from 'next/navigation'
import { CalendarDays, Mail, User, Users } from 'lucide-react'
import type { User as ClerkUser } from '@clerk/nextjs/server'
import { RoleUpdateSelect } from '@/app/admin/users/components/role-update-select'
import { DeleteUserButton } from '@/app/admin/users/components/delete-user-button'

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

  // Get user statistics
  const totalUsers = users.length
  const adminUsers = users.filter((user: ClerkUser) => user.publicMetadata?.role === 'admin').length
  const departmentAdminUsers = users.filter(
    (user: ClerkUser) => user.publicMetadata?.role === 'department-admin',
  ).length
  const studentUsers = users.filter(
    (user: ClerkUser) => user.publicMetadata?.role === 'student' || !user.publicMetadata?.role,
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
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage all Campus Voice users including students and department admins. Update user roles or remove accounts
            as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="flex justify-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: ClerkUser) => {
                  const firstName = user.firstName || 'Unknown'
                  const lastName = user.lastName || 'User'
                  const email = user.emailAddresses[0]?.emailAddress || 'No email'
                  const role = (user.publicMetadata?.role as string) || 'student'
                  const profileImage = user.imageUrl || ''

                  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profileImage} alt={`${firstName} ${lastName}`} />
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {firstName} {lastName}
                            </div>
                            <div className="text-muted-foreground text-sm">ID: {user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm">{email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs ${
                            role === 'admin'
                              ? 'bg-[#efdaff] text-[#b961ff]'
                              : role === 'department-admin'
                                ? 'bg-[#ffe1cc] text-[#ff6900]'
                                : 'bg-[#d4e5ff] text-[#3e8aff]'
                          }`}
                        >
                          {role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <CalendarDays className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <CalendarDays className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm">
                            {new Date(user.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex w-full items-center justify-center space-x-2">
                          <RoleUpdateSelect userId={user.id} currentRole={role} userName={`${firstName} ${lastName}`} />
                          <DeleteUserButton
                            userId={user.id}
                            userName={`${firstName} ${lastName}`}
                            userEmail={email}
                            userRole={role}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {users.length === 0 && (
              <div className="py-8 text-center">
                <Users className="text-muted-foreground mx-auto h-12 w-12" />
                <p className="text-muted-foreground mt-2">No users found</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
