import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, email, fullName } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ message: "User ID and email are required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Simply insert the admin record
    const { error: upsertError } = await supabase.from("admin").upsert(
      {
        id: userId,
        email: email,
        full_name: fullName || email.split("@")[0],
        role: "admin",
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )

    if (upsertError) {
      console.error("Error upserting admin:", upsertError)
      return NextResponse.json(
        {
          message: "Failed to create admin. Please run the SQL script first.",
          error: upsertError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: "Admin user created successfully",
      userId: userId,
    })
  } catch (error: any) {
    console.error("Create admin error:", error)
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 })
  }
}
