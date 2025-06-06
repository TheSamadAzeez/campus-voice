import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/utils/status'
import { Eye } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import Link from 'next/link'

interface Activity {
  id: number
  title: string
  category: string
  status: string
  date: string
}

export function TableComponent({ data, dashboard = false }: { data: Activity[]; dashboard?: boolean }) {
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
                <TableHead>Status</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead className="flex justify-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="capitalize">{complaint.title}</TableCell>
                  <TableCell className="capitalize">{complaint.category}</TableCell>
                  <TableCell>
                    <Badge variant={'outline'} className={getStatusColor(complaint.status.toLowerCase())}>
                      {complaint.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{complaint.date}</TableCell>
                  <TableCell className="flex justify-center">
                    <Link href={`/student/complaints/${complaint.id}`}>
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
