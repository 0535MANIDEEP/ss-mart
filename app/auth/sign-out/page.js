// app/auth/sign-out/page.js
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SignOutPage() {
  const router = useRouter();
  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut(); // Clear Supabase session
      router.push("/auth/sign-in"); // Redirect to login
    }
    signOut();
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem", color: "#155724" }}>
      <h2>Signing out...</h2>
    </div>
  );
}

// Comments:
// - Calls Supabase signOut and redirects to login page.
// - Ensures session is cleared on sign-out.
