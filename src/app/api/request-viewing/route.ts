import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const propertyId = formData.get("property_id") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const preferredDate = formData.get("preferred_date") as string
    const message = formData.get("message") as string

    // Basic validation
    if (!propertyId || !name || !email || !phone) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert viewing request
    const { data, error } = await supabase
      .from("viewing_requests")
      .insert({
        property_id: Number.parseInt(propertyId),
        name,
        email,
        phone,
        preferred_date: preferredDate || null,
        message: message || null,
        status: "pending",
      })
      .select()

    if (error) {
      console.error("Error submitting viewing request:", error)
      return NextResponse.json({ success: false, message: "Failed to submit viewing request" }, { status: 500 })
    }

    // Get property details for confirmation
    const { data: property } = await supabase
      .from("properties")
      .select("title")
      .eq("id", Number.parseInt(propertyId))
      .single()

    return NextResponse.json({
      success: true,
      message: "Viewing request submitted successfully",
      data: {
        requestId: data[0].id,
        propertyTitle: property?.title || "Property",
      },
    })
  } catch (error) {
    console.error("Error processing viewing request:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
