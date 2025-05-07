import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: async (name) => {
        return cookieStore.get(name)?.value
      },
      set: async (name, value, options) => {
        cookieStore.set({ name, value, ...options })
      },
      remove: async (name, options) => {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}
