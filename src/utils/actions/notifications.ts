'use server'

import { db, notifications } from '@/db/schema'
import { authUser } from '../helper-functions'
import { eq, desc, and, count } from 'drizzle-orm'

export async function createNotification(data: {
  userId: string
  complaintId?: string
  title: string
  message: string
  type: 'status_change' | 'priority_change' | 'new_complaint' | 'feedback_request' | 'system'
}) {
  try {
    await db.insert(notifications).values({
      userId: data.userId,
      complaintId: data.complaintId,
      title: data.title,
      message: data.message,
      type: data.type,
    })

    return { success: true }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error: 'Failed to create notification' }
  }
}

export async function getUserNotifications(limit?: number) {
  try {
    const { userId } = await authUser()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const query = db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))

    const userNotifications = limit ? await query.limit(limit) : await query

    return { success: true, data: userNotifications }
  } catch (error) {
    console.error('Error fetching user notifications:', error)
    return { success: false, error: 'Failed to fetch notifications' }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { userId } = await authUser()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))

    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error: 'Failed to mark notification as read' }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const { userId } = await authUser()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))

    return { success: true }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return { success: false, error: 'Failed to mark all notifications as read' }
  }
}

export async function getUnreadNotificationCount() {
  try {
    const { userId } = await authUser()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))

    return { success: true, count: result.count }
  } catch (error) {
    console.error('Error fetching unread notification count:', error)
    return { success: false, error: 'Failed to fetch unread notification count' }
  }
}
