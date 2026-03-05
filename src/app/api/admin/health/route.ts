import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = Date.now()

  try {
    // Basic health check for admin services
    const healthCheck = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {
        database: 'checking...',
        auth: 'checking...',
      },
      responseTime: 0,
    }

    // Simple database connection test (without heavy queries)
    try {
      const { db } = await import('@/db/schema')
      await db.execute('SELECT 1')
      healthCheck.services.database = 'healthy'
    } catch (error) {
      healthCheck.services.database = 'error'
      healthCheck.status = 'degraded'
    }

    // Simple auth check
    try {
      const { auth } = await import('@clerk/nextjs/server')
      await auth()
      healthCheck.services.auth = 'healthy'
    } catch (error) {
      healthCheck.services.auth = 'error'
      healthCheck.status = 'degraded'
    }

    healthCheck.responseTime = Date.now() - startTime

    return NextResponse.json(healthCheck)
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Health check failed',
        responseTime: Date.now() - startTime,
      },
      { status: 500 },
    )
  }
}
