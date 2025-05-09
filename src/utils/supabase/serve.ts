"use server";

import { createServerClient } from "@supabase/ssr";

export async function createServerSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: "sb" },
      cookies: {
        get: () => undefined,
        set: () => undefined,
        delete: () => undefined,
      },
    }
  );
}
