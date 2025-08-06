import { auth } from '@clerk/nextjs/server'

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
