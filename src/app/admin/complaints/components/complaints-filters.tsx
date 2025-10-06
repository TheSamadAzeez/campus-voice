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
  const [sensitiveFilter, setSensitiveFilter] = useState('all')
  const [orderBy, setOrderBy] = useState('sensitive-first')

  const filteredComplaints = useMemo(() => {
    const filtered = complaints.filter((complaint) => {
      const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
      const matchesFeedback =
        feedbackFilter === 'all' ||
        (feedbackFilter === 'with-feedback' && complaint.hasFeedback) ||
        (feedbackFilter === 'no-feedback' && !complaint.hasFeedback)
      const matchesSensitive =
        sensitiveFilter === 'all' ||
        (sensitiveFilter === 'sensitive' && complaint.sensitive) ||
        (sensitiveFilter === 'regular' && !complaint.sensitive)
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesFeedback && matchesSensitive
    })

    // Apply ordering
    return [...filtered].sort((a, b) => {
      switch (orderBy) {
        case 'sensitive-first':
          if (a.sensitive !== b.sensitive) {
            return b.sensitive ? 1 : -1 // Sensitive first
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // Then by date
        case 'title':
          return a.title.localeCompare(b.title)
        case 'faculty':
          return a.faculty.localeCompare(b.faculty)
        case 'priority':
          const priorityOrder = { high: 3, normal: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'status':
          const statusOrder = { pending: 3, 'in-review': 2, resolved: 1 }
          return statusOrder[b.status] - statusOrder[a.status]
        case 'date-newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'date-oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        default:
          return 0
      }
    })
  }, [complaints, searchQuery, categoryFilter, statusFilter, priorityFilter, feedbackFilter, sensitiveFilter, orderBy])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Single Row - All Filters */}
          <div className="flex items-center gap-3">
            {/* Search Filter */}
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              type="search"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-0 flex-1"
            />

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
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
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
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
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            {/* Sensitive Filter */}
            <Select value={sensitiveFilter} onValueChange={setSensitiveFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sensitivity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Complaints</SelectItem>
                <SelectItem value="sensitive">Sensitive Only</SelectItem>
                <SelectItem value="regular">Regular Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Feedback Filter */}
            <Select value={feedbackFilter} onValueChange={setFeedbackFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Complaints</SelectItem>
                <SelectItem value="with-feedback">With Feedback</SelectItem>
                <SelectItem value="no-feedback">No Feedback</SelectItem>
              </SelectContent>
            </Select>

            {/* Order By Filter */}
            <Select value={orderBy} onValueChange={setOrderBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Order by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sensitive-first">Sensitive First</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="faculty">Faculty (A-Z)</SelectItem>
                <SelectItem value="priority">Priority (High to Low)</SelectItem>
                <SelectItem value="status">Status (Urgent First)</SelectItem>
                <SelectItem value="date-newest">Date (Newest First)</SelectItem>
                <SelectItem value="date-oldest">Date (Oldest First)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <TableComponent data={filteredComplaints} admin userRole="admin" />
    </>
  )
}
