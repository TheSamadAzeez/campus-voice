'use server'

import { complaintAttachments, complaints, db, NewComplaint } from '@/db/schema'
import { authUser } from '../helper-functions'
import crypto from 'crypto'

export async function createComplaintWithAttachment(complaintData: FormData) {
  const cloudinaryPublicId = complaintData.get('cloudinaryPublicId') as string

  try {
    console.log('Server action called with FormData')

    const title = complaintData.get('title') as string
    const description = complaintData.get('description') as string
    const category = complaintData.get('category') as string
    const faculty = complaintData.get('faculty') as string
    const resolutionType = complaintData.get('resolutionType') as string
    const userId = await authUser() // Get userId from session
    const cloudinaryUrl = complaintData.get('cloudinaryUrl') as string
    const fileSize = complaintData.get('fileSize') ? Number(complaintData.get('fileSize')) : null
    const fileType = complaintData.get('fileType') as string
    const fileName = complaintData.get('fileName') as string

    console.log('Extracted data:', {
      title,
      description,
      category,
      faculty,
      resolutionType,
      userId,
      hasFile: !!cloudinaryUrl,
      fileName,
    })

    const result = await db.transaction(async (tx) => {
      const newComplaintData: NewComplaint = {
        userId,
        title,
        description,
        category: category as any,
        faculty: faculty as any,
        resolutionType: resolutionType as any,
      }

      console.log('Inserting complaint with data:', newComplaintData)

      const [complaint] = await tx.insert(complaints).values(newComplaintData).returning()

      // Insert attachment only if file was uploaded
      if (cloudinaryUrl && cloudinaryPublicId && fileName) {
        console.log('Inserting attachment for complaint:', complaint.id)
        await tx.insert(complaintAttachments).values({
          complaintId: complaint.id,
          fileName,
          fileType,
          fileSize: fileSize || 0,
          cloudinaryPublicId,
          cloudinaryUrl,
        })
      }

      return complaint
    })

    console.log('Transaction completed successfully:', result)
    return { success: true, complaint: result }
  } catch (error) {
    // Clean up uploaded file on error
    if (cloudinaryPublicId) {
      try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
        const apiSecret = process.env.CLOUDINARY_API_SECRET

        if (cloudName && apiKey && apiSecret) {
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
        console.error('[Cloudinary Cleanup Error]', cleanupError)
      }
    }

    console.error('[Complaint Error]', error)
    return { success: false, error: 'Something went wrong submitting the complaint.' }
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
