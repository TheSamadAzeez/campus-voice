'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useMemo } from 'react'
import { complaintCategoryEnum, complaintStatusEnum, facultyEnum, priorityEnum, resolutionTypeEnum } from '@/db/schema'
import { TableComponent } from '@/components/custom/table'

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

interface ComplaintsFiltersProps {
  complaints: COMPLAINT[]
}

export default function ComplaintsFilters({ complaints }: ComplaintsFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [feedbackFilter, setFeedbackFilter] = useState('all')

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
      const matchesFeedback =
        feedbackFilter === 'all' ||
        (feedbackFilter === 'with-feedback' && complaint.hasFeedback) ||
        (feedbackFilter === 'no-feedback' && !complaint.hasFeedback)
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesFeedback
    })
  }, [complaints, searchQuery, categoryFilter, statusFilter, priorityFilter, feedbackFilter])

  return (
    <>
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
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="facility">Facility</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="result">Result</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            {/* Feedback Filter */}
            <Select value={feedbackFilter} onValueChange={setFeedbackFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Complaints</SelectItem>
                <SelectItem value="with-feedback">With Feedback</SelectItem>
                <SelectItem value="no-feedback">No Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <TableComponent data={filteredComplaints} admin userRole="department-admin" />
    </>
  )
}
