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
                // Admins don't have a separate table, so we skip this check for them
                if (profile.role !== 'admin') {
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
                }

                // Role-based route protection
                const pathname = request.nextUrl.pathname;

                // Admin routes
                if (pathname.startsWith('/dashboard/admin')) {
                    if (profile.role !== 'admin') {
                        return NextResponse.redirect(new URL('/dashboard', request.url));
                    }
                    // Allow admin to proceed
                    return supabaseResponse;
                }

                // Admin accessing other dashboards - allow or redirect?
                // Let's redirect admins to their own dashboard if they hit the root
                if (pathname === '/dashboard' && profile.role === 'admin') {
                    return NextResponse.redirect(new URL('/dashboard/admin', request.url));
                }

                // Regular user routing (existing logic)
                const businessOnlyRoutes = ['/dashboard/creators', '/dashboard/sent-requests'];

                const isCreatorListRoute = pathname === '/dashboard/requests' ||
                    pathname === '/dashboard/requests/';

                if (isCreatorListRoute && profile.role === 'business') {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }

                if (businessOnlyRoutes.some(route => pathname.startsWith(route))) {
                    if (profile.role === 'creator') {
                        return NextResponse.redirect(new URL('/dashboard', request.url));
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
