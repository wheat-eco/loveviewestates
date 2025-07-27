
'use server'

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Using a query param to show the error on the login page
    return redirect(`/admin/login?message=${encodeURIComponent(error.message)}`)
  }

  // Redirect to the admin dashboard on successful login
  return redirect("/admin")
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect("/admin/login")
}
