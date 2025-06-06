import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/utils/status'
import { Eye } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'

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
              {data.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="capitalize">{activity.title}</TableCell>
                  <TableCell className="capitalize">{activity.category}</TableCell>
                  <TableCell>
                    <Badge variant={'outline'} className={getStatusColor(activity.status.toLowerCase())}>
                      {activity.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell className="flex justify-center">
                    <Eye className="size-4" color="#f66426" strokeWidth={2} />
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
