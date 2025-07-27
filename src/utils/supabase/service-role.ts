
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// This client is intended for server-side use ONLY, in trusted environments.
// It uses the service role key to bypass RLS policies.
// NEVER expose the service role key on the client-side.
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase URL or Service Role Key is not defined in environment variables.")
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
