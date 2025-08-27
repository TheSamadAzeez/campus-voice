'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Check, CheckCheck, Eye } from 'lucide-react'
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

export function NotificationsView() {
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
      const result = await getUserNotifications() // Get all notifications
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
      router.push(`/student/complaints/${complaintId}`)
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
        return '🔔'
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
        return 'outline'
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
    })
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

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
      <ScrollArea className="h-[700px]">
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 text-4xl">🔔</div>
                <CardTitle className="mb-2">No notifications yet</CardTitle>
                <CardDescription>
                  You&apos;ll see notifications here when there are updates to your complaints
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 items-start gap-3">
                      <div className="mt-1 flex-shrink-0 text-2xl">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          {!notification.isRead && (
                            <Badge variant="default" className="px-2 py-0 text-xs">
                              New
                            </Badge>
                          )}
                          <Badge variant={getBadgeVariant(notification.type)} className="px-2 py-0 text-xs">
                            {notification.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">{notification.message}</CardDescription>
                        <p className="text-muted-foreground text-xs">{formatDate(notification.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                      {notification.complaintId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewComplaint(notification.complaintId)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
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
      </ScrollArea>
    </div>
  )
}
