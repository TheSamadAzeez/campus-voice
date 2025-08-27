'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from '@/utils/actions/notifications'

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

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [])

  const fetchNotifications = async () => {
    try {
      const result = await getUserNotifications(10) // Get last 10 notifications
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-2xl">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={loading} className="text-xs">
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center">No notifications yet</div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`hover:bg-muted/50 p-3 transition-colors ${!notification.isRead ? 'bg-muted/25' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-lg">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="text-sm leading-none font-medium">{notification.title}</p>
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
                          <p className="text-muted-foreground text-xs">{notification.message}</p>
                          <p className="text-muted-foreground text-xs">{formatTimeAgo(notification.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
