import { supabase } from "../lib/supabase";

export const FUTURE_DROP_SECTION = "main";

function explainConfigError(error) {
  if (
    error?.code === "42P01" ||
    error?.message?.includes("future_drops_config")
  ) {
    return new Error(
      "Falta crear future_drops_config en Supabase. Ejecuta frontend/supabase/site_content.sql en el SQL Editor.",
    );
  }
  return error;
}

export async function getFutureDropConfig(sectionKey = FUTURE_DROP_SECTION) {
  const { data, error } = await supabase
    .from("future_drops_config")
    .select("section_key, target_date")
    .eq("section_key", sectionKey)
    .maybeSingle();

  if (error) throw explainConfigError(error);
  return data;
}

export async function saveFutureDropConfig(
  targetDate,
  sectionKey = FUTURE_DROP_SECTION,
) {
  if (!targetDate) throw new Error("Selecciona una fecha y hora válidas.");

  const { data, error } = await supabase
    .from("future_drops_config")
    .upsert(
      {
        section_key: sectionKey,
        target_date: new Date(targetDate).toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section_key" },
    )
    .select("section_key, target_date")
    .single();

  if (error) throw explainConfigError(error);
  return data;
}
