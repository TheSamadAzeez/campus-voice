'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from '@/utils/actions/notifications'
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

export function AdminNotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()

    // Set up polling for new notifications every 30 seconds for admins
    const interval = setInterval(() => {
      fetchNotifications()
      fetchUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const result = await getUserNotifications(15) // Get last 15 notifications for admin
      if (result.success) {
        setNotifications(result.data as Notification[])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const result = await getUnreadNotificationCount()
      if (result.success && typeof result.count === 'number') {
        setUnreadCount(result.count)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const result = await markNotificationAsRead(notificationId)
      if (result.success) {
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true)
      const result = await markAllNotificationsAsRead()
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewComplaint = (complaintId: string | null) => {
    if (complaintId) {
      router.push(`/admin/complaints/${complaintId}`)
      setIsOpen(false) // Close the popover when navigating
    }
  }

  const handleViewAllNotifications = () => {
    router.push('/admin/notifications')
    setIsOpen(false)
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'status_change':
        return '🔄'
      case 'priority_change':
        return '⚡'
      case 'new_complaint':
        return '🚨'
      case 'feedback_request':
        return '💬'
      case 'system':
        return '🔧'
      default:
        return '📢'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const newComplaintCount = notifications.filter((n) => n.type === 'new_complaint' && !n.isRead).length
  const hasUrgentNotifications = newComplaintCount > 0

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={`h-5 w-5 ${hasUrgentNotifications ? 'text-red-500' : ''}`} />
          {unreadCount > 0 && (
            <Badge
              variant={hasUrgentNotifications ? 'destructive' : 'secondary'}
              className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs ${
                hasUrgentNotifications ? 'animate-pulse' : ''
              }`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Admin Notifications</CardTitle>
                <CardDescription>
                  {hasUrgentNotifications && (
                    <div className="flex items-center gap-1 font-medium text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {newComplaintCount} new complaint{newComplaintCount === 1 ? '' : 's'} need review
                    </div>
                  )}
                  {unreadCount > 0 && !hasUrgentNotifications
                    ? `${unreadCount} unread`
                    : hasUrgentNotifications
                      ? ''
                      : 'All caught up!'}
                </CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={loading} className="text-xs">
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {notifications.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center">No notifications yet</div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`hover:bg-muted/50 p-3 transition-colors ${
                        !notification.isRead
                          ? notification.type === 'new_complaint'
                            ? 'border-l-4 border-l-red-500 bg-red-50'
                            : 'bg-muted/25'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-lg">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="flex items-center gap-2 text-sm leading-none font-medium">
                              {notification.title}
                              {notification.type === 'new_complaint' && !notification.isRead && (
                                <Badge variant="destructive" className="px-1 py-0 text-xs">
                                  Urgent
                                </Badge>
                              )}
                            </p>
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground h-4 w-4"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-xs">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-xs">{formatTimeAgo(notification.createdAt)}</p>
                            {notification.complaintId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleViewComplaint(notification.complaintId)}
                              >
                                {notification.type === 'new_complaint' ? 'Review' : 'View'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {notifications.length > 0 && (
              <>
                <Separator />
                <div className="p-3">
                  <Button variant="ghost" size="sm" onClick={handleViewAllNotifications} className="w-full text-sm">
                    View All Notifications
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
