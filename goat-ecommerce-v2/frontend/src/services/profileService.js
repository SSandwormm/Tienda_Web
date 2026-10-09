import { supabase } from "../lib/supabase";

const PROFILE_FIELDS =
  "id, email, full_name, phone, document_type, document_number, created_at, updated_at";

export async function getProfile(userId) {
  if (!userId) throw new Error("No hay un usuario autenticado.");

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  if (!userId) throw new Error("No hay un usuario autenticado.");

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select(PROFILE_FIELDS)
    .single();

  if (error) throw error;
  return data;
}
