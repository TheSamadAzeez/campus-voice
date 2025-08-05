import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getPriorityColor, getStatusColor } from '@/utils/status'
import { Eye } from 'lucide-react'
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
  createdAt: Date | string
}

export function TableComponent({
  data,
  dashboard = false,
  admin = false,
}: {
  data: COMPLAINT[]
  dashboard?: boolean
  admin?: boolean
}) {
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
                {data.length > 0 && data[0].faculty ? <TableHead>Faculty</TableHead> : null}
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead className="flex justify-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="capitalize">{complaint.title}</TableCell>
                  <TableCell className="capitalize">{complaint.category}</TableCell>
                  {data[0]?.faculty ? <TableCell className="capitalize">{complaint.faculty}</TableCell> : null}
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
