import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/api/webhooks(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isDepartmentRoute = createRouteMatcher(['/department(.*)'])
const isStudentRoute = createRouteMatcher(['/student(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Handle public routes first - allow everyone to access these
  if (isPublicRoute(req)) {
    return
  }

  // Protect all non-public routes
  const { userId, sessionClaims } = await auth()

  // If no user, protect the route (this will redirect to sign-in)
  if (!userId) {
    await auth.protect()
    return
  }

  // Get user role from session claims - default to 'student' if not set
  const userRole = (sessionClaims?.metadata?.role as 'admin' | 'department-admin' | 'student') || 'student'

  // Handle admin routes - only allow admin role
  if (isAdminRoute(req)) {
    if (userRole !== 'admin') {
      // Redirect based on their actual role
      const redirectPath = userRole === 'department-admin' ? '/department' : '/student'
      return NextResponse.redirect(new URL(redirectPath, req.url))
    }
    return
  }

  // Handle department routes - only allow department-admin role
  if (isDepartmentRoute(req)) {
    if (userRole !== 'department-admin') {
      // Redirect based on their actual role
      const redirectPath = userRole === 'admin' ? '/admin' : '/student'
      return NextResponse.redirect(new URL(redirectPath, req.url))
    }
    return
  }

  // Handle student routes - only allow student role
  if (isStudentRoute(req)) {
    if (userRole !== 'student') {
      // Redirect based on their actual role
      const redirectPath = userRole === 'admin' ? '/admin' : '/department'
      return NextResponse.redirect(new URL(redirectPath, req.url))
    }
    return
  }

  // Allow all other authenticated routes (profile, etc.)
  return
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
