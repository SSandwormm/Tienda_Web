import { supabase } from "../lib/supabase";

const PAYMENT_FIELDS =
  "id, user_id, brand, last4, exp_month, exp_year, holder_name, gateway_token, is_default, created_at";

export async function listPaymentMethods(userId) {
  const { data, error } = await supabase
    .from("payment_methods")
    .select(PAYMENT_FIELDS)
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createPaymentMethod(userId, method) {
  const safeMethod = {
    brand: method.brand,
    last4: method.last4,
    exp_month: method.exp_month,
    exp_year: method.exp_year,
    holder_name: method.holder_name,
    gateway_token: method.gateway_token || null,
    is_default: Boolean(method.is_default),
    user_id: userId,
  };
  const { data, error } = await supabase
    .from("payment_methods")
    .insert(safeMethod)
    .select(PAYMENT_FIELDS)
    .single();
  if (error) throw error;
  return data;
}

export async function deletePaymentMethod(id, userId) {
  const { error } = await supabase
    .from("payment_methods")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function setDefaultPaymentMethod(id, userId) {
  const { data, error } = await supabase
    .from("payment_methods")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", userId)
    .select(PAYMENT_FIELDS)
    .single();
  if (error) throw error;
  return data;
}
