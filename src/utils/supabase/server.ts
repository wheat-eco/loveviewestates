import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: "sb" },
      cookies: {
        get: () => null,
        set: () => {},
        remove: () => {}
      },
      cookieEncoding: "base64url"
    }
  );
}
