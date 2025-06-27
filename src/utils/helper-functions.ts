import { auth } from '@clerk/nextjs/server'

export async function authUser() {
  const { userId, redirectToSignUp } = await auth()
  if (!userId) {
    return redirectToSignUp()
  }
  return userId
}
