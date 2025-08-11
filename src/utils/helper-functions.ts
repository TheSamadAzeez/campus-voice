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
    role: role as 'admin' | 'student',
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

    // If raw/destroy fails, try image/destroy (for image files)
    if (result.result !== 'ok') {
      console.log(`Raw destroy failed for ${cloudinaryPublicId}, trying image destroy...`)

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
        console.error(`Failed to delete from Cloudinary: ${cloudinaryPublicId}`, imageResult)
        return false
      }
    } else {
      console.log(`Successfully deleted file from Cloudinary: ${cloudinaryPublicId}`)
      return true
    }
  } catch (cleanupError) {
    console.error('Cloudinary cleanup error for attachment:', cloudinaryPublicId, cleanupError)
    return false
  }
}
