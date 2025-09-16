'use server'

import { complaintFeedback, db, complaints, users } from '@/db/schema'
import { authUser } from '../helper-functions'
import { eq, desc, sql } from 'drizzle-orm'
import { createAdminNotification } from './notifications'
import { revalidatePath } from 'next/cache'

export async function provideFeedback(feedbackText: string, rating: number, complaintId: string) {
  try {
    const user = await authUser()

    if (!user || user.role !== 'student') {
      return { success: false, error: 'You are not authorized for this action' }
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' }
    }

    // Check if complaint exists and is resolved
    const [complaint] = await db.select().from(complaints).where(eq(complaints.id, complaintId))

    if (!complaint) {
      return { success: false, error: 'Complaint not found' }
    }

    if (complaint.status !== 'resolved') {
      return { success: false, error: 'Feedback can only be provided for resolved complaints' }
    }

    if (complaint.userId !== user.userId) {
      return { success: false, error: 'You can only provide feedback on your own complaints' }
    }

    // Check if feedback already exists
    const [existingFeedback] = await db
      .select()
      .from(complaintFeedback)
      .where(eq(complaintFeedback.complaintId, complaintId))

    if (existingFeedback) {
      return { success: false, error: 'Feedback has already been provided for this complaint' }
    }

    // Insert feedback
    await db.insert(complaintFeedback).values({
      userId: user.userId,
      feedbackText,
      rating,
      complaintId,
    })

    // Notify admins about the feedback
    await createAdminNotification({
      complaintId: complaintId,
      title: 'New Feedback Received',
      message: `Feedback with ${rating}/5 stars has been submitted for complaint "${complaint.title}".`,
      type: 'feedback_request',
    })

    // Revalidate pages
    revalidatePath(`/student/complaints/${complaintId}`)
    revalidatePath('/admin/complaints')
    revalidatePath(`/admin/complaints/${complaintId}`)

    return { success: true, message: 'Feedback submitted successfully' }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return { success: false, error: 'Failed to submit feedback' }
  }
}

export async function getFeedbackByComplaintId(complaintId: string) {
  try {
    const user = await authUser()

    if (!user) {
      return { success: false, error: 'You are not authorized for this action' }
    }

    const [feedback] = await db.select().from(complaintFeedback).where(eq(complaintFeedback.complaintId, complaintId))
    if (!feedback) {
      return { success: false, error: 'Feedback not found' }
    }
    return { success: true, data: feedback }
  } catch (error) {
    console.error('Error getting feedback:', error)
    return { success: false, error: 'Failed to get feedback' }
  }
}

export async function checkFeedbackExists(complaintId: string) {
  try {
    const [feedback] = await db.select().from(complaintFeedback).where(eq(complaintFeedback.complaintId, complaintId))

    return { success: true, exists: !!feedback, data: feedback || null }
  } catch (error) {
    console.error('Error checking feedback exists:', error)
    return { success: false, error: 'Failed to check feedback' }
  }
}

export async function getAllFeedback() {
  try {
    const user = await authUser()

    if (!user || user.role !== 'admin') {
      return { success: false, error: 'You are not authorized for this action' }
    }

    const feedbacks = await db.select().from(complaintFeedback)
    return { success: true, data: feedbacks }
  } catch (error) {
    console.error('Error getting all feedback:', error)
    return { success: false, error: 'Failed to get feedback' }
  }
}

export async function getFeedbackStats() {
  try {
    const user = await authUser()

    if (!user || user.role !== 'admin') {
      return { success: false, error: 'You are not authorized for this action' }
    }

    // Get all feedback with complaint details
    const feedbackWithComplaints = await db
      .select({
        id: complaintFeedback.id,
        rating: complaintFeedback.rating,
        feedbackText: complaintFeedback.feedbackText,
        submittedAt: complaintFeedback.submittedAt,
        complaintTitle: complaints.title,
        complaintId: complaints.id,
        complaintCreatedAt: complaints.createdAt,
        studentName: users.firstName,
        studentLastName: users.lastName,
        faculty: complaints.faculty,
      })
      .from(complaintFeedback)
      .innerJoin(complaints, eq(complaintFeedback.complaintId, complaints.id))
      .innerJoin(users, eq(complaints.userId, users.id))
      .orderBy(desc(complaintFeedback.submittedAt))

    // Get total resolved complaints
    const [totalResolvedResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(complaints)
      .where(eq(complaints.status, 'resolved'))

    const totalFeedback = feedbackWithComplaints.length
    const totalResolved = totalResolvedResult.count
    const averageRating =
      totalFeedback > 0 ? feedbackWithComplaints.reduce((sum, f) => sum + f.rating, 0) / totalFeedback : 0

    // Rating distribution
    const ratingDistribution = {
      1: feedbackWithComplaints.filter((f) => f.rating === 1).length,
      2: feedbackWithComplaints.filter((f) => f.rating === 2).length,
      3: feedbackWithComplaints.filter((f) => f.rating === 3).length,
      4: feedbackWithComplaints.filter((f) => f.rating === 4).length,
      5: feedbackWithComplaints.filter((f) => f.rating === 5).length,
    }

    // Faculty feedback stats
    const facultyStats = feedbackWithComplaints.reduce(
      (acc, feedback) => {
        if (!acc[feedback.faculty]) {
          acc[feedback.faculty] = { count: 0, totalRating: 0 }
        }
        acc[feedback.faculty].count++
        acc[feedback.faculty].totalRating += feedback.rating
        return acc
      },
      {} as Record<string, { count: number; totalRating: number }>,
    )

    const facultyAverages = Object.entries(facultyStats).map(([faculty, stats]) => ({
      faculty,
      averageRating: stats.totalRating / stats.count,
      feedbackCount: stats.count,
    }))

    return {
      success: true,
      data: {
        stats: {
          totalFeedback,
          averageRating,
          resolvedWithFeedback: totalFeedback,
          totalResolved,
          responseRate: totalResolved > 0 ? Math.round((totalFeedback / totalResolved) * 100) : 0,
        },
        ratingDistribution,
        facultyStats: facultyAverages,
        recentFeedback: feedbackWithComplaints,
      },
    }
  } catch (error) {
    console.error('Error getting feedback stats:', error)
    return { success: false, error: 'Failed to get feedback statistics' }
  }
}
