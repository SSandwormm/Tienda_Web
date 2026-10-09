import { supabase } from "../lib/supabase";

const ADDRESS_FIELDS =
  "id, user_id, label, recipient_name, phone, department, city, neighborhood, address_line, address_extra, notes, is_default, created_at, updated_at";

export async function listAddresses(userId) {
  const { data, error } = await supabase
    .from("addresses")
    .select(ADDRESS_FIELDS)
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAddress(userId, address) {
  const { data, error } = await supabase
    .from("addresses")
    .insert({ ...address, user_id: userId })
    .select(ADDRESS_FIELDS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateAddress(id, userId, address) {
  const { data, error } = await supabase
    .from("addresses")
    .update(address)
    .eq("id", id)
    .eq("user_id", userId)
    .select(ADDRESS_FIELDS)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAddress(id, userId) {
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function setDefaultAddress(id, userId) {
  const { data, error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", userId)
    .select(ADDRESS_FIELDS)
    .single();
  if (error) throw error;
  return data;
}
