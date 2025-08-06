'use server'

import { complaintAttachments, complaints, db, NewComplaint } from '@/db/schema'
import { authUser } from '../helper-functions'
import crypto from 'crypto'
import { count, desc, eq } from 'drizzle-orm'

// Function to create a complaint with an optional attachment
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

// Fetch complaints for the authenticated user
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

// export async function createComplaint(complaint: NewComplaint) {
//   try {
//     const userId = await authUser()
//     const newComplaint = await db
//       .insert(complaints)
//       .values({ ...complaint, userId: userId })
//       .returning()
//     return { success: true, data: newComplaint }
//   } catch (error) {
//     console.error('Error creating complaint:', error)
//     return { success: false, error: 'Failed to create complaint' }
//   }
// }

// export async function getComplaintById(complaintId: string) {
//   try {
//     const [complaint] = await db
//       .select()
//       .from(complaints)
//       .leftJoin(users, eq(complaints.userId, users.id))
//       .where(eq(complaints.id, complaintId))

//     if (!complaint) {
//       return { success: false, error: 'Complaint not found' }
//     }

//     // Get attachments
//     const attachments = await db
//       .select()
//       .from(complaintAttachments)
//       .where(eq(complaintAttachments.complaintId, complaintId))

//     // Get status history
//     const statusHistory = await db
//       .select()
//       .from(complaintStatusHistory)
//       .leftJoin(users, eq(complaintStatusHistory.changedBy, users.id))
//       .where(eq(complaintStatusHistory.complaintId, complaintId))
//       .orderBy(desc(complaintStatusHistory.changedAt))

//     // Get feedback if exists
//     const [feedback] = await db.select().from(complaintFeedback).where(eq(complaintFeedback.complaintId, complaintId))

//     return {
//       success: true,
//       data: {
//         ...complaint.complaints,
//         user: complaint.users,
//         attachments,
//         statusHistory,
//         feedback,
//       },
//     }
//   } catch (error) {
//     console.error('Error fetching complaint:', error)
//     return { success: false, error: 'Failed to fetch complaint' }
//   }
// }

// export async function getAllComplaints() {
//   try {
//     const user = await getUser()
//     if (user?.role !== 'admin') {
//       return 'You are not authorized to access this page'
//     }
//     const userComplaints = await db.select().from(complaints)
//     return userComplaints
//   } catch (error) {
//     console.error(error)
//     return 'Error fetching complaints'
//   }
// }

// export async function getUserComplaints() {
//   try {
//     const userId = await authUser()
//     const userComplaints = await db.select().from(complaints).where(eq(complaints.userId, userId))
//     return userComplaints
//   } catch (error) {
//     console.error(error)
//     return null
//   }
// }
