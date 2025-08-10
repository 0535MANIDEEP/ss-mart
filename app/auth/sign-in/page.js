// app/auth/sign-in/page.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Use env vars for Supabase config
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Handles sign-in or sign-up
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (isSignUp) {
      // Sign up flow
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      // Insert role for new user
      try {
        // Wait for user creation
        const userId = data.user?.id;
        if (userId) {
          // Upsert role record (atomic, handles conflict)
          const { error: roleError } = await supabase
            .from("user_roles")
            .upsert([{ user_id: userId, role: "user" }], { onConflict: ["user_id"] });
          if (roleError) {
            setError("Role assignment failed: " + roleError.message);
            setLoading(false);
            return;
          }
        }
        router.push("/");
      } catch (err) {
        setError("Unexpected error: " + err.message);
      }
      setLoading(false);
    } else {
      // Sign in flow
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      router.push("/");
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "4rem auto", padding: "2rem", background: "#e6f9f0", borderRadius: 8 }}>
      <h2 style={{ color: "#155724" }}>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button type="submit" style={{ width: "100%", background: "#43e97b", color: "#155724", border: "none", padding: "0.75rem", borderRadius: 4 }} disabled={loading}>
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <div style={{ marginTop: "1rem" }}>
        <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(""); }} style={{ background: "none", border: "none", color: "#155724", textDecoration: "underline", cursor: "pointer" }}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </div>
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
    </div>
  );
}

// Comments:
// - On sign-up, after user creation, upserts role 'user' in user_roles table.
// - On sign-in, only authenticates; does not alter roles.
// - All errors are shown to the user. Uses env vars for Supabase config.
// - Ready for future role-based access control extension.
