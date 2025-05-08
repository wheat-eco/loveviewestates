import { createServerSupabaseClient } from "@/utils/supabase/serve"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyType = searchParams.get("type") || "all"

    const supabase = await createServerSupabaseClient()

    // Build query based on property type
    let query = supabase.from("properties").select(`
      id,
      title,
      slug,
      property_type,
      property_category,
      price,
      status,
      bedrooms,
      bathrooms,
      areas!inner (
        id,
        name,
        regions!inner (
          id,
          name,
          slug
        )
      ),
      property_images (
        id,
        image_url,
        is_featured
      )
    `)

    // Filter by property type if not "all"
    if (propertyType !== "all") {
      query = query.eq("property_category", propertyType)
    }

    // Order by created_at desc
    query = query.order("created_at", { ascending: false })

    // Execute query
    const { data: properties, error } = await query

    if (error) {
      console.error("Error fetching properties:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ properties })
  } catch (error) {
    console.error("Error in properties API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
