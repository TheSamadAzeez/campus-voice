'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays, Mail, Users, Search, Filter } from 'lucide-react'
import { RoleUpdateSelect } from './role-update-select'
import { DeleteUserButton } from './delete-user-button'

type SerializedUser = {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: Array<{ emailAddress: string }>
  imageUrl: string
  publicMetadata: Record<string, any>
  createdAt: number
  updatedAt: number
}

interface UsersTableProps {
  users: SerializedUser[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter((user: SerializedUser) => {
      const firstName = user.firstName || 'Unknown'
      const lastName = user.lastName || 'User'
      const fullName = `${firstName} ${lastName}`.toLowerCase()
      const email = user.emailAddresses[0]?.emailAddress?.toLowerCase() || ''
      const role = (user.publicMetadata?.role as string) || 'student'

      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        fullName.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())

      // Role filter
      const matchesRole = roleFilter === 'all' || role === roleFilter

      return matchesSearch && matchesRole
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date

      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase()
          bValue = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase()
          break
        case 'email':
          aValue = a.emailAddresses[0]?.emailAddress?.toLowerCase() || ''
          bValue = b.emailAddresses[0]?.emailAddress?.toLowerCase() || ''
          break
        case 'role':
          aValue = (a.publicMetadata?.role as string) || 'student'
          bValue = (b.publicMetadata?.role as string) || 'student'
          break
        case 'created':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'updated':
          aValue = new Date(a.updatedAt)
          bValue = new Date(b.updatedAt)
          break
        default:
          aValue = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase()
          bValue = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [users, searchQuery, roleFilter, sortBy, sortOrder])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>
          Manage all Campus Voice users including students and department admins. Update user roles or remove accounts
          as needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filter Controls */}
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search by name, email, or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="department-admin">Dept. Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="updated">Date Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="text-muted-foreground mb-4 text-sm">
          Showing {filteredAndSortedUsers.length} of {users.length} users
        </div>

        <ScrollArea className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hover:bg-muted/50 cursor-pointer select-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>User</span>
                    <span className="text-xs">{getSortIcon('name')}</span>
                  </div>
                </TableHead>
                <TableHead className="hover:bg-muted/50 cursor-pointer select-none" onClick={() => handleSort('email')}>
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    <span className="text-xs">{getSortIcon('email')}</span>
                  </div>
                </TableHead>
                <TableHead className="hover:bg-muted/50 cursor-pointer select-none" onClick={() => handleSort('role')}>
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    <span className="text-xs">{getSortIcon('role')}</span>
                  </div>
                </TableHead>
                <TableHead
                  className="hover:bg-muted/50 cursor-pointer select-none"
                  onClick={() => handleSort('created')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Joined</span>
                    <span className="text-xs">{getSortIcon('created')}</span>
                  </div>
                </TableHead>
                <TableHead
                  className="hover:bg-muted/50 cursor-pointer select-none"
                  onClick={() => handleSort('updated')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Updated</span>
                    <span className="text-xs">{getSortIcon('updated')}</span>
                  </div>
                </TableHead>
                <TableHead className="flex justify-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedUsers.map((user: SerializedUser) => {
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
          {filteredAndSortedUsers.length === 0 && (
            <div className="py-8 text-center">
              <Users className="text-muted-foreground mx-auto h-12 w-12" />
              <p className="text-muted-foreground mt-2">
                {searchQuery || roleFilter !== 'all' ? 'No users match your filters' : 'No users found'}
              </p>
              {(searchQuery || roleFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setRoleFilter('all')
                  }}
                  className="text-primary mt-2 text-sm hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
