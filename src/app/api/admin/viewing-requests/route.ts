import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"

    const supabase = await createClient()

    // Build query based on status filter
    let query = supabase.from("viewing_requests").select(`
        id,
        property_id,
        name,
        email,
        phone,
        preferred_date,
        message,
        status,
        created_at,
        properties (
          id,
          title,
          slug
        )
      `)

    // Filter by status if not "all"
    if (status !== "all") {
      query = query.eq("status", status)
    }

    // Order by created_at desc
    query = query.order("created_at", { ascending: false })

    // Execute query
    const { data: requests, error } = await query

    if (error) {
      console.error("Error fetching viewing requests:", error)
      return NextResponse.json(
        { success: false, message: "Failed to fetch viewing requests", error: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, requests })
  } catch (error) {
    console.error("Error in viewing requests API:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
