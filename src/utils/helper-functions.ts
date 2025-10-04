'use server'

import { auth } from '@clerk/nextjs/server'
import crypto from 'crypto'

export async function authUser() {
  const { userId, redirectToSignUp, sessionClaims } = await auth()
  if (!userId) {
    return redirectToSignUp()
  }

  const role = sessionClaims?.metadata?.role || 'student'

  return {
    userId,
    role: role as 'admin' | 'student' | 'department-admin',
  }
}

export async function deleteFromCloudinary(cloudinaryPublicId: string): Promise<boolean> {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary environment variables')
      return false
    }

    // Generate signature for Cloudinary API request
    const timestamp = Math.round(new Date().getTime() / 1000)
    const stringToSign = `public_id=${cloudinaryPublicId}&timestamp=${timestamp}${apiSecret}`
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex')

    // Try to delete as a general resource first (works for all file types)
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/destroy`, {
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

    const result = await response.json()

    // If raw/destroy succeeds, we're done
    if (result.result === 'ok') {
      console.log(`Successfully deleted file from Cloudinary: ${cloudinaryPublicId}`)
      return true
    }

    // If raw/destroy fails (including "not found"), try other resource types
    console.log(`Raw destroy failed for ${cloudinaryPublicId} (${result.result}), trying other resource types...`)

    // Try video/destroy (handles video and audio files)
    const videoResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/destroy`, {
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

    const videoResult = await videoResponse.json()

    if (videoResult.result === 'ok') {
      console.log(`Successfully deleted video/audio from Cloudinary: ${cloudinaryPublicId}`)
      return true
    } else if (videoResult.result === 'not found') {
      console.log(`Video/audio file not found in Cloudinary: ${cloudinaryPublicId}`)
      // Continue to try image destroy
    }

    // Try image/destroy (for image files)
    console.log(`Video destroy failed for ${cloudinaryPublicId}, trying image destroy...`)

    const imageResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
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

    const imageResult = await imageResponse.json()

    if (imageResult.result === 'ok') {
      console.log(`Successfully deleted image from Cloudinary: ${cloudinaryPublicId}`)
      return true
    } else {
      // Check if all resource types returned "not found"
      const allNotFound =
        result.result === 'not found' && videoResult.result === 'not found' && imageResult.result === 'not found'

      if (allNotFound) {
        console.log(`File not found in any Cloudinary resource type (already deleted): ${cloudinaryPublicId}`)
        return true
      } else {
        console.error(`Failed to delete from Cloudinary after trying all resource types: ${cloudinaryPublicId}`, {
          raw: result,
          video: videoResult,
          image: imageResult,
        })
        return false
      }
    }
  } catch (cleanupError) {
    console.error('Cloudinary cleanup error for attachment:', cloudinaryPublicId, cleanupError)
    return false
  }
}
