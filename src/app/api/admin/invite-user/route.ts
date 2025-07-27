
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { email, fullName, role } = await request.json()

  // Validate input
  if (!email || !fullName || !role) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 })
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if the current user is an admin or superadmin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 })
    }

    const { data: adminUser, error: adminError } = await supabase
      .from("admin")
      .select("role")
      .eq("id", user.id)
      .single()

    if (adminError || (adminUser.role !== "admin" && adminUser.role !== "superadmin")) {
      return NextResponse.json({ message: "Forbidden. You do not have permission to invite users." }, { status: 403 })
    }

    // Invite the new user via Supabase Auth
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName,
      },
      // Redirect to a password creation page after clicking the invite link
      // This skips the confirmation email with the token.
      redirectTo: `${new URL(request.url).origin}/admin/set-password`,
    })

    if (inviteError) {
      console.error("Supabase invite error:", inviteError)
      if (inviteError.message.includes("already registered")) {
        return NextResponse.json({ message: "This email is already registered as a user." }, { status: 409 })
      }
      return NextResponse.json({ message: inviteError.message }, { status: 500 })
    }

    if (!inviteData.user) {
      return NextResponse.json({ message: "Could not create invitation." }, { status: 500 })
    }

    // The user record is created by the invitation, but we also need to add it to our public `admin` table
    // so we can assign a role and manage them within our application.
    const { error: userInsertError } = await supabase
      .from("admin")
      .insert({
        id: inviteData.user.id,
        email: email,
        full_name: fullName,
        role: role, // 'admin' or 'superadmin'
      })

    if (userInsertError) {
      console.error("Error inserting invited user into admin table:", userInsertError)
      // If this insert fails, it's crucial to delete the auth user to prevent orphaned accounts.
      await supabase.auth.admin.deleteUser(inviteData.user.id)
      return NextResponse.json(
        { message: "Failed to create user record in database. The invitation has been cancelled." },
        { status: 500 },
      )
    }

    return NextResponse.json({ message: "Invitation sent successfully." })
  } catch (error: any) {
    console.error("Invite API error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
