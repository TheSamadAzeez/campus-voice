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
