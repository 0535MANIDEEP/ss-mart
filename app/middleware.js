// app/middleware.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';


// Middleware to protect all /admin/* routes (server-side RBAC)
export async function middleware(req) {
  const url = req.nextUrl.pathname;
  if (url.startsWith('/admin')) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const token = req.cookies.get('sb-access-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }
    // Validate JWT
    const { data: user, error: jwtError } = await supabase.auth.getUser(token);
    if (jwtError || !user?.user) {
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }
    // Check admin status (assumes is_admin Postgres function)
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', { uid: user.user.id });
    if (adminError || !isAdmin) {
      return NextResponse.redirect(new URL('/auth/access-denied', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

// Comments:
// - Protects all /admin/* pages server-side
// - Redirects unauthorized users to login or access-denied page
// - Uses JWT from cookie for secure token management
