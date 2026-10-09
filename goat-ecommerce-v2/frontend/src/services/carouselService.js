import { supabase } from "../lib/supabase";

const CAROUSEL_COUNT = 6;

function explainCarouselError(error) {
  if (
    error?.code === "42P01" ||
    error?.message?.includes("carousel_images") ||
    error?.message?.includes("schema cache")
  ) {
    return new Error(
      "Falta crear carousel_images en Supabase. Ejecuta frontend/supabase/site_content.sql en el SQL Editor.",
    );
  }

  return error;
}

export async function getCarouselImages() {
  const { data, error } = await supabase
    .from("carousel_images")
    .select("id, image_url, overlay_text, display_order")
    .order("display_order", { ascending: true })
    .limit(CAROUSEL_COUNT);

  if (error) throw explainCarouselError(error);
  return data || [];
}

export async function saveCarouselImage(id, file, overlayText) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Selecciona un archivo de imagen válido.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `carousel-${id}-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("site-content")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("site-content").getPublicUrl(path);

  const { data, error } = await supabase
    .from("carousel_images")
    .upsert(
      { id, image_url: publicUrl, overlay_text: overlayText || "" },
      { onConflict: "id" },
    )
    .select("id, image_url, overlay_text, display_order")
    .single();

  if (error) throw explainCarouselError(error);
  return data;
}

export async function updateCarouselText(id, overlayText) {
  const { data, error } = await supabase
    .from("carousel_images")
    .update({ overlay_text: overlayText || "" })
    .eq("id", id)
    .select("id, image_url, overlay_text, display_order")
    .single();

  if (error) throw explainCarouselError(error);
  return data;
}
