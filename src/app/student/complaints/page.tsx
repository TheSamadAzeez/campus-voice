'use client'

import { TableComponent } from '@/components/custom/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Mock data - replace with actual data from your backend
const MOCK_COMPLAINTS = [
  {
    id: 1,
    title: 'Noise in Library',
    category: 'Facilities',
    status: 'Pending',
    date: '2024-03-20',
  },
  {
    id: 2,
    title: 'Course Registration Issue',
    category: 'Academic',
    status: 'In-review',
    date: '2024-03-19',
  },
  {
    id: 3,
    title: 'Course Registration Issue',
    category: 'Academic',
    status: 'Resolved',
    date: '2024-03-19',
  },
  {
    id: 4,
    title: 'Course Registration Issue',
    category: 'Academic',
    status: 'Resolved',
    date: '2024-03-19',
  },

  // Add more mock data as needed
]

export default function ComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredComplaints = MOCK_COMPLAINTS.filter((complaint) => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Complaints Management</h1>

        <Button asChild size={'lg'} className="bg-[#24c0b7] text-white hover:bg-[#24c0b7]/60">
          <Link href="/student/complaints/submit">
            <CirclePlus color="#fff" className="size-5" />
            <p className="text-sm font-medium">New Complaint</p>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {/* Search Filter */}
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              type="search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Facilities">Facilities</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Administrative">Administrative</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In-review">In Review</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <TableComponent data={filteredComplaints} />
    </div>
  )
}
