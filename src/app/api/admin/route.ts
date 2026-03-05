import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Redirect GET requests to the admin dashboard
  return NextResponse.redirect(new URL('/admin', request.url))
}

export async function POST(request: NextRequest) {
  console.log('Unexpected POST request to /admin route:', {
    url: request.url,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries()),
  })

  return NextResponse.json(
    {
      success: false,
      error: 'POST requests to /admin are not supported. Use specific admin API endpoints.',
      redirect: '/admin',
    },
    { status: 405 },
  )
}

export async function PUT(_request: NextRequest) {
  return NextResponse.json({ success: false, error: 'PUT method not allowed' }, { status: 405 })
}

export async function DELETE(_request: NextRequest) {
  return NextResponse.json({ success: false, error: 'DELETE method not allowed' }, { status: 405 })
}
