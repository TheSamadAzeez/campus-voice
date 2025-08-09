'use server'

import { complaintAttachments, complaints, complaintStatusHistory, db, NewComplaint, users } from '@/db/schema'
import { authUser } from '../helper-functions'
import crypto from 'crypto'
import { count, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createComplaintWithAttachment(complaintData: FormData) {
  const cloudinaryPublicId = complaintData.get('cloudinaryPublicId') as string

  try {
    const title = complaintData.get('title') as string
    const description = complaintData.get('description') as string
    const category = complaintData.get('category') as string
    const faculty = complaintData.get('faculty') as string
    const resolutionType = complaintData.get('resolutionType') as string
    const { userId } = await authUser() // Get userId from session
    const cloudinaryUrl = complaintData.get('cloudinaryUrl') as string
    const fileSize = complaintData.get('fileSize') ? Number(complaintData.get('fileSize')) : null
    const fileType = complaintData.get('fileType') as string
    const fileName = complaintData.get('fileName') as string

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

      // Insert attachment only if file was uploaded
      if (cloudinaryUrl && cloudinaryPublicId && fileName) {
        // Validate required attachment fields
        if (!fileType) {
          throw new Error('File type is required for attachment')
        }

        const attachmentData = {
          complaintId: complaint.id,
          fileName,
          fileType,
          fileSize: fileSize || 0,
          cloudinaryPublicId,
          cloudinaryUrl,
        }

        await tx.insert(complaintAttachments).values(attachmentData)
      }

      return complaint
    })

    return { success: true, complaint: result }
  } catch (error) {
    // Clean up uploaded file on error
    if (cloudinaryPublicId) {
      try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
        const apiSecret = process.env.CLOUDINARY_API_SECRET

        if (cloudName && apiKey && apiSecret) {
          // Generate signature for Cloudinary API request
          const timestamp = Math.round(new Date().getTime() / 1000)
          const stringToSign = `public_id=${cloudinaryPublicId}&timestamp=${timestamp}${apiSecret}`
          const signature = crypto.createHash('sha1').update(stringToSign).digest('hex')

          await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              public_id: cloudinaryPublicId,
              api_key: apiKey,
              timestamp: timestamp.toString(),
              signature: signature,
            }),
          })
        }
      } catch (cleanupError) {
        console.error('Cloudinary Cleanup Error', cleanupError)
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

// export async function getComplaintById(complaintId: string) {
//   try {
//     const { userId } = await authUser()
//     if (!userId) {
//       return { success: false, error: 'User not authenticated' }
//     }
//     // Fetch complaint details along with user info
//     const [complaint] = await db
//       .select()
//       .from(complaints)
//       .leftJoin(complaintAttachments, eq(complaints.id, complaintAttachments.complaintId))
//       .where(eq(complaints.id, complaintId))
//     if (!complaint) {
//       return { success: false, error: 'Complaint not found' }
//     }
//     // Fetch attachments
//     const attachments = await db
//       .select()
//       .from(complaintAttachments)
//       .where(eq(complaintAttachments.complaintId, complaintId))
//     // Fetch status history
//     const statusHistory = await db
//       .select()
//       .from(complaints.statusHistory)
//       .leftJoin(users, eq(complaints.statusHistory.changedBy, users.id))
//       .where(eq(complaints.statusHistory.complaintId, complaintId))
//       .orderBy(desc(complaints.statusHistory.changedAt))
//     // Fetch feedback if exists
//     const [feedback] = await db
//       .select()
//       .from(complaints.feedback)
//       .where(eq(complaints.feedback.complaintId, complaintId))
//     return {  success: true, data: { ...complaint, attachments, statusHistory, feedback } }
//   } catch (error) {
//     console.error('Error fetching complaint by ID:', error)
//     return { success: false, error: 'Failed to fetch complaint details' }
//   }
// }

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
