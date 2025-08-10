// app/components/AuthContext.jsx
"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data, error }) => {
      if (error) setError(error.message);
      setSession(data?.session || null);
      setUser(data?.session?.user || null);
      // Fetch roles if user exists
      if (data?.session?.user?.id) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.session.user.id);
        if (roleError) setError(roleError.message);
        setRoles(roleData ? roleData.map(r => r.role) : []);
      } else {
        setRoles([]);
      }
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session || null);
      setUser(session?.user || null);
      if (session?.user?.id) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
        if (roleError) setError(roleError.message);
        setRoles(roleData ? roleData.map(r => r.role) : []);
      } else {
        setRoles([]);
      }
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Utility function for role checking
  function hasRole(requiredRole) {
    return roles.includes(requiredRole);
  }

  return (
    <AuthContext.Provider value={{ user, loading, session, error, roles, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
