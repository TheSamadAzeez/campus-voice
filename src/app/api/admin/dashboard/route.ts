import { NextResponse } from 'next/server'
import { getAdminDashboardData } from '@/app/admin/actions'

export async function GET() {
  try {
    console.log('Admin dashboard API called')

    // Add timeout to the entire operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Dashboard API timeout')), 20000) // 20 second timeout
    })

    const dashboardData = await Promise.race([getAdminDashboardData(), timeoutPromise])

    return NextResponse.json({
      success: true,
      data: dashboardData,
    })
  } catch (error) {
    console.error('Admin dashboard API error:', error)

    // Return error response instead of throwing
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Dashboard data unavailable',
        fallback: {
          stats: { success: false, error: 'Stats unavailable' },
          complaints: { success: false, error: 'Complaints unavailable' },
          chart: { success: false, error: 'Chart data unavailable' },
        },
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'POST method not allowed for dashboard endpoint',
    },
    { status: 405 },
  )
}
