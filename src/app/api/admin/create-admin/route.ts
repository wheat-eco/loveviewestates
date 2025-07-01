import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { userId, email, fullName } = await request.json()

    // Validate required fields
    if (!userId || !email || !fullName) {
      return NextResponse.json({ message: "Missing required fields: userId, email, or fullName" }, { status: 400 })
    }

    // Check if this is the first user (should be admin)
    const { data: existingUsers, error: countError } = await supabase.from("users").select("id").limit(1)

    if (countError) {
      console.error("Error checking existing users:", countError)
      return NextResponse.json(
        { message: "Database error while checking existing users", error: countError.message },
        { status: 500 },
      )
    }

    // If no users exist, this will be the first admin
    const isFirstUser = !existingUsers || existingUsers.length === 0

    // Insert user into the users table
    const { data: userData, error: insertError } = await supabase
      .from("users")
      .insert({
        id: userId,
        full_name: fullName,
        email: email,
        role: isFirstUser ? "admin" : "user", // First user becomes admin
        phone: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting user:", insertError)

      // Check if it's a duplicate key error
      if (insertError.code === "23505") {
        return NextResponse.json({ message: "User already exists in the database" }, { status: 409 })
      }

      return NextResponse.json(
        { message: "Failed to create user in database", error: insertError.message },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: "Admin user created successfully",
      user: userData,
      isFirstUser,
    })
  } catch (error: any) {
    console.error("Unexpected error in create-admin:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
