import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import type { DeletedObjectJSON, UserJSON } from '@clerk/nextjs/server'
import { usersTable } from '@/db/schema'
import { createUser, deleteUser, updateUser } from '@/utils/actions'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Create user
    if (evt.type === 'user.created') {
      const {
        id: clerkUserId,
        email_addresses,
        first_name,
        last_name,
        image_url,
        public_metadata,
      } = evt.data as UserJSON
      const emailAddress = email_addresses?.[0]?.email_address || null
      const role: 'student' | 'admin' = public_metadata?.role === 'admin' ? 'admin' : 'student'

      const user = {
        clerkUserId,
        email: emailAddress || '',
        firstName: first_name || '',
        lastName: last_name || '',
        imageUrl: image_url || '',
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await createUser(user)
    }

    // Update user
    if (evt.type === 'user.updated') {
      const {
        id: clerkUserId,
        email_addresses,
        first_name,
        last_name,
        image_url,
        public_metadata,
      } = evt.data as UserJSON
      const emailAddress = email_addresses?.[0]?.email_address || null
      const role: 'student' | 'admin' = public_metadata?.role === 'admin' ? 'admin' : 'student'

      const user = {
        clerkUserId,
        email: emailAddress || '',
        firstName: first_name || '',
        lastName: last_name || '',
        imageUrl: image_url || '',
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await updateUser(user)
    }

    // Delete user
    if (evt.type === 'user.deleted') {
      const { id: clerkUserId } = evt.data as DeletedObjectJSON
      await deleteUser(clerkUserId || '')
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
