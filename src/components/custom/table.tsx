import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getPriorityColor, getStatusColor } from '@/utils/status'
import { Eye, MessageSquare } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import Link from 'next/link'
import { complaintCategoryEnum, complaintStatusEnum, facultyEnum, priorityEnum, resolutionTypeEnum } from '@/db/schema'

interface COMPLAINT {
  id: string
  userId: string
  title: string
  description: string
  faculty: (typeof facultyEnum.enumValues)[number]
  category: (typeof complaintCategoryEnum.enumValues)[number]
  resolutionType: (typeof resolutionTypeEnum.enumValues)[number]
  status: (typeof complaintStatusEnum.enumValues)[number]
  priority: (typeof priorityEnum.enumValues)[number]
  sensitive: boolean
  createdAt: Date | string
  hasFeedback?: boolean
}

export function TableComponent({
  data,
  dashboard = false,
  admin = false,
  userRole,
}: {
  data: COMPLAINT[]
  dashboard?: boolean
  admin?: boolean
  userRole?: 'admin' | 'student' | 'department-admin'
}) {
  // Don't display faculty column if user is department admin
  const showFacultyColumn = userRole !== 'department-admin' && data.length > 0 && data[0].faculty
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dashboard ? 'Recent Activities' : 'All Complaints'}</CardTitle>
        <CardDescription>
          {dashboard ? 'Your recent complaint activities and updates' : 'View all complaints'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={!dashboard ? 'h-[500px]' : 'h-40'}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                {showFacultyColumn ? <TableHead>Faculty</TableHead> : null}
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                {userRole === 'admin' && <TableHead>Sensitive</TableHead>}
                {admin && <TableHead>Feedback</TableHead>}
                <TableHead>Date Submitted</TableHead>
                <TableHead className="flex justify-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="truncate capitalize">
                    {complaint.title.length > 50 ? complaint.title.slice(0, 50) + '...' : complaint.title}
                  </TableCell>
                  <TableCell className="capitalize">{complaint.category}</TableCell>
                  {showFacultyColumn ? <TableCell className="capitalize">{complaint.faculty}</TableCell> : null}
                  <TableCell>
                    <Badge variant={'outline'} className={getStatusColor(complaint.status.toLowerCase())}>
                      {complaint.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={'outline'} className={getPriorityColor(complaint.priority.toLowerCase())}>
                      {complaint.priority.toLowerCase()}
                    </Badge>
                  </TableCell>
                  {userRole === 'admin' && (
                    <TableCell>
                      {complaint.sensitive ? (
                        <Badge variant="destructive" className="text-xs">
                          Sensitive
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-gray-400">
                          Regular
                        </Badge>
                      )}
                    </TableCell>
                  )}
                  {admin && (
                    <TableCell>
                      {complaint.hasFeedback ? (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="size-4 text-blue-600" />
                          <Badge variant="secondary" className="text-xs">
                            Has Feedback
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No feedback</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    {typeof complaint.createdAt === 'string'
                      ? complaint.createdAt
                      : complaint.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <Link href={admin ? `/admin/complaints/${complaint.id}` : `/student/complaints/${complaint.id}`}>
                      <Eye className="size-4" color="#f66426" strokeWidth={2} />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
