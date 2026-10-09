import { supabase } from "../lib/supabase";

export const SITE_CONTENT_KEYS = {
  shopFeatured: "shop_featured",
  collectionVerano: "collection_verano",
  collectionInvierno: "collection_invierno",
  collectionExclusiva: "collection_exclusiva",
};

export const SITE_CONTENT_FALLBACKS = {
  [SITE_CONTENT_KEYS.shopFeatured]: "/img/muestra.jpeg",
  [SITE_CONTENT_KEYS.collectionVerano]: "/img/f1.jpeg",
  [SITE_CONTENT_KEYS.collectionInvierno]: "/img/f2.jpeg",
  [SITE_CONTENT_KEYS.collectionExclusiva]: "/img/ferrari.jpeg",
};

export async function getSiteContent() {
  const { data, error } = await supabase
    .from("site_content")
    .select("key, image_url")
    .in("key", Object.values(SITE_CONTENT_KEYS));

  if (error) {
    console.error("Error cargando contenido del sitio:", error);
    return { ...SITE_CONTENT_FALLBACKS };
  }

  return (data || []).reduce(
    (content, item) => ({
      ...content,
      [item.key]: item.image_url || content[item.key],
    }),
    { ...SITE_CONTENT_FALLBACKS },
  );
}

export async function uploadSiteContentImage(key, file) {
  if (!SITE_CONTENT_FALLBACKS[key]) {
    throw new Error("Clave de contenido no válida.");
  }

  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Selecciona un archivo de imagen válido.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${key}-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("site-content")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    if (uploadError.message?.toLowerCase().includes("bucket not found")) {
      throw new Error(
        'No existe el bucket "site-content". Ejecuta frontend/supabase/site_content.sql en el SQL Editor de Supabase.',
      );
    }

    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("site-content").getPublicUrl(path);

  const { error: saveError } = await supabase.from("site_content").upsert(
    {
      key,
      image_url: publicUrl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (saveError) throw saveError;
  return publicUrl;
}
