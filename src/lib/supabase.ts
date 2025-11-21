import { createClient } from "@supabase/supabase-js";

// For MVP, we are using a mock backend/local storage, but we'll set up the client
// so it's ready for real credentials.
// If env vars are missing, we can fallback to a mock or just warn.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseKey);
