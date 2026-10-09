import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wjpavgtpfmcdeiqacacm.supabase.co";

const supabaseAnonKey = "sb_publishable_UoJi8TP0ajHGo1dPw6w7_w_kOPHvPLt";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
