import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: You *must* call getUser to refresh the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Redirect to login if accessing protected route without auth
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if authenticated user has completed their profile
    if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
        // Skip check for onboarding page itself
        if (!request.nextUrl.pathname.startsWith('/dashboard/onboarding')) {
            // Get user's role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile) {
                // Check if role-specific profile exists
                const table = profile.role === 'creator' ? 'creators' : 'businesses'
                const { data: roleProfile } = await supabase
                    .from(table)
                    .select('id')
                    .eq('id', user.id)
                    .single()

                // Redirect to onboarding if profile incomplete
                if (!roleProfile) {
                    return NextResponse.redirect(new URL('/dashboard/onboarding', request.url))
                }

                // Role-based route protection
                const businessOnlyRoutes = ['/dashboard/creators', '/dashboard/sent-requests']
                const creatorOnlyRoutes = ['/dashboard/requests']

                // Redirect businesses away from creator-only routes
                if (creatorOnlyRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
                    if (profile.role === 'business') {
                        return NextResponse.redirect(new URL('/dashboard', request.url))
                    }
                }

                // Redirect creators away from business-only routes
                if (businessOnlyRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
                    if (profile.role === 'creator') {
                        return NextResponse.redirect(new URL('/dashboard', request.url))
                    }
                }
            }
        }
    }

    return supabaseResponse
}

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Logo (public logo)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|Logo|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
