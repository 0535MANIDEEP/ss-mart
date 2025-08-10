// app/api/admin-routes/dashboard/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Utility: Validate JWT and admin status
async function verifyAdmin(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return { error: 'Missing Authorization header', status: 401 };
  const token = authHeader.replace('Bearer ', '');
  // Validate JWT
  const { data: user, error: jwtError } = await supabase.auth.getUser(token);
  if (jwtError || !user?.user) return { error: 'Invalid or expired token', status: 401 };
  // Check admin status via RPC
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', { uid: user.user.id });
  if (adminError || !isAdmin) return { error: 'Admin access required', status: 403 };
  return { user: user.user };
}

export async function OPTIONS() {
  // CORS preflight
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    },
  });
}

export async function GET(req) {
  // Admin dashboard data
  const result = await verifyAdmin(req);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  // Return dashboard data (stub)
  return NextResponse.json({ message: 'Welcome, admin!', user: result.user });
}

// Comments:
// - Validates JWT and admin status for every request
// - Handles CORS preflight
// - Returns granular error messages (no sensitive info)
// - Principle of Least Privilege enforced
