import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  getProfile,
  updateProfile as saveProfile,
} from "../services/profileService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = String(
    user?.user_metadata?.role ?? user?.app_metadata?.role ?? "user",
  ).toLowerCase();
  const isAdmin = role === "admin";

  async function fetchProfile(userId) {
    try {
      const data = await getProfile(userId);
      setProfile(data);
      setProfileError(data ? "" : "No se encontró tu perfil.");
      return data;
    } catch (error) {
      console.error("No se pudo cargar el perfil:", error);
      setProfile(null);
      setProfileError(
        error.code === "42P01" ||
          error.code === "PGRST205" ||
          error.message?.includes("public.profiles")
          ? "PROFILE_TABLE_MISSING"
          : error.message || "No se pudo cargar tu perfil.",
      );
      return null;
    }
  }

  useEffect(() => {
    console.log("[Auth] rol de sesión", {
      userId: user?.id ?? null,
      userMetadataRole: user?.user_metadata?.role ?? null,
      isAdmin,
    });
  }, [user?.id, user?.user_metadata?.role, isAdmin]);

  /* ── Sesión inicial + listener de cambios ── */
  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      else {
        setProfile(null);
        setProfileError("");
      }
      setLoading(false);
    }

    getSession().catch((error) => {
      console.error("No se pudo cargar la sesión:", error);
      setProfileError("No se pudo cargar la sesión de usuario.");
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      else {
        setProfile(null);
        setProfileError("");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── Auth actions ── */
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
    setProfile(null);
    setProfileError("");
  };

  /* ── Actualizar perfil en tabla profiles ── */
  const updateProfile = async (updates) => {
    if (!user?.id) throw new Error("No hay un usuario autenticado.");
    const data = await saveProfile(user.id, updates);
    setProfile(data);
    return data;
  };

  const retryProfile = () => (user?.id ? fetchProfile(user.id) : null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        profileError,
        retryProfile,
        token,
        loading,
        role,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
