
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Maintenance Mode Check
  if (process.env.MAINTENANCE_MODE_ENABLED === 'true') {
    // Allow access to the maintenance page itself to avoid a redirect loop
    if (request.nextUrl.pathname !== '/error') {
      const url = request.nextUrl.clone()
      url.pathname = '/error'
      return NextResponse.redirect(url)
    }
  }
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Define public admin paths that don't require authentication
  const publicAdminPaths = ['/admin/login', '/admin/create-admin', '/admin/set-password']

  // If the user is trying to access a protected admin route and is not authenticated
  if (pathname.startsWith('/admin') && !publicAdminPaths.includes(pathname) && !session) {
    // Redirect to the login page
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If the user is authenticated and tries to access a public admin path (like login)
  if (session && publicAdminPaths.includes(pathname)) {
    // Redirect them to the admin dashboard
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
