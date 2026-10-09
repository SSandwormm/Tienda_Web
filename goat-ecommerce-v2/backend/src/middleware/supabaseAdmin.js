const { createClient } = require("@supabase/supabase-js");

let supabase;

function getSupabaseClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error(
      "SUPABASE_URL y SUPABASE_ANON_KEY deben estar configuradas en .env.",
    );
  }

  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
  }

  return supabase;
}

async function requireSupabaseAdmin(req, res, next) {
  const authorization = req.headers.authorization || "";
  const token = authorization.replace(/^Bearer\s+/i, "");
  if (authorization) {
    console.log(
      "[SupabaseAuth] Authorization recibido:",
      authorization.slice(0, 10),
      "token:",
      token.slice(0, 10),
    );
  }
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return res.status(500).json({
      error: "Falta configurar SUPABASE_URL y SUPABASE_ANON_KEY en .env",
    });
  }

  try {
    const {
      data: { user },
      error,
    } = await getSupabaseClient().auth.getUser(token);
    if (error) {
      console.error("[SupabaseAuth] getUser error exacto:", error);
      return res
        .status(401)
        .json({ error: "Token de Supabase invalido o expirado" });
    }

    if (user?.user_metadata?.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Se requiere rol de administrador" });
    }

    req.supabaseUser = user;
    next();
  } catch (error) {
    console.error("[SupabaseAuth] getUser error exacto:", error);
    return res
      .status(401)
      .json({ error: "Token de Supabase invalido o expirado" });
  }
}

module.exports = { requireSupabaseAdmin };
