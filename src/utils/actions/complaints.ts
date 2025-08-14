'use server'

import { complaintAttachments, complaints, complaintStatusHistory, db, NewComplaint, users } from '@/db/schema'
import { authUser, deleteFromCloudinary } from '../helper-functions'
import { and, count, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createComplaintWithAttachment(complaintData: FormData) {
  const fileCount = Number(complaintData.get('fileCount')) || 0
  const cloudinaryPublicIds: string[] = []

  try {
    const title = complaintData.get('title') as string
    const description = complaintData.get('description') as string
    const category = complaintData.get('category') as string
    const faculty = complaintData.get('faculty') as string
    const resolutionType = complaintData.get('resolutionType') as string
    const { userId } = await authUser() // Get userId from session

    // Collect all file data
    const fileDataArray: Array<{
      cloudinaryUrl: string
      cloudinaryPublicId: string
      fileSize: number | null
      fileType: string
      fileName: string
    }> = []
    for (let i = 0; i < fileCount; i++) {
      const cloudinaryUrl = complaintData.get(`cloudinaryUrl_${i}`) as string
      const cloudinaryPublicId = complaintData.get(`cloudinaryPublicId_${i}`) as string
      const fileSize = complaintData.get(`fileSize_${i}`) ? Number(complaintData.get(`fileSize_${i}`)) : null
      const fileType = complaintData.get(`fileType_${i}`) as string
      const fileName = complaintData.get(`fileName_${i}`) as string

      if (cloudinaryUrl && cloudinaryUrl !== '') {
        fileDataArray.push({
          cloudinaryUrl,
          cloudinaryPublicId,
          fileSize,
          fileType,
          fileName,
        })
        cloudinaryPublicIds.push(cloudinaryPublicId)
      }
    }

    const result = await db.transaction(async (tx) => {
      const newComplaintData: NewComplaint = {
        userId,
        title,
        description,
        category: category as any,
        faculty: faculty as any,
        resolutionType: resolutionType as any,
      }

      const [complaint] = await tx.insert(complaints).values(newComplaintData).returning()

      // Insert initial status history entry
      await tx.insert(complaintStatusHistory).values({
        complaintId: complaint.id,
        changedBy: userId,
        fieldChanged: 'created',
        oldValue: null, // No previous value for new complaints
        newValue: 'pending', // Default status for new complaints
        notes: 'Complaint created',
      })

      // Insert attachments for all uploaded files
      for (const fileData of fileDataArray) {
        // Use fallback values for missing fields
        const safeFileName =
          fileData.fileName && fileData.fileName.trim() !== '' ? fileData.fileName.trim() : 'unknown_file'
        const safeFileType = fileData.fileType && fileData.fileType.trim() !== '' ? fileData.fileType.trim() : 'unknown'
        const safePublicId =
          fileData.cloudinaryPublicId && fileData.cloudinaryPublicId.trim() !== ''
            ? fileData.cloudinaryPublicId.trim()
            : 'unknown_id'

        const attachmentData = {
          complaintId: complaint.id,
          fileName: safeFileName,
          fileType: safeFileType,
          fileSize: fileData.fileSize || 0,
          cloudinaryPublicId: safePublicId,
          cloudinaryUrl: fileData.cloudinaryUrl.trim(),
        }

        await tx.insert(complaintAttachments).values(attachmentData)
      }

      return complaint
    })

    return { success: true, complaint: result }
  } catch (error) {
    // Clean up uploaded files on error
    for (const cloudinaryPublicId of cloudinaryPublicIds) {
      if (cloudinaryPublicId) {
        await deleteFromCloudinary(cloudinaryPublicId)
      }
    }

    console.error('[Complaint Error]', error)
    return { success: false, error: 'Something went wrong submitting the complaint.' }
  }
}

export async function getUserComplaints(limit?: number) {
  try {
    const { userId } = await authUser()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }
    if (limit) {
      const userComplaints = await db
        .select()
        .from(complaints)
        .where(eq(complaints.userId, userId))
        .orderBy(desc(complaints.createdAt))
        .limit(limit)
      return { success: true, data: userComplaints }
    } else {
      const userComplaints = await db
        .select()
        .from(complaints)
        .where(eq(complaints.userId, userId))
        .orderBy(desc(complaints.createdAt))
      return { success: true, data: userComplaints }
    }
  } catch (error) {
    console.error('Error fetching user complaints:', error)
    return { success: false, error: 'Failed to fetch user complaints' }
  }
}

export async function getComplaintStats() {
  try {
    const { userId } = await authUser()

    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    // 📦 Ask database to group complaints by their status and count each group
    const result = await db
      .select({
        status: complaints.status, // 👈 select the status column
        count: count(complaints.id).as('count'), // 👈 count how many in each group
      })
      .from(complaints)
      .where(eq(complaints.userId, userId)) // 👈 only complaints by the logged-in user
      .groupBy(complaints.status) // 👈 group by status (pending, resolved, etc.)

    // 🎯 Initialize counts
    const stats = {
      total: 0,
      resolved: 0,
      inReview: 0,
      pending: 0,
    }

    // 🔁 Loop through results and update stats
    for (const row of result) {
      stats.total += Number(row.count) // add to total

      if (row.status === 'resolved') {
        stats.resolved = Number(row.count)
      } else if (row.status === 'in-review') {
        stats.inReview = Number(row.count)
      } else if (row.status === 'pending') {
        stats.pending = Number(row.count)
      }
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error('Error fetching complaint stats:', error)
    return { success: false, error: 'Failed to fetch complaint stats' }
  }
}

export async function withdrawComplaint(complaintId: string) {
  try {
    const { userId } = await authUser()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    // First, fetch all attachments for this complaint to get Cloudinary public IDs
    const attachments = await db
      .select({
        cloudinaryPublicId: complaintAttachments.cloudinaryPublicId,
      })
      .from(complaintAttachments)
      .where(eq(complaintAttachments.complaintId, complaintId))

    // Delete files from Cloudinary
    for (const attachment of attachments) {
      if (attachment.cloudinaryPublicId) {
        await deleteFromCloudinary(attachment.cloudinaryPublicId)
      }
    }

    // Delete the complaint (attachments will be cascade deleted due to foreign key constraint)
    await db.delete(complaints).where(and(eq(complaints.id, complaintId), eq(complaints.userId, userId)))

    revalidatePath('/student/complaints')

    return { success: true, message: 'Complaint withdrawn successfully' }
  } catch (error) {
    console.error('Error withdrawing complaint:', error)
    return { success: false, error: 'Failed to withdraw complaint' }
  }
}

export async function getComplaintChartData() {
  try {
    const { userId } = await authUser()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }
    // Fetch complaint counts grouped by month and status
    const result = await db
      .select({
        month: complaints.createdAt,
        status: complaints.status,
        count: count(complaints.id).as('count'),
      })
      .from(complaints)
      .where(eq(complaints.userId, userId))
      .groupBy(complaints.createdAt, complaints.status)
      .orderBy(complaints.createdAt)
    // 🎯 Initialize chart data structure
    const chartData: { month: string; pending: number; in_review: number; resolved: number }[] = []
    // 🔁 Loop through results and build chart data
    for (const row of result) {
      const month = new Date(row.month).toLocaleString('default', { month: 'long' })
      const existingMonthData = chartData.find((data) => data.month === month)
      if (existingMonthData) {
        // Update existing month data
        if (row.status === 'pending') {
          existingMonthData.pending += Number(row.count)
        } else if (row.status === 'in-review') {
          existingMonthData.in_review += Number(row.count)
        } else if (row.status === 'resolved') {
          existingMonthData.resolved += Number(row.count)
        }
      } else {
        // Create new month data entry
        chartData.push({
          month,
          pending: row.status === 'pending' ? Number(row.count) : 0,
          in_review: row.status === 'in-review' ? Number(row.count) : 0,
          resolved: row.status === 'resolved' ? Number(row.count) : 0,
        })
      }
    }

    // Get the last 6 months
    const currentDate = new Date()
    const last6Months: string[] = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = date.toLocaleString('default', { month: 'long' })
      last6Months.push(monthName)
    }

    // Fill in missing months with zero counts (only for last 6 months)
    for (const month of last6Months) {
      if (!chartData.find((data) => data.month === month)) {
        chartData.push({
          month,
          pending: 0,
          in_review: 0,
          resolved: 0,
        })
      }
    }

    // Filter to only include last 6 months and sort by month order
    const filteredChartData = chartData
      .filter((data) => last6Months.includes(data.month))
      .sort((a, b) => last6Months.indexOf(a.month) - last6Months.indexOf(b.month))

    return { success: true, data: filteredChartData }
  } catch (error) {
    console.error('Error fetching complaint chart data:', error)
    return { success: false, error: 'Failed to fetch complaint chart data' }
  }
}

/** ADMIN  */

export async function getAdminComplaintsStats() {
  try {
    const user = await authUser()
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'You are not authorized to access this page' }
    }
    // 📦 Ask database to group complaints by their status and count each group
    const result = await db
      .select({
        status: complaints.status, // 👈 select the status column
        count: count(complaints.id).as('count'), // 👈 count how many in each group
      })
      .from(complaints)
      .groupBy(complaints.status) // 👈 group by status (pending, resolved, etc.)
    // 🎯 Initialize counts
    const stats = {
      total: 0,
      resolved: 0,
      inReview: 0,
      pending: 0,
    }
    // 🔁 Loop through results and update stats
    for (const row of result) {
      stats.total += Number(row.count) // add to total
      if (row.status === 'resolved') {
        stats.resolved = Number(row.count)
      } else if (row.status === 'in-review') {
        stats.inReview = Number(row.count)
      } else if (row.status === 'pending') {
        stats.pending = Number(row.count)
      }
    }
    return { success: true, data: stats }
  } catch (error) {
    console.error('Error fetching admin complaint stats:', error)
    return { success: false, error: 'Failed to fetch admin complaint stats' }
  }
}

export async function getAllComplaints(limit?: number) {
  try {
    const user = await authUser()
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'You are not authorized to access this page' }
    }
    if (limit) {
      const allComplaints = await db.select().from(complaints).orderBy(desc(complaints.createdAt)).limit(limit)
      return { success: true, data: allComplaints }
    }
    const allComplaints = await db.select().from(complaints).orderBy(desc(complaints.createdAt))
    return { success: true, data: allComplaints }
  } catch (error) {
    console.error('Error fetching all complaints:', error)
    return { success: false, error: 'Failed to fetch all complaints' }
  }
}

export async function updateStatus(complaintId: string, status: 'pending' | 'in-review' | 'resolved') {
  try {
    const user = await authUser()

    if (!user || user.role !== 'admin') {
      return { success: false, error: 'You are not authorized for this action' }
    }

    // Get current complaint to capture old status
    const [currentComplaint] = await db.select().from(complaints).where(eq(complaints.id, complaintId))

    if (!currentComplaint) {
      return { success: false, error: 'Complaint not found' }
    }

    const oldStatus = currentComplaint.status

    // Update status and add status history in a transaction
    await db.transaction(async (tx) => {
      // Update the complaint status
      await tx.update(complaints).set({ status: status }).where(eq(complaints.id, complaintId))

      // Add status history entry
      await tx.insert(complaintStatusHistory).values({
        complaintId,
        changedBy: user.userId,
        fieldChanged: 'status',
        oldValue: oldStatus,
        newValue: status,
        notes: `Status changed from ${oldStatus} to ${status}`,
      })
    })

    // Revalidate the complaint detail pages
    revalidatePath(`/admin/complaints/${complaintId}`)
    revalidatePath(`/student/complaints/${complaintId}`)
    revalidatePath('/admin/complaints')
    revalidatePath('/student/complaints')

    return { success: true, message: 'Complaint status updated successfully' }
  } catch (error) {
    console.error('Error updating status', error)
    return { success: false, error: 'Failed to update complaint status' }
  }
}

export async function updatePriority(complaintId: string, priority: 'low' | 'normal' | 'high') {
  try {
    const user = await authUser()

    if (!user || user.role !== 'admin') {
      return { success: false, error: 'You are not authorized for this action' }
    }

    // Get current complaint to capture old priority
    const [currentComplaint] = await db.select().from(complaints).where(eq(complaints.id, complaintId))

    if (!currentComplaint) {
      return { success: false, error: 'Complaint not found' }
    }

    const oldPriority = currentComplaint.priority

    // Update priority and add status history in a transaction
    await db.transaction(async (tx) => {
      // Update the complaint priority
      await tx.update(complaints).set({ priority: priority }).where(eq(complaints.id, complaintId))

      // Add status history entry
      await tx.insert(complaintStatusHistory).values({
        complaintId,
        changedBy: user.userId,
        fieldChanged: 'priority',
        oldValue: oldPriority,
        newValue: priority,
        notes: `Priority changed from ${oldPriority} to ${priority}`,
      })
    })

    // Revalidate the complaint detail pages
    revalidatePath(`/admin/complaints/${complaintId}`)
    revalidatePath(`/student/complaints/${complaintId}`)
    revalidatePath('/admin/complaints')
    revalidatePath('/student/complaints')

    return { success: true, message: 'Complaint priority updated successfully' }
  } catch (error) {
    console.error('Error updating priority', error)
    return { success: false, error: 'Failed to update complaint priority' }
  }
}

export async function updateStatusHistory(
  complaintId: string,
  fieldChanged: 'status' | 'priority' | 'created',
  oldValue: string,
  newValue: string,
  notes?: string,
) {
  try {
    const user = await authUser()

    if (!user || user.role !== 'admin') {
      return { success: false, error: 'You are not authorized for this action' }
    }

    await db.insert(complaintStatusHistory).values({
      complaintId,
      changedBy: user.userId,
      fieldChanged,
      oldValue,
      newValue,
      notes,
    })

    return { success: true, message: 'Status history updated successfully' }
  } catch (error) {
    console.error('Error updating status history', error)
    return { success: false, error: 'Failed to update status history' }
  }
}

export async function getAllComplaintChartData() {
  try {
    const user = await authUser()
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'You are not authorized to access this page' }
    }

    // Get the last 3 months date range
    const currentDate = new Date()
    const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1)

    // Fetch complaint counts grouped by date and status (for last 3 months)
    const dateResult = await db
      .select({
        date: complaints.createdAt,
        status: complaints.status,
        count: count(complaints.id).as('count'),
      })
      .from(complaints)
      .groupBy(complaints.createdAt, complaints.status)
      .orderBy(complaints.createdAt)

    // 🎯 Initialize date-based chart data structure
    const chartData: { date: string; pending: number; in_review: number; resolved: number }[] = []

    // 🔁 Loop through results and build date-based chart data
    for (const row of dateResult) {
      const date = new Date(row.date).toISOString().split('T')[0] // Format as YYYY-MM-DD
      const existingDateData = chartData.find((data) => data.date === date)
      if (existingDateData) {
        // Update existing date data
        if (row.status === 'pending') {
          existingDateData.pending += Number(row.count)
        } else if (row.status === 'in-review') {
          existingDateData.in_review += Number(row.count)
        } else if (row.status === 'resolved') {
          existingDateData.resolved += Number(row.count)
        }
      } else {
        // Create new date data entry
        chartData.push({
          date,
          pending: row.status === 'pending' ? Number(row.count) : 0,
          in_review: row.status === 'in-review' ? Number(row.count) : 0,
          resolved: row.status === 'resolved' ? Number(row.count) : 0,
        })
      }
    }

    // Filter to only include last 3 months
    const filteredChartData = chartData.filter((data) => {
      const dataDate = new Date(data.date)
      return dataDate >= threeMonthsAgo
    })

    // Sort by date
    filteredChartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Fetch complaint counts grouped by faculty (for all time)
    const facultyResult = await db
      .select({
        faculty: complaints.faculty,
        count: count(complaints.id).as('count'),
      })
      .from(complaints)
      .groupBy(complaints.faculty)
      .orderBy(desc(count(complaints.id)))

    // Define faculty colors (handle both lowercase and capitalized)
    const facultyColors: Record<string, string> = {
      Science: '#3b82f6',
      science: '#3b82f6',
      Law: '#dc2626',
      law: '#dc2626',
      Arts: '#059669',
      arts: '#059669',
      Education: '#d97706',
      education: '#d97706',
      'Management Science': '#7c3aed',
      'management science': '#7c3aed',
      Transport: '#0891b2',
      transport: '#0891b2',
      Engineering: '#f59e0b',
      engineering: '#f59e0b',
      Medicine: '#10b981',
      medicine: '#10b981',
      Agriculture: '#8b5cf6',
      agriculture: '#8b5cf6',
      Other: '#4b5563',
      other: '#4b5563',
    }

    // 🎯 Initialize faculty-based chart data structure
    const facultyChartData: { faculty: string; complaints: number; fill: string }[] = []

    // 🔁 Loop through faculty results and build chart data
    for (const row of facultyResult) {
      const faculty = row.faculty || 'Other'
      const color = facultyColors[faculty] || '#4b5563' // Default gray color

      facultyChartData.push({
        faculty,
        complaints: Number(row.count),
        fill: color,
      })
    }

    return {
      success: true,
      data: {
        dateChart: filteredChartData,
        facultyChart: facultyChartData,
      },
    }
  } catch (error) {
    console.error('Error fetching all complaint chart data:', error)
    return { success: false, error: 'Failed to fetch all complaint chart data' }
  }
}

export const getComplaintById = async (complaintId: string) => {
  try {
    const user = await authUser()
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Fetch complaint details
    const [complaint] = await db.select().from(complaints).where(eq(complaints.id, complaintId))

    if (!complaint) {
      return { success: false, error: 'Complaint not found' }
    }

    // Fetch attachments
    const attachments = await db
      .select()
      .from(complaintAttachments)
      .where(eq(complaintAttachments.complaintId, complaintId))

    // Fetch status history
    const statusHistory = await db
      .select()
      .from(complaintStatusHistory)
      .leftJoin(users, eq(complaintStatusHistory.changedBy, user.userId))
      .where(eq(complaintStatusHistory.complaintId, complaintId))
      .orderBy(desc(complaintStatusHistory.changedAt))

    return { success: true, data: { complaints: complaint, attachments, statusHistory } }
  } catch (error) {
    console.error('Error fetching complaint by ID:', error)
    return { success: false, error: 'Failed to fetch complaint details' }
  }
}
