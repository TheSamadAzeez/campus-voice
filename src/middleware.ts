import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/api/webhooks(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isStudentRoute = createRouteMatcher(['/student(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Handle public routes first
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
  const userRole = sessionClaims?.metadata?.role || 'student'
  const isAdmin = userRole === 'admin'

  // Handle admin routes - only allow admins
  if (isAdminRoute(req)) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/student', req.url))
    }
    return
  }

  // Handle student routes - redirect admins to admin dashboard
  if (isStudentRoute(req)) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return
  }

  // For root or other routes, redirect based on role
  if (req.nextUrl.pathname === '/') {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url))
    } else {
      return NextResponse.redirect(new URL('/student', req.url))
    }
  }

  // Allow all other authenticated routes
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
