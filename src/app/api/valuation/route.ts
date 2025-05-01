import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "postcode",
      "bedrooms",
      "property_type",
      "full_name",
      "email",
      "phone",
      "move_date",
      "valuation_type",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, message: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Convert checkbox values to numbers for database
    const marketingConsent = body.marketing_consent ? 1 : 0
    const termsConsent = body.terms_consent ? 1 : 0

    // Create Supabase client
    const supabase = await createClient()

    // Insert valuation request into database
    const { data, error } = await supabase
      .from("valuation_requests")
      .insert({
        postcode: body.postcode,
        bedrooms: body.bedrooms === "5+" ? 5 : Number.parseInt(body.bedrooms),
        property_type: body.property_type,
        full_name: body.full_name,
        email: body.email,
        phone: body.phone,
        move_date: body.move_date,
        marketing_consent: marketingConsent,
        terms_consent: termsConsent,
        valuation_type: body.valuation_type,
        status: "pending",
      })
      .select()

    if (error) {
      console.error("Error inserting valuation request:", error)
      return NextResponse.json({ success: false, message: "Failed to submit valuation request" }, { status: 500 })
    }

    // Send email notification (implementation would go here)
    // This could use a service like SendGrid, Mailgun, etc.

    return NextResponse.json({
      success: true,
      message: "Valuation request submitted successfully",
      data: data[0],
    })
  } catch (error) {
    console.error("Error processing valuation request:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
