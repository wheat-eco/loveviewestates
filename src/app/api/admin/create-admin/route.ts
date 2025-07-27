
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// This function is for the initial setup. It will only work if no admin users exist.
export async function POST(request: NextRequest) {
  const { email, password, fullName } = await request.json()

  // Validate input
  if (!email || !password || !fullName) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 })
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })

    // CRITICAL: Check if any admin user already exists.
    const { count, error: countError } = await supabase
      .from("admin")
      .select("id", { count: "exact", head: true })

    if (countError) {
      console.error("Error checking for existing admins:", countError)
      return NextResponse.json({ message: "Database error while checking admins." }, { status: 500 })
    }

    if (count !== null && count > 0) {
      return NextResponse.json(
        { message: "An admin account already exists. New admins must be invited from the admin dashboard." },
        { status: 403 },
      )
    }

    // If no admins exist, proceed to create the first one.
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (signUpError) {
      console.error("Supabase signUp error:", signUpError)
      return NextResponse.json({ message: signUpError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ message: "User could not be created in authentication system." }, { status: 500 })
    }

    // Insert the user into the public 'admin' table with a 'superadmin' role.
    const { error: insertError } = await supabase
      .from("admin")
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        role: "superadmin", // First user is always a superadmin
      })

    if (insertError) {
      console.error("Error inserting user into admin table:", insertError)
      // Attempt to clean up the auth user if the database insert fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ message: "Failed to create user record in database." }, { status: 500 })
    }

    return NextResponse.json({ message: "Superadmin created successfully." })
  } catch (error: any) {
    console.error("Create admin API error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
