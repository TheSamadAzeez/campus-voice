import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import type { DeletedObjectJSON, UserJSON } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/utils/actions/user'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Create user
    if (evt.type === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data as UserJSON

      const emailAddress = email_addresses?.[0]?.email_address || null
      const role: 'student' | 'admin' | 'department-admin' =
        public_metadata?.role === 'admin'
          ? 'admin'
          : public_metadata?.role === 'department-admin'
            ? 'department-admin'
            : 'student'

      const user = {
        id, // This is the Clerk user ID, stored as primary key
        email: emailAddress || '',
        firstName: first_name?.trim() || '', // First name field
        lastName: last_name?.trim() || '', // Last name field
        name: `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown User', // Combined name field
        profileImage: image_url || null,
        role,
      }

      console.log('Creating user ...')
      await createUser(user)
      console.log('User created successfully ...')
    }

    // Update user
    if (evt.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data as UserJSON

      const emailAddress = email_addresses?.[0]?.email_address || null
      const role: 'student' | 'admin' | 'department-admin' =
        public_metadata?.role === 'admin'
          ? 'admin'
          : public_metadata?.role === 'department-admin'
            ? 'department-admin'
            : 'student'

      const user = {
        id,
        email: emailAddress || '',
        firstName: first_name?.trim() || '', // First name field
        lastName: last_name?.trim() || '', // Last name field
        profileImage: image_url || null,
        role,
        // Note: createdAt and updatedAt are automatically handled by defaultNow() in schema
      }

      console.log('Updating user ...')
      await updateUser(user)
      console.log('User updated successfully ...')
    }

    // Delete user
    if (evt.type === 'user.deleted') {
      const { id } = evt.data as DeletedObjectJSON

      console.log('Deleting user ...')
      await deleteUser(id || '')
      console.log('User deleted successfully ...')
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
