'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, CheckCheck, Eye, User, Calendar, MapPin } from 'lucide-react'
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/utils/actions/notifications'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  userId: string
  complaintId: string | null
  title: string
  message: string
  type: 'status_change' | 'priority_change' | 'new_complaint' | 'feedback_request' | 'system'
  isRead: boolean
  createdAt: Date
}

export function AdminNotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAllRead, setMarkingAllRead] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const result = await getUserNotifications() // Get all notifications for the current admin
      if (result.success) {
        setNotifications(result.data as Notification[])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const result = await markNotificationAsRead(notificationId)
      if (result.success) {
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllRead(true)
      const result = await markAllNotificationsAsRead()
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    } finally {
      setMarkingAllRead(false)
    }
  }

  const handleViewComplaint = (complaintId: string | null) => {
    if (complaintId) {
      router.push(`/admin/complaints/${complaintId}`)
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'status_change':
        return '🔄'
      case 'priority_change':
        return '⚡'
      case 'new_complaint':
        return '📝'
      case 'feedback_request':
        return '💬'
      case 'system':
        return '🔧'
      default:
        return '📢'
    }
  }

  const getBadgeVariant = (type: Notification['type']) => {
    switch (type) {
      case 'status_change':
        return 'default'
      case 'priority_change':
        return 'secondary'
      case 'new_complaint':
        return 'destructive' // More prominent for new complaints
      case 'feedback_request':
        return 'secondary'
      case 'system':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000)
    const diffInDays = Math.floor(diffInSeconds / 86400)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`

    return notificationDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPriorityColor = (type: Notification['type']) => {
    switch (type) {
      case 'new_complaint':
        return 'border-l-red-500 bg-red-50/50'
      case 'status_change':
        return 'border-l-blue-500 bg-blue-50/50'
      case 'priority_change':
        return 'border-l-orange-500 bg-orange-50/50'
      case 'system':
        return 'border-l-purple-500 bg-purple-50/50'
      default:
        return 'border-l-gray-500 bg-gray-50/50'
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const newComplaintCount = notifications.filter((n) => n.type === 'new_complaint' && !n.isRead).length

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 w-full rounded bg-gray-200"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unread</CardTitle>
            <Badge variant="secondary">{unreadCount}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-muted-foreground text-xs">notifications require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Complaints</CardTitle>
            <Badge variant="destructive">{newComplaintCount}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newComplaintCount}</div>
            <p className="text-muted-foreground text-xs">new complaints awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Badge variant="outline">{notifications.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-muted-foreground text-xs">all time notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={markingAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 text-4xl">🔔</div>
              <CardTitle className="mb-2">No notifications yet</CardTitle>
              <CardDescription>
                You will see notifications here when students submit new complaints or when system updates occur
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.isRead ? `border-l-4 ${getPriorityColor(notification.type)}` : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 items-start gap-3">
                    <div className="mt-1 flex-shrink-0 text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base">{notification.title}</CardTitle>
                        {!notification.isRead && (
                          <Badge variant="default" className="px-2 py-0 text-xs">
                            New
                          </Badge>
                        )}
                        <Badge variant={getBadgeVariant(notification.type)} className="px-2 py-0 text-xs">
                          {notification.type.replace('_', ' ')}
                        </Badge>
                        {notification.type === 'new_complaint' && !notification.isRead && (
                          <Badge variant="destructive" className="animate-pulse px-2 py-0 text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">{notification.message}</CardDescription>
                      <div className="text-muted-foreground flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(notification.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-2">
                    {notification.complaintId && (
                      <Button
                        variant={notification.type === 'new_complaint' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleViewComplaint(notification.complaintId)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {notification.type === 'new_complaint' ? 'Review' : 'View'}
                      </Button>
                    )}
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
