const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

console.log(
  "[Config] DATABASE_URL cargada desde",
  envPath,
  ":",
  process.env.DATABASE_URL ? "si" : "no",
);

const supabaseEnvReady = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY,
);
console.log("[Config] Supabase variables configuradas:", supabaseEnvReady);
if (!supabaseEnvReady) {
  console.warn(
    "[Config] Faltan SUPABASE_URL o SUPABASE_ANON_KEY en .env. Las rutas protegidas quedaran deshabilitadas.",
  );
}

const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});
